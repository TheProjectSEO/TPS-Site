'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/components/providers/CartProvider'
import { Badge } from '@/components/ui/badge'
import { Ticket, X } from 'lucide-react'

interface CouponInputProps {
  className?: string
}

export function CouponInput({ className }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([])
  const { applyCoupon } = useCart()

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplying(true)
    setMessage('')

    try {
      const result = await applyCoupon(couponCode.trim())
      
      if (result.success) {
        setMessageType('success')
        setMessage(result.message)
        setAppliedCoupons(prev => [...prev, couponCode.trim().toUpperCase()])
        setCouponCode('')
      } else {
        setMessageType('error')
        setMessage(result.message)
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Error applying coupon. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  const removeCoupon = (coupon: string) => {
    setAppliedCoupons(prev => prev.filter(c => c !== coupon))
    // In a real app, you'd call a removeCoupon function here
    setMessage('')
    setMessageType('')
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            className="text-sm"
          />
        </div>
        <Button
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || isApplying}
          size="sm"
          variant="outline"
          className="px-3"
        >
          {isApplying ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <Ticket className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Applied Coupons */}
      {appliedCoupons.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Applied coupons:</p>
          <div className="flex flex-wrap gap-2">
            {appliedCoupons.map((coupon) => (
              <Badge key={coupon} variant="secondary" className="text-xs">
                {coupon}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => removeCoupon(coupon)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`text-xs p-2 rounded ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Available Coupons Hint */}
      <div className="text-xs text-gray-500">
        <p>Try these codes:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setCouponCode('SAVE10')}>
            SAVE10
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setCouponCode('WELCOME20')}>
            WELCOME20
          </Badge>
          <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setCouponCode('SUMMER15')}>
            SUMMER15
          </Badge>
        </div>
      </div>
    </div>
  )
}