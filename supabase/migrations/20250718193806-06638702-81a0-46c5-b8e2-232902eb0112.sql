-- Rename content to content_plain for clarity in chapters table
ALTER TABLE public.chapters 
RENAME COLUMN content TO content_plain;

-- Rename image_description to alt_text for better UI/UX clarity in character_visual_references
ALTER TABLE public.character_visual_references 
RENAME COLUMN image_description TO alt_text;

-- Rename image_description to alt_text in chapter_visual_references as well
ALTER TABLE public.chapter_visual_references 
RENAME COLUMN image_notes TO alt_text;

-- Add caption field to visual references tables for additional descriptive text
ALTER TABLE public.character_visual_references 
ADD COLUMN IF NOT EXISTS caption text;

ALTER TABLE public.chapter_visual_references 
ADD COLUMN IF NOT EXISTS caption text;

-- Update comments on key fields for documentation
COMMENT ON COLUMN public.chapters.content_plain IS 'Plain text content of the chapter';
COMMENT ON COLUMN public.chapters.content_xml IS 'Rich XML/structured content of the chapter';
COMMENT ON COLUMN public.chapters.linked_characters IS 'Array of character names or IDs featured in this chapter';
COMMENT ON COLUMN public.chapters.linked_locations IS 'Array of location names or IDs featured in this chapter';
COMMENT ON COLUMN public.chapters.plot_triggers IS 'Specific events, twists, or plot points that occur';
COMMENT ON COLUMN public.chapters.themes IS 'Thematic tags for categorization and filtering';
COMMENT ON COLUMN public.chapters.motifs IS 'Visual or symbolic motifs present in the chapter';

-- Add comments to visual reference tables
COMMENT ON COLUMN public.character_visual_references.alt_text IS 'Alternative text description for accessibility';
COMMENT ON COLUMN public.character_visual_references.caption IS 'Descriptive caption or title for the image';
COMMENT ON COLUMN public.chapter_visual_references.alt_text IS 'Alternative text description for accessibility';
COMMENT ON COLUMN public.chapter_visual_references.caption IS 'Descriptive caption or title for the image';