-- Enhance character_profiles with array fields and additional metadata
ALTER TABLE public.character_profiles 
ADD COLUMN IF NOT EXISTS affiliations_array text[],
ADD COLUMN IF NOT EXISTS notable_traits_array text[],
ADD COLUMN IF NOT EXISTS catchphrases_array text[],
ADD COLUMN IF NOT EXISTS notable_features_array text[],
ADD COLUMN IF NOT EXISTS confidence_score float,
ADD COLUMN IF NOT EXISTS inferred boolean DEFAULT false;

-- Add indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_character_profiles_full_name ON public.character_profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_character_profiles_user_id ON public.character_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_character_profiles_timeline_anchor ON public.character_profiles(timeline_anchor);

-- Enhance character_relationships with foreign key reference
ALTER TABLE public.character_relationships 
ADD COLUMN IF NOT EXISTS related_character_id uuid,
ADD COLUMN IF NOT EXISTS is_bidirectional boolean DEFAULT false;

-- Enhance character_visual_references with image type
ALTER TABLE public.character_visual_references 
ADD COLUMN IF NOT EXISTS image_type text; -- concept art, reference, pose, etc.

-- Fix locations array types and add new fields
ALTER TABLE public.locations 
ADD COLUMN IF NOT EXISTS connected_characters text[],
ADD COLUMN IF NOT EXISTS related_artifacts text[],
ADD COLUMN IF NOT EXISTS visual_references jsonb,
ADD COLUMN IF NOT EXISTS atmosphere_rating text; -- foreboding, serene, chaotic, etc.

-- Enhance stories with additional metadata
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS structure jsonb, -- acts, beats, scenes structure
ADD COLUMN IF NOT EXISTS narrative_devices text[], -- unreliable narrator, in media res, etc.
ADD COLUMN IF NOT EXISTS estimated_read_time_minutes integer,
ADD COLUMN IF NOT EXISTS series_id uuid; -- for multi-story arcs

-- Enhance chapters with rich metadata fields
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS tone text, -- tense, hopeful, dark
ADD COLUMN IF NOT EXISTS narrative_purpose text, -- setup, reversal, climax
ADD COLUMN IF NOT EXISTS plot_triggers text[], -- specific events or twists
ADD COLUMN IF NOT EXISTS linked_characters text[], -- characters featured
ADD COLUMN IF NOT EXISTS linked_locations text[], -- locations featured
ADD COLUMN IF NOT EXISTS themes text[], -- thematic tags
ADD COLUMN IF NOT EXISTS motifs text[], -- visual or thematic motifs
ADD COLUMN IF NOT EXISTS emotional_impact text, -- reader/character impact
ADD COLUMN IF NOT EXISTS content_xml text; -- rich XML content storage

-- Create chapter_visual_references table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.chapter_visual_references (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id UUID NOT NULL,
    image_url text,
    image_type text, -- concept, mood, reference, etc.
    image_notes text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapter_tags table for flexible tagging (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.chapter_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id UUID NOT NULL,
    tag text NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(chapter_id, tag)
);

-- Enable RLS on new tables
ALTER TABLE public.chapter_visual_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_tags ENABLE ROW LEVEL SECURITY;

-- Create function to get chapter user_id
CREATE OR REPLACE FUNCTION public.get_chapter_user_id(chapter_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT user_id FROM public.chapters WHERE id = chapter_uuid;
$function$;

-- RLS policies for chapter_visual_references
CREATE POLICY "Users can view their own chapter visual references" 
ON public.chapter_visual_references 
FOR SELECT 
USING (auth.uid() = get_chapter_user_id(chapter_id));

CREATE POLICY "Users can create visual references for their chapters" 
ON public.chapter_visual_references 
FOR INSERT 
WITH CHECK (auth.uid() = get_chapter_user_id(chapter_id));

CREATE POLICY "Users can update visual references for their chapters" 
ON public.chapter_visual_references 
FOR UPDATE 
USING (auth.uid() = get_chapter_user_id(chapter_id));

CREATE POLICY "Users can delete visual references for their chapters" 
ON public.chapter_visual_references 
FOR DELETE 
USING (auth.uid() = get_chapter_user_id(chapter_id));

-- RLS policies for chapter_tags
CREATE POLICY "Users can view their own chapter tags" 
ON public.chapter_tags 
FOR SELECT 
USING (auth.uid() = get_chapter_user_id(chapter_id));

CREATE POLICY "Users can create tags for their chapters" 
ON public.chapter_tags 
FOR INSERT 
WITH CHECK (auth.uid() = get_chapter_user_id(chapter_id));

CREATE POLICY "Users can update tags for their chapters" 
ON public.chapter_tags 
FOR UPDATE 
USING (auth.uid() = get_chapter_user_id(chapter_id));

CREATE POLICY "Users can delete tags for their chapters" 
ON public.chapter_tags 
FOR DELETE 
USING (auth.uid() = get_chapter_user_id(chapter_id));

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_series_id ON public.stories(series_id);
CREATE INDEX IF NOT EXISTS idx_chapters_story_id ON public.chapters(story_id);
CREATE INDEX IF NOT EXISTS idx_chapters_user_id ON public.chapters(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_chapter_number ON public.chapters(chapter_number);
CREATE INDEX IF NOT EXISTS idx_chapter_visual_references_chapter_id ON public.chapter_visual_references(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_tags_chapter_id ON public.chapter_tags(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_tags_tag ON public.chapter_tags(tag);