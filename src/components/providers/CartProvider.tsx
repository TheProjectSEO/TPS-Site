'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase'

interface CartItem {
  id: string
  product_id: string
  product_title: string
  product_image: string
  price: number
  originalPrice: number
  quantity: number
  selected_date: string | null
  city: string
  duration: string | null
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    description: string
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  applyDiscount: (itemId: string, discount: CartItem['discount']) => Promise<void>
  removeDiscount: (itemId: string) => Promise<void>
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string }>
  totalPrice: number
  originalTotalPrice: number
  totalDiscount: number
  totalItems: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  const originalTotalPrice = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalDiscount = originalTotalPrice - totalPrice
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Load cart items for authenticated user
  useEffect(() => {
    if (user) {
      loadCartItems()
    } else {
      setItems([])
    }
  }, [user])

  const loadCartItems = async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          selected_date,
          experiences:product_id (
            title,
            price,
            main_image_url,
            duration,
            cities:city_id (
              name
            )
          )
        `)
        .eq('user_id', user.id)

      if (error) {
        console.warn('Cart table may not exist yet:', error.message)
        setItems([])
        return
      }

      const cartItems: CartItem[] = (data || []).map((item: any) => {
        const originalPrice = item.experiences?.price || 0
        let finalPrice = originalPrice
        let discount = undefined

        // Apply automatic discounts based on quantity or other criteria
        if (item.quantity >= 5) {
          discount = {
            type: 'percentage' as const,
            value: 15,
            description: 'Group discount (5+ people)'
          }
          finalPrice = originalPrice * 0.85 // 15% off
        } else if (item.quantity >= 3) {
          discount = {
            type: 'percentage' as const,
            value: 10,
            description: 'Group discount (3+ people)'
          }
          finalPrice = originalPrice * 0.90 // 10% off
        }

        return {
          id: item.id,
          product_id: item.product_id,
          product_title: item.experiences?.title || 'Unknown Product',
          product_image: item.experiences?.main_image_url || '',
          originalPrice,
          price: finalPrice,
          quantity: item.quantity,
          selected_date: item.selected_date,
          city: item.experiences?.cities?.name || 'Unknown City',
          duration: item.experiences?.duration || 'Unknown Duration',
          discount
        }
      })

      setItems(cartItems)
    } catch (error) {
      console.warn('Cart functionality not available:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (newItem: Omit<CartItem, 'id'>) => {
    if (!user) {
      // For non-authenticated users, you might want to store in localStorage
      // or prompt them to sign in
      return
    }

    setLoading(true)
    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => 
        item.product_id === newItem.product_id && 
        item.selected_date === newItem.selected_date
      )

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + newItem.quantity)
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: newItem.product_id,
            quantity: newItem.quantity,
            selected_date: newItem.selected_date,
          })
          .select()
          .single()

        if (error) throw error

        // Recalculate discount for the new item
        const newItemWithDefaults = {
          ...newItem,
          id: data.id,
          originalPrice: newItem.originalPrice || newItem.price,
        }
        setItems(prev => [...prev, newItemWithDefaults])
        // Reload cart to apply any automatic discounts
        loadCartItems()
      }
    } catch (error) {
      console.error('Error adding item to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing item from cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error

      // Reload cart to recalculate discounts based on new quantity
      loadCartItems()
    } catch (error) {
      console.error('Error updating cart item quantity:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyDiscount = async (itemId: string, discount: CartItem['discount']) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        let newPrice = item.originalPrice
        if (discount) {
          if (discount.type === 'percentage') {
            newPrice = item.originalPrice * (1 - discount.value / 100)
          } else if (discount.type === 'fixed') {
            newPrice = Math.max(0, item.originalPrice - discount.value)
          }
        }
        return { ...item, price: newPrice, discount }
      }
      return item
    }))
  }

  const removeDiscount = async (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, price: item.originalPrice, discount: undefined }
      }
      return item
    }))
  }

  const applyCoupon = async (couponCode: string): Promise<{ success: boolean; message: string }> => {
    // Mock coupon validation - in real app, this would call an API
    const validCoupons: Record<string, { type: 'percentage' | 'fixed'; value: number; description: string }> = {
      'SAVE10': { type: 'percentage', value: 10, description: '10% off your entire order' },
      'WELCOME20': { type: 'fixed', value: 20, description: '$20 off your first order' },
      'SUMMER15': { type: 'percentage', value: 15, description: 'Summer special - 15% off' }
    }

    const coupon = validCoupons[couponCode.toUpperCase()]
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' }
    }

    // Apply coupon to all items
    setItems(prev => prev.map(item => {
      let newPrice = item.originalPrice
      let newDiscount = coupon

      // If item already has a discount, keep the better one
      if (item.discount) {
        const existingDiscountAmount = item.originalPrice - item.price
        const couponDiscountAmount = coupon.type === 'percentage' 
          ? item.originalPrice * (coupon.value / 100)
          : coupon.value

        if (existingDiscountAmount >= couponDiscountAmount) {
          return item // Keep existing discount
        }
      }

      if (coupon.type === 'percentage') {
        newPrice = item.originalPrice * (1 - coupon.value / 100)
      } else if (coupon.type === 'fixed') {
        newPrice = Math.max(0, item.originalPrice - coupon.value)
      }

      return { ...item, price: newPrice, discount: newDiscount }
    }))

    return { success: true, message: `Coupon applied: ${coupon.description}` }
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyDiscount,
      removeDiscount,
      applyCoupon,
      totalPrice,
      originalTotalPrice,
      totalDiscount,
      totalItems,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  )
}