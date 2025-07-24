-- Add missing fields to category_pages table for S2, S3, S4 sections

ALTER TABLE category_pages
ADD COLUMN IF NOT EXISTS primary_ticket_list_heading VARCHAR(255) DEFAULT 'Available Tickets & Tours',
ADD COLUMN IF NOT EXISTS primary_ticket_list_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS primary_ticket_list_experience_ids TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS category_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS destination_upsell_heading VARCHAR(255) DEFAULT 'Make the most of Paris',
ADD COLUMN IF NOT EXISTS destination_upsell_enabled BOOLEAN DEFAULT true;