import { supabase } from '@/integrations/supabase/client';
import { ExtractedItem } from '@/components/StoryExtractionTool';
import { fileUploadService, FileUploadResult, FileProcessResult } from './fileUploadService';

export interface SaveResult {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface FileUploadData {
  file: File;
  chapterTitle?: string;
  storyId?: string;
}

export class DatabaseService {
  
  async saveExtractedData(extractedData: ExtractedItem[]): Promise<SaveResult> {
    const errors: string[] = [];
    let successCount = 0;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    for (const item of extractedData) {
      try {
        switch (item.type) {
          case 'character':
            await this.saveCharacter(item, user.id);
            break;
          case 'location':
            await this.saveLocation(item, user.id);
            break;
          case 'story':
            await this.saveStory(item, user.id);
            break;
          case 'chapter':
            await this.saveChapter(item, user.id);
            break;
          default:
            errors.push(`Unknown item type: ${item.type}`);
            continue;
        }
        successCount++;
      } catch (error) {
        errors.push(`Failed to save ${item.type}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return {
      success: errors.length === 0,
      message: `Successfully saved ${successCount} items${errors.length > 0 ? `, ${errors.length} failed` : ''}`,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async saveCharacter(item: ExtractedItem, userId: string) {
    const data = item.data;
    
    // Insert character profile
    const { data: characterProfile, error: profileError } = await supabase
      .from('character_profiles')
      .insert({
        user_id: userId,
        full_name: data.name || '',
        title: data.title || null,
        age: data.age || null,
        species_race: data.species || null,
        role_in_story: data.role || null,
        backstory: data.background || null,
        core_motivation: data.personality?.core_traits?.join(', ') || null,
        tragic_flaw: data.personality?.flaws?.join(', ') || null,
        emotional_tone: data.personality?.emotional_tone || null,
        voice_tone: data.quote || null,
        alignment: null,
        affiliations: data.relationships?.affiliations?.join(', ') || null,
        birthplace: null,
        summary_tagline: data.background || null,
        notable_traits: data.personality?.core_traits?.join(', ') || null,
        // Array fields
        affiliations_array: data.relationships?.affiliations || null,
        notable_traits_array: data.personality?.core_traits || null,
        catchphrases_array: data.quote ? [data.quote] : null,
        notable_features_array: data.visual_design?.accessories || null,
        confidence_score: item.confidence === 'extracted' ? 0.9 : 0.6,
        inferred: item.confidence === 'inferred',
        // Visual design fields
        outfit_breakdown: data.visual_design?.style_notes || null,
        pose_description: data.visual_design?.silhouette || null,
        silhouette_notes: data.visual_design?.silhouette || null,
        signature_weapon_tools: data.visual_design?.accessories?.join(', ') || null
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Save abilities
    if (data.abilities?.core_skills) {
      for (const skill of data.abilities.core_skills) {
        await supabase
          .from('character_abilities')
          .insert({
            character_id: characterProfile.id,
            ability_type: 'skill',
            name: skill,
            description: null
          });
      }
    }

    if (data.abilities?.powers) {
      for (const power of data.abilities.powers) {
        await supabase
          .from('character_abilities')
          .insert({
            character_id: characterProfile.id,
            ability_type: 'power',
            name: power,
            description: null
          });
      }
    }

    // Save relationships
    if (data.relationships?.allies) {
      for (const ally of data.relationships.allies) {
        await supabase
          .from('character_relationships')
          .insert({
            character_id: characterProfile.id,
            character_name: ally,
            relationship_type: 'ally',
            description: null
          });
      }
    }
  }

  private async saveLocation(item: ExtractedItem, userId: string) {
    const data = item.data;
    
    const { error } = await supabase
      .from('locations')
      .insert({
        user_id: userId,
        name: data.name || '',
        location_type: data.type || null,
        status: null,
        primary_function: data.description || null,
        access: null,
        summary: data.description || null,
        key_scenes: data.important_events || null,
        story_importance: null,
        visual_mood: data.visual_features?.join(', ') || null,
        sensory_details: null,
        weather_effects: null,
        cultural_feel: null,
        core_symbolism: data.themes?.join(', ') || null,
        recurring_motifs: data.themes || null,
        emotional_weight: null,
        timeline_anchor: null,
        notes: data.history || null,
        connected_characters: data.notable_residents || null,
        related_artifacts: null,
        visual_references: data.visual_features ? { features: data.visual_features } : null,
        atmosphere_rating: null
      });

    if (error) throw error;
  }

  private async saveStory(item: ExtractedItem, userId: string) {
    const data = item.data;
    
    const { error } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        title: data.title || '',
        summary: data.summary || null,
        genre: data.genre || null,
        status: 'draft',
        target_audience: null,
        word_count: 0,
        target_word_count: null,
        themes: data.themes || null,
        tags: data.main_characters || null,
        notes: data.author_notes || null,
        structure: data.world_rules ? { world_rules: data.world_rules } : null,
        narrative_devices: null,
        estimated_read_time_minutes: null,
        series_id: null
      });

    if (error) throw error;
  }

  private async saveChapter(item: ExtractedItem, userId: string) {
    const data = item.data;
    
    // First, we need to find or create a story for this chapter
    // For now, we'll create a placeholder story if none exists
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        title: 'Untitled Story',
        summary: 'Story extracted from content',
        status: 'draft'
      })
      .select()
      .single();

    if (storyError) throw storyError;

    const { error } = await supabase
      .from('chapters')
      .insert({
        story_id: story.id,
        user_id: userId,
        title: data.title || '',
        chapter_number: data.chapter_number || 1,
        content_plain: null,
        summary: data.summary || null,
        word_count: data.word_count || 0,
        status: 'draft',
        pov_character: data.POV_character || null,
        location: data.locations?.join(', ') || null,
        timeline_notes: null,
        notes: null,
        tone: data.tone || null,
        narrative_purpose: data.narrative_function || null,
        plot_triggers: data.events || null,
        linked_characters: data.characters_present || null,
        linked_locations: data.locations || null,
        themes: data.themes || null,
        motifs: null,
        emotional_impact: null,
        content_xml: null
      });

    if (error) throw error;
  }

  async uploadAndProcessFile(fileUploadData: FileUploadData): Promise<SaveResult> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }

      // Upload file to storage
      const uploadResult: FileUploadResult = await fileUploadService.uploadFile(
        fileUploadData.file, 
        user.id
      );

      if (!uploadResult.success || !uploadResult.filePath) {
        return {
          success: false,
          message: `File upload failed: ${uploadResult.error}`
        };
      }

      // Process file to extract content
      const processResult: FileProcessResult = await fileUploadService.processFile(uploadResult.filePath);

      if (!processResult.success || !processResult.extractedContent) {
        return {
          success: false,
          message: `File processing failed: ${processResult.error}`
        };
      }

      // Create or find story
      let storyId = fileUploadData.storyId;
      if (!storyId) {
        const { data: story, error: storyError } = await supabase
          .from('stories')
          .insert({
            user_id: user.id,
            title: 'Untitled Story',
            summary: 'Story created from uploaded file',
            status: 'draft'
          })
          .select()
          .single();

        if (storyError) {
          return {
            success: false,
            message: `Failed to create story: ${storyError.message}`
          };
        }
        storyId = story.id;
      }

      // Save chapter with extracted content
      const { error: chapterError } = await supabase
        .from('chapters')
        .insert({
          story_id: storyId,
          user_id: user.id,
          title: fileUploadData.chapterTitle || `Chapter from ${fileUploadData.file.name}`,
          chapter_number: 1,
          content_plain: processResult.extractedContent.plain,
          content_xml: processResult.extractedContent.xml,
          summary: `Content extracted from uploaded file: ${fileUploadData.file.name}`,
          word_count: processResult.extractedContent.plain.split(' ').length,
          status: 'draft'
        });

      if (chapterError) {
        return {
          success: false,
          message: `Failed to save chapter: ${chapterError.message}`
        };
      }

      return {
        success: true,
        message: `Successfully uploaded and processed file: ${fileUploadData.file.name}`
      };

    } catch (error) {
      return {
        success: false,
        message: `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }
}

export const databaseService = new DatabaseService();