export interface CategoryPageData {
  id: string
  category_slug: string
  category_name: string
  
  // Hero Block
  hero_title: string
  hero_subtitle: string
  hero_rating: number
  hero_rating_count: number
  hero_from_price: number
  hero_currency: string
  hero_badges: string[]
  hero_benefit_bullets: string[]
  hero_image_url: string
  hero_primary_cta_label: string
  
  // New sections
  primary_ticket_list_heading: string
  primary_ticket_list_enabled: boolean
  primary_ticket_list_experience_ids: string[]
  category_tags: string[]
  destination_upsell_heading: string
  destination_upsell_enabled: boolean
  
  // Content sections
  seo_intro_heading: string
  seo_intro_content: string
  things_to_know_heading: string
  things_to_know_items: any[]
  snapshot_guide_heading: string
  snapshot_guide_col1_heading: string
  snapshot_guide_col1_content: string
  snapshot_guide_col2_heading: string
  snapshot_guide_col2_content: string
  snapshot_guide_col3_heading: string
  snapshot_guide_col3_content: string
  ticket_scope_heading: string
  ticket_scope_inclusions: any[]
  ticket_scope_exclusions: any[]
  ticket_scope_notes: string
  photo_gallery_heading: string
  photo_gallery_images: any[]
  onsite_experiences_heading: string
  onsite_experiences_items: any[]
  reviews_heading: string
  reviews_avg_rating: number
  reviews_total_count: number
  reviews_distribution: any
  faq_heading: string
  faq_items: any[]
  related_content_heading: string
  related_content_items: any[]
  seo_tags: string[]
}