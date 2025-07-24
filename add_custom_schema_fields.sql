-- Migration to add custom_schema fields to all page types
-- This allows custom JSON-LD structured data to be added via CMS

-- Add custom_schema field to experiences table
ALTER TABLE experiences 
ADD COLUMN custom_schema JSONB DEFAULT NULL;

-- Add custom_schema field to blog_posts table  
ALTER TABLE blog_posts
ADD COLUMN custom_schema JSONB DEFAULT NULL;

-- Add custom_schema field to categories table
ALTER TABLE categories
ADD COLUMN custom_schema JSONB DEFAULT NULL;

-- Add custom_schema field to homepage_hero table
ALTER TABLE homepage_hero
ADD COLUMN custom_schema JSONB DEFAULT NULL;

-- Create a dedicated table for homepage schema management
CREATE TABLE IF NOT EXISTS homepage_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_section VARCHAR(50) NOT NULL, -- 'hero', 'featured', 'global', etc.
    custom_schema JSONB,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create unique constraint on page_section for homepage_schemas
CREATE UNIQUE INDEX IF NOT EXISTS homepage_schemas_section_unique 
ON homepage_schemas(page_section);

-- Add comments for documentation
COMMENT ON COLUMN experiences.custom_schema IS 'Custom JSON-LD structured data for tour/experience pages';
COMMENT ON COLUMN blog_posts.custom_schema IS 'Custom JSON-LD structured data for travel guide pages';
COMMENT ON COLUMN categories.custom_schema IS 'Custom JSON-LD structured data for category pages';
COMMENT ON COLUMN homepage_hero.custom_schema IS 'Custom JSON-LD structured data for homepage hero section';
COMMENT ON TABLE homepage_schemas IS 'Global homepage schema management for different sections';