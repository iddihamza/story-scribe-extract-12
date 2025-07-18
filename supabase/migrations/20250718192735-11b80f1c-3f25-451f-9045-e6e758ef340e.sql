-- Create stories table
CREATE TABLE public.stories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    genre TEXT,
    status TEXT DEFAULT 'draft',
    target_audience TEXT,
    word_count INTEGER DEFAULT 0,
    target_word_count INTEGER,
    themes TEXT[],
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID NOT NULL,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    content TEXT,
    summary TEXT,
    word_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    pov_character TEXT,
    location TEXT,
    timeline_notes TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(story_id, chapter_number)
);

-- Enable Row Level Security
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for stories
CREATE POLICY "Users can view their own stories" 
ON public.stories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stories" 
ON public.stories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" 
ON public.stories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" 
ON public.stories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for chapters
CREATE POLICY "Users can view their own chapters" 
ON public.chapters 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chapters" 
ON public.chapters 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chapters" 
ON public.chapters 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chapters" 
ON public.chapters 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to get story user_id for chapters
CREATE OR REPLACE FUNCTION public.get_story_user_id(story_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT user_id FROM public.stories WHERE id = story_uuid;
$function$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_stories_updated_at
BEFORE UPDATE ON public.stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
BEFORE UPDATE ON public.chapters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update story word count
CREATE OR REPLACE FUNCTION public.update_story_word_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.stories 
    SET word_count = (
        SELECT COALESCE(SUM(word_count), 0) 
        FROM public.chapters 
        WHERE story_id = COALESCE(NEW.story_id, OLD.story_id)
    )
    WHERE id = COALESCE(NEW.story_id, OLD.story_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update story word count when chapters change
CREATE TRIGGER update_story_word_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.chapters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_story_word_count();