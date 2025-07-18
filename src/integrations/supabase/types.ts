export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chapter_tags: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          tag: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id?: string
          tag: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          tag?: string
        }
        Relationships: []
      }
      chapter_visual_references: {
        Row: {
          alt_text: string | null
          caption: string | null
          chapter_id: string
          created_at: string
          id: string
          image_type: string | null
          image_url: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          chapter_id: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          chapter_id?: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          content_plain: string | null
          content_xml: string | null
          created_at: string
          emotional_impact: string | null
          id: string
          linked_characters: string[] | null
          linked_locations: string[] | null
          location: string | null
          motifs: string[] | null
          narrative_purpose: string | null
          notes: string | null
          plot_triggers: string[] | null
          pov_character: string | null
          status: string | null
          story_id: string
          summary: string | null
          themes: string[] | null
          timeline_notes: string | null
          title: string
          tone: string | null
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          chapter_number: number
          content_plain?: string | null
          content_xml?: string | null
          created_at?: string
          emotional_impact?: string | null
          id?: string
          linked_characters?: string[] | null
          linked_locations?: string[] | null
          location?: string | null
          motifs?: string[] | null
          narrative_purpose?: string | null
          notes?: string | null
          plot_triggers?: string[] | null
          pov_character?: string | null
          status?: string | null
          story_id: string
          summary?: string | null
          themes?: string[] | null
          timeline_notes?: string | null
          title: string
          tone?: string | null
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          chapter_number?: number
          content_plain?: string | null
          content_xml?: string | null
          created_at?: string
          emotional_impact?: string | null
          id?: string
          linked_characters?: string[] | null
          linked_locations?: string[] | null
          location?: string | null
          motifs?: string[] | null
          narrative_purpose?: string | null
          notes?: string | null
          plot_triggers?: string[] | null
          pov_character?: string | null
          status?: string | null
          story_id?: string
          summary?: string | null
          themes?: string[] | null
          timeline_notes?: string | null
          title?: string
          tone?: string | null
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      character_abilities: {
        Row: {
          ability_type: string
          character_id: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          ability_type: string
          character_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          ability_type?: string
          character_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_abilities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_inspirations: {
        Row: {
          character_id: string
          created_at: string
          id: string
          influence_name: string
          influence_type: string | null
          why_they_matter: string | null
        }
        Insert: {
          character_id: string
          created_at?: string
          id?: string
          influence_name: string
          influence_type?: string | null
          why_they_matter?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          influence_name?: string
          influence_type?: string | null
          why_they_matter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_inspirations_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_profiles: {
        Row: {
          accent_cultural_style: string | null
          affiliations: string | null
          affiliations_array: string[] | null
          age: string | null
          aliases_nicknames: string | null
          alignment: string | null
          artifacts_items: string | null
          backstory: string | null
          birthplace: string | null
          catchphrases: string | null
          catchphrases_array: string[] | null
          confidence_score: number | null
          connected_locations: string | null
          core_motivation: string | null
          core_themes: string | null
          created_at: string
          emotional_tone: string | null
          full_name: string
          gender: string | null
          glow_color: string | null
          height: string | null
          id: string
          inferred: boolean | null
          internal_conflict: string | null
          key_chapters: string | null
          notable_features: string | null
          notable_features_array: string[] | null
          notable_traits: string | null
          notable_traits_array: string[] | null
          outfit_breakdown: string | null
          pose_description: string | null
          pose_energy: string | null
          role_in_story: string | null
          signature_weapon_tools: string | null
          silhouette_notes: string | null
          smoke_metaphor: string | null
          smoke_style: string | null
          special_considerations: string | null
          species_race: string | null
          speech_pattern: string | null
          summary_tagline: string | null
          timeline_anchor: string | null
          title: string | null
          tragic_flaw: string | null
          updated_at: string
          user_id: string
          visual_motifs: string | null
          voice_tone: string | null
          weight: string | null
        }
        Insert: {
          accent_cultural_style?: string | null
          affiliations?: string | null
          affiliations_array?: string[] | null
          age?: string | null
          aliases_nicknames?: string | null
          alignment?: string | null
          artifacts_items?: string | null
          backstory?: string | null
          birthplace?: string | null
          catchphrases?: string | null
          catchphrases_array?: string[] | null
          confidence_score?: number | null
          connected_locations?: string | null
          core_motivation?: string | null
          core_themes?: string | null
          created_at?: string
          emotional_tone?: string | null
          full_name: string
          gender?: string | null
          glow_color?: string | null
          height?: string | null
          id?: string
          inferred?: boolean | null
          internal_conflict?: string | null
          key_chapters?: string | null
          notable_features?: string | null
          notable_features_array?: string[] | null
          notable_traits?: string | null
          notable_traits_array?: string[] | null
          outfit_breakdown?: string | null
          pose_description?: string | null
          pose_energy?: string | null
          role_in_story?: string | null
          signature_weapon_tools?: string | null
          silhouette_notes?: string | null
          smoke_metaphor?: string | null
          smoke_style?: string | null
          special_considerations?: string | null
          species_race?: string | null
          speech_pattern?: string | null
          summary_tagline?: string | null
          timeline_anchor?: string | null
          title?: string | null
          tragic_flaw?: string | null
          updated_at?: string
          user_id: string
          visual_motifs?: string | null
          voice_tone?: string | null
          weight?: string | null
        }
        Update: {
          accent_cultural_style?: string | null
          affiliations?: string | null
          affiliations_array?: string[] | null
          age?: string | null
          aliases_nicknames?: string | null
          alignment?: string | null
          artifacts_items?: string | null
          backstory?: string | null
          birthplace?: string | null
          catchphrases?: string | null
          catchphrases_array?: string[] | null
          confidence_score?: number | null
          connected_locations?: string | null
          core_motivation?: string | null
          core_themes?: string | null
          created_at?: string
          emotional_tone?: string | null
          full_name?: string
          gender?: string | null
          glow_color?: string | null
          height?: string | null
          id?: string
          inferred?: boolean | null
          internal_conflict?: string | null
          key_chapters?: string | null
          notable_features?: string | null
          notable_features_array?: string[] | null
          notable_traits?: string | null
          notable_traits_array?: string[] | null
          outfit_breakdown?: string | null
          pose_description?: string | null
          pose_energy?: string | null
          role_in_story?: string | null
          signature_weapon_tools?: string | null
          silhouette_notes?: string | null
          smoke_metaphor?: string | null
          smoke_style?: string | null
          special_considerations?: string | null
          species_race?: string | null
          speech_pattern?: string | null
          summary_tagline?: string | null
          timeline_anchor?: string | null
          title?: string | null
          tragic_flaw?: string | null
          updated_at?: string
          user_id?: string
          visual_motifs?: string | null
          voice_tone?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      character_relationships: {
        Row: {
          character_id: string
          character_name: string
          created_at: string
          description: string | null
          id: string
          is_bidirectional: boolean | null
          related_character_id: string | null
          relationship_type: string
        }
        Insert: {
          character_id: string
          character_name: string
          created_at?: string
          description?: string | null
          id?: string
          is_bidirectional?: boolean | null
          related_character_id?: string | null
          relationship_type: string
        }
        Update: {
          character_id?: string
          character_name?: string
          created_at?: string
          description?: string | null
          id?: string
          is_bidirectional?: boolean | null
          related_character_id?: string | null
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_relationships_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_visual_references: {
        Row: {
          alt_text: string | null
          caption: string | null
          character_id: string
          created_at: string
          id: string
          image_type: string | null
          image_url: string | null
          notes: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          character_id: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
          notes?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          character_id?: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_visual_references_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_weaknesses: {
        Row: {
          character_id: string
          created_at: string
          description: string | null
          id: string
          weakness_name: string
        }
        Insert: {
          character_id: string
          created_at?: string
          description?: string | null
          id?: string
          weakness_name: string
        }
        Update: {
          character_id?: string
          created_at?: string
          description?: string | null
          id?: string
          weakness_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_weaknesses_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          access: string | null
          atmosphere_rating: string | null
          connected_characters: string[] | null
          core_symbolism: string | null
          created_at: string
          cultural_feel: string | null
          emotional_weight: string | null
          id: string
          key_scenes: string[] | null
          location_type: string | null
          name: string
          notes: string | null
          primary_function: string | null
          recurring_motifs: string[] | null
          related_artifacts: string[] | null
          sensory_details: string | null
          status: string | null
          story_importance: string | null
          summary: string | null
          timeline_anchor: string | null
          updated_at: string
          user_id: string
          visual_mood: string | null
          visual_references: Json | null
          weather_effects: string | null
        }
        Insert: {
          access?: string | null
          atmosphere_rating?: string | null
          connected_characters?: string[] | null
          core_symbolism?: string | null
          created_at?: string
          cultural_feel?: string | null
          emotional_weight?: string | null
          id?: string
          key_scenes?: string[] | null
          location_type?: string | null
          name: string
          notes?: string | null
          primary_function?: string | null
          recurring_motifs?: string[] | null
          related_artifacts?: string[] | null
          sensory_details?: string | null
          status?: string | null
          story_importance?: string | null
          summary?: string | null
          timeline_anchor?: string | null
          updated_at?: string
          user_id: string
          visual_mood?: string | null
          visual_references?: Json | null
          weather_effects?: string | null
        }
        Update: {
          access?: string | null
          atmosphere_rating?: string | null
          connected_characters?: string[] | null
          core_symbolism?: string | null
          created_at?: string
          cultural_feel?: string | null
          emotional_weight?: string | null
          id?: string
          key_scenes?: string[] | null
          location_type?: string | null
          name?: string
          notes?: string | null
          primary_function?: string | null
          recurring_motifs?: string[] | null
          related_artifacts?: string[] | null
          sensory_details?: string | null
          status?: string | null
          story_importance?: string | null
          summary?: string | null
          timeline_anchor?: string | null
          updated_at?: string
          user_id?: string
          visual_mood?: string | null
          visual_references?: Json | null
          weather_effects?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          created_at: string
          estimated_read_time_minutes: number | null
          genre: string | null
          id: string
          narrative_devices: string[] | null
          notes: string | null
          series_id: string | null
          status: string | null
          structure: Json | null
          summary: string | null
          tags: string[] | null
          target_audience: string | null
          target_word_count: number | null
          themes: string[] | null
          title: string
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          created_at?: string
          estimated_read_time_minutes?: number | null
          genre?: string | null
          id?: string
          narrative_devices?: string[] | null
          notes?: string | null
          series_id?: string | null
          status?: string | null
          structure?: Json | null
          summary?: string | null
          tags?: string[] | null
          target_audience?: string | null
          target_word_count?: number | null
          themes?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          created_at?: string
          estimated_read_time_minutes?: number | null
          genre?: string | null
          id?: string
          narrative_devices?: string[] | null
          notes?: string | null
          series_id?: string | null
          status?: string | null
          structure?: Json | null
          summary?: string | null
          tags?: string[] | null
          target_audience?: string | null
          target_word_count?: number | null
          themes?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_chapter_user_id: {
        Args: { chapter_uuid: string }
        Returns: string
      }
      get_character_profile_user_id: {
        Args: { character_uuid: string }
        Returns: string
      }
      get_character_user_id: {
        Args: { character_uuid: string }
        Returns: string
      }
      get_story_user_id: {
        Args: { story_uuid: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
