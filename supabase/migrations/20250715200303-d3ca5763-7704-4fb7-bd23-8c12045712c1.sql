-- Create main characters table
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id VARCHAR(255) NOT NULL,
  
  -- Identity
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  species VARCHAR(255),
  gender VARCHAR(50),
  age INTEGER,
  height VARCHAR(50),
  weight VARCHAR(50),
  birthplace VARCHAR(255),
  alignment VARCHAR(100),
  voice_tone TEXT,
  notable_traits TEXT[],
  
  -- Visual Design
  glow_color VARCHAR(7), -- hex color
  pose_description TEXT,
  silhouette_notes TEXT,
  signature_weapon VARCHAR(255),
  notable_features TEXT[],
  outfit_summary TEXT,
  typography_positioning VARCHAR(255),
  smoke_style TEXT,
  special_considerations TEXT,
  
  -- Style Alignment
  category VARCHAR(100),
  mood VARCHAR(100),
  poster_type VARCHAR(100),
  preferred_fonts TEXT[],
  visual_flow VARCHAR(255),
  composition_bias VARCHAR(100),
  grounding_method VARCHAR(100),
  
  -- Narrative Hooks
  summary TEXT,
  core_motivation TEXT,
  tragic_flaw TEXT,
  internal_conflict TEXT,
  backstory TEXT,
  
  -- Voice and Dialogue
  speech_pattern TEXT,
  emotional_tone VARCHAR(255),
  accent VARCHAR(255),
  
  -- Symbolism
  smoke_metaphor TEXT,
  pose_energy TEXT,
  
  -- Integration Notes
  timeline_anchor VARCHAR(255),
  visibility_guidelines TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, character_id)
);

-- Create character aliases table
CREATE TABLE public.character_aliases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  alias VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character affiliations table
CREATE TABLE public.character_affiliations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  affiliation VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character powers table
CREATE TABLE public.character_powers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  power VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character skills table
CREATE TABLE public.character_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  skill VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character weaknesses table
CREATE TABLE public.character_weaknesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  weakness VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character allies table
CREATE TABLE public.character_allies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  ally VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character rivals table
CREATE TABLE public.character_rivals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  rival VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character antagonists table
CREATE TABLE public.character_antagonists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  antagonist VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character themes table
CREATE TABLE public.character_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  theme VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character motifs table
CREATE TABLE public.character_motifs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  motif VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character catchphrases table
CREATE TABLE public.character_catchphrases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  catchphrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character locations table
CREATE TABLE public.character_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create character artifacts table
CREATE TABLE public.character_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  artifact VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_powers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_weaknesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_allies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_rivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_antagonists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_motifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_catchphrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_artifacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for characters table
CREATE POLICY "Users can view their own characters" ON public.characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters" ON public.characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" ON public.characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" ON public.characters
  FOR DELETE USING (auth.uid() = user_id);

-- Create helper function for character ownership
CREATE OR REPLACE FUNCTION public.get_character_user_id(character_uuid UUID)
RETURNS UUID AS $$
  SELECT user_id FROM public.characters WHERE id = character_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create RLS policies for related tables (using the helper function)
CREATE POLICY "Users can view their character aliases" ON public.character_aliases
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character aliases" ON public.character_aliases
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character aliases" ON public.character_aliases
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character aliases" ON public.character_aliases
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Apply similar policies to all related tables
CREATE POLICY "Users can view their character affiliations" ON public.character_affiliations
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character affiliations" ON public.character_affiliations
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character affiliations" ON public.character_affiliations
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character affiliations" ON public.character_affiliations
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Powers policies
CREATE POLICY "Users can view their character powers" ON public.character_powers
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character powers" ON public.character_powers
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character powers" ON public.character_powers
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character powers" ON public.character_powers
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Skills policies
CREATE POLICY "Users can view their character skills" ON public.character_skills
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character skills" ON public.character_skills
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character skills" ON public.character_skills
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character skills" ON public.character_skills
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Weaknesses policies
CREATE POLICY "Users can view their character weaknesses" ON public.character_weaknesses
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character weaknesses" ON public.character_weaknesses
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character weaknesses" ON public.character_weaknesses
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character weaknesses" ON public.character_weaknesses
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Allies policies
CREATE POLICY "Users can view their character allies" ON public.character_allies
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character allies" ON public.character_allies
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character allies" ON public.character_allies
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character allies" ON public.character_allies
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Rivals policies
CREATE POLICY "Users can view their character rivals" ON public.character_rivals
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character rivals" ON public.character_rivals
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character rivals" ON public.character_rivals
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character rivals" ON public.character_rivals
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Antagonists policies
CREATE POLICY "Users can view their character antagonists" ON public.character_antagonists
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character antagonists" ON public.character_antagonists
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character antagonists" ON public.character_antagonists
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character antagonists" ON public.character_antagonists
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Themes policies
CREATE POLICY "Users can view their character themes" ON public.character_themes
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character themes" ON public.character_themes
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character themes" ON public.character_themes
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character themes" ON public.character_themes
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Motifs policies
CREATE POLICY "Users can view their character motifs" ON public.character_motifs
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character motifs" ON public.character_motifs
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character motifs" ON public.character_motifs
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character motifs" ON public.character_motifs
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Catchphrases policies
CREATE POLICY "Users can view their character catchphrases" ON public.character_catchphrases
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character catchphrases" ON public.character_catchphrases
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character catchphrases" ON public.character_catchphrases
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character catchphrases" ON public.character_catchphrases
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Locations policies
CREATE POLICY "Users can view their character locations" ON public.character_locations
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character locations" ON public.character_locations
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character locations" ON public.character_locations
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character locations" ON public.character_locations
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Artifacts policies
CREATE POLICY "Users can view their character artifacts" ON public.character_artifacts
  FOR SELECT USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can create their character artifacts" ON public.character_artifacts
  FOR INSERT WITH CHECK (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can update their character artifacts" ON public.character_artifacts
  FOR UPDATE USING (auth.uid() = public.get_character_user_id(character_id));

CREATE POLICY "Users can delete their character artifacts" ON public.character_artifacts
  FOR DELETE USING (auth.uid() = public.get_character_user_id(character_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_characters_character_id ON public.characters(character_id);
CREATE INDEX idx_character_aliases_character_id ON public.character_aliases(character_id);
CREATE INDEX idx_character_affiliations_character_id ON public.character_affiliations(character_id);
CREATE INDEX idx_character_powers_character_id ON public.character_powers(character_id);
CREATE INDEX idx_character_skills_character_id ON public.character_skills(character_id);
CREATE INDEX idx_character_weaknesses_character_id ON public.character_weaknesses(character_id);
CREATE INDEX idx_character_allies_character_id ON public.character_allies(character_id);
CREATE INDEX idx_character_rivals_character_id ON public.character_rivals(character_id);
CREATE INDEX idx_character_antagonists_character_id ON public.character_antagonists(character_id);
CREATE INDEX idx_character_themes_character_id ON public.character_themes(character_id);
CREATE INDEX idx_character_motifs_character_id ON public.character_motifs(character_id);
CREATE INDEX idx_character_catchphrases_character_id ON public.character_catchphrases(character_id);
CREATE INDEX idx_character_locations_character_id ON public.character_locations(character_id);
CREATE INDEX idx_character_artifacts_character_id ON public.character_artifacts(character_id);