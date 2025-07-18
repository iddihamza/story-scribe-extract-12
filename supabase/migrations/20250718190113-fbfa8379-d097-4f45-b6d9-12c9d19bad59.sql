-- Create comprehensive character profile database

-- Main character profiles table with core identity
CREATE TABLE public.character_profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    
    -- Core Identity
    full_name text NOT NULL,
    title text,
    aliases_nicknames text,
    species_race text,
    gender text,
    age text,
    height text,
    weight text,
    birthplace text,
    affiliations text,
    alignment text,
    voice_tone text,
    notable_traits text,
    
    -- Narrative Hooks
    summary_tagline text,
    core_motivation text,
    tragic_flaw text,
    internal_conflict text,
    backstory text,
    role_in_story text,
    
    -- Personality & Dialogue
    speech_pattern text,
    emotional_tone text,
    catchphrases text,
    accent_cultural_style text,
    
    -- Visual Design
    glow_color text,
    notable_features text,
    signature_weapon_tools text,
    outfit_breakdown text,
    pose_description text,
    silhouette_notes text,
    smoke_style text,
    special_considerations text,
    
    -- Story Integration
    timeline_anchor text,
    key_chapters text,
    connected_locations text,
    artifacts_items text,
    
    -- Symbolism & Themes
    core_themes text,
    visual_motifs text,
    smoke_metaphor text,
    pose_energy text,
    
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Character relationships table (one-to-many)
CREATE TABLE public.character_relationships (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id uuid NOT NULL REFERENCES public.character_profiles(id) ON DELETE CASCADE,
    relationship_type text NOT NULL CHECK (relationship_type IN ('ally', 'rival', 'antagonist', 'romantic_connection', 'linked_character')),
    character_name text NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Character abilities table (one-to-many)
CREATE TABLE public.character_abilities (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id uuid NOT NULL REFERENCES public.character_profiles(id) ON DELETE CASCADE,
    ability_type text NOT NULL CHECK (ability_type IN ('power', 'skill')),
    name text NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Character weaknesses table (one-to-many)
CREATE TABLE public.character_weaknesses (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id uuid NOT NULL REFERENCES public.character_profiles(id) ON DELETE CASCADE,
    weakness_name text NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Character visual references table (one-to-many)
CREATE TABLE public.character_visual_references (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id uuid NOT NULL REFERENCES public.character_profiles(id) ON DELETE CASCADE,
    image_url text,
    image_description text,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Character inspirations table (one-to-many)
CREATE TABLE public.character_inspirations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id uuid NOT NULL REFERENCES public.character_profiles(id) ON DELETE CASCADE,
    influence_name text NOT NULL,
    influence_type text, -- e.g., Actor, Archetype, Character, etc.
    why_they_matter text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.character_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_abilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_weaknesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_visual_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_inspirations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for character_profiles
CREATE POLICY "Users can view their own character profiles" 
ON public.character_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own character profiles" 
ON public.character_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own character profiles" 
ON public.character_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own character profiles" 
ON public.character_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to get character user_id for related tables
CREATE OR REPLACE FUNCTION public.get_character_profile_user_id(character_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT user_id FROM public.character_profiles WHERE id = character_uuid;
$$;

-- Create RLS policies for character_relationships
CREATE POLICY "Users can view their own character relationships" 
ON public.character_relationships 
FOR SELECT 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can create relationships for their characters" 
ON public.character_relationships 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can update relationships for their characters" 
ON public.character_relationships 
FOR UPDATE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can delete relationships for their characters" 
ON public.character_relationships 
FOR DELETE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

-- Create RLS policies for character_abilities
CREATE POLICY "Users can view their own character abilities" 
ON public.character_abilities 
FOR SELECT 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can create abilities for their characters" 
ON public.character_abilities 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can update abilities for their characters" 
ON public.character_abilities 
FOR UPDATE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can delete abilities for their characters" 
ON public.character_abilities 
FOR DELETE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

-- Create RLS policies for character_weaknesses
CREATE POLICY "Users can view their own character weaknesses" 
ON public.character_weaknesses 
FOR SELECT 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can create weaknesses for their characters" 
ON public.character_weaknesses 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can update weaknesses for their characters" 
ON public.character_weaknesses 
FOR UPDATE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can delete weaknesses for their characters" 
ON public.character_weaknesses 
FOR DELETE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

-- Create RLS policies for character_visual_references
CREATE POLICY "Users can view their own character visual references" 
ON public.character_visual_references 
FOR SELECT 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can create visual references for their characters" 
ON public.character_visual_references 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can update visual references for their characters" 
ON public.character_visual_references 
FOR UPDATE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can delete visual references for their characters" 
ON public.character_visual_references 
FOR DELETE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

-- Create RLS policies for character_inspirations
CREATE POLICY "Users can view their own character inspirations" 
ON public.character_inspirations 
FOR SELECT 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can create inspirations for their characters" 
ON public.character_inspirations 
FOR INSERT 
WITH CHECK (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can update inspirations for their characters" 
ON public.character_inspirations 
FOR UPDATE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

CREATE POLICY "Users can delete inspirations for their characters" 
ON public.character_inspirations 
FOR DELETE 
USING (auth.uid() = public.get_character_profile_user_id(character_id));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_character_profiles_updated_at
BEFORE UPDATE ON public.character_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_character_profiles_user_id ON public.character_profiles(user_id);
CREATE INDEX idx_character_relationships_character_id ON public.character_relationships(character_id);
CREATE INDEX idx_character_relationships_type ON public.character_relationships(relationship_type);
CREATE INDEX idx_character_abilities_character_id ON public.character_abilities(character_id);
CREATE INDEX idx_character_abilities_type ON public.character_abilities(ability_type);
CREATE INDEX idx_character_weaknesses_character_id ON public.character_weaknesses(character_id);
CREATE INDEX idx_character_visual_references_character_id ON public.character_visual_references(character_id);
CREATE INDEX idx_character_inspirations_character_id ON public.character_inspirations(character_id);