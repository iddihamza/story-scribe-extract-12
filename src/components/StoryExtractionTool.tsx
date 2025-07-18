import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProcessIndicator } from './ProcessIndicator';
import { ContentInput } from './ContentInput';
import { ExtractedResults } from './ExtractedResults';
import { TemplatesSection } from './TemplatesSection';
import { AuthModal } from './AuthModal';
import { SavedDataViewer } from './SavedDataViewer';
import { useAuth } from '@/hooks/useAuth';

export interface ExtractedItem {
  type: 'character' | 'location' | 'story' | 'chapter';
  confidence: 'extracted' | 'inferred';
  data: Record<string, any>;
  inferred_fields?: string[];
  missing_fields?: string[];
  source: string;
}

const SAMPLE_CONTENT = `Elias Hart, a 34-year-old scholar, worked late nights in the dusty archives of Ashmoor University. Known for his meticulous research and guarded demeanor, he specialized in ancient texts and forgotten languages. The university itself was a sprawling Gothic campus built in 1847, infamous for supernatural occurrences.

Luna Blackwood lived deep in the Whispering Woods, a dense forest that bordered the university grounds. As the village's herbalist, she possessed knowledge of medicinal plants and old remedies passed down through generations.

The Awakening Ceremony took place on the autumn equinox, when the barrier between worlds grew thin. During this ritual, Elias discovered his latent abilities while Luna guided him through the transformation.`;

export const StoryExtractionTool: React.FC = () => {
  const [content, setContent] = useState(SAMPLE_CONTENT);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['character', 'location', 'story']);
  const [extractedData, setExtractedData] = useState<ExtractedItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, signOut, isAuthenticated } = useAuth();

  const handleExtractContent = async () => {
    if (!content.trim()) {
      alert('Please enter some content to extract');
      return;
    }

    if (selectedTemplates.length === 0) {
      alert('Please select at least one template');
      return;
    }

    setCurrentStep(2);
    setIsExtracting(true);
    
    // Simulate extraction processing
    setTimeout(() => {
      const results = simulateExtraction(content, selectedTemplates);
      setExtractedData(results);
      setCurrentStep(3);
      setIsExtracting(false);
    }, 2000);
  };

  const simulateExtraction = (content: string, templates: string[]): ExtractedItem[] => {
    const results: ExtractedItem[] = [];
    
    // Character extraction
    if (templates.includes('character')) {
      if (content.includes('Elias Hart')) {
        results.push({
          type: 'character',
          confidence: 'extracted',
          data: {
            id: 'char_elias_hart',
            name: 'Elias Hart',
            title: 'Scholar',
            age: '34',
            species: 'Human',
            role: 'Protagonist',
            background: 'Works in university archives, specializes in ancient texts',
            personality: {
              core_traits: ['meticulous', 'scholarly', 'guarded'],
              flaws: ['overly cautious', 'socially distant'],
              emotional_tone: 'reserved but passionate about knowledge'
            },
            visual_design: {
              silhouette: 'tall, lean academic figure',
              style_notes: 'worn scholarly robes, glasses',
              accessories: ['ancient tome', 'research notes']
            },
            abilities: {
              core_skills: ['research', 'ancient languages', 'pattern recognition'],
              powers: ['latent magical abilities (discovered later)']
            },
            relationships: {
              allies: ['Luna Blackwood'],
              rivals: [],
              mentor: '',
              affiliations: ['Ashmoor University']
            },
            appearance_in_chapters: [1, 2, 3],
            tags: ['scholar', 'protagonist', 'magic-user'],
            quote: 'Knowledge is the key that unlocks all mysteries.'
          },
          inferred_fields: ['personality', 'visual_design', 'abilities', 'quote'],
          source: 'Elias Hart, a 34-year-old scholar, worked late nights in the dusty archives...'
        });
      }
      
      if (content.includes('Luna Blackwood')) {
        results.push({
          type: 'character',
          confidence: 'extracted',
          data: {
            id: 'char_luna_blackwood',
            name: 'Luna Blackwood',
            title: 'Village Herbalist',
            age: '',
            species: 'Human',
            role: 'Mentor/Guide',
            background: 'Lives in Whispering Woods, keeper of ancient remedies',
            personality: {
              core_traits: ['wise', 'nurturing', 'mysterious'],
              flaws: ['secretive', 'overly protective'],
              emotional_tone: 'calm and knowing'
            },
            visual_design: {
              silhouette: 'graceful forest dweller',
              style_notes: 'earth-toned robes, nature accessories',
              accessories: ['herb pouch', 'carved staff']
            },
            abilities: {
              core_skills: ['herbalism', 'healing', 'nature lore'],
              powers: ['plant magic', 'ritual guidance']
            },
            relationships: {
              allies: ['Elias Hart'],
              rivals: [],
              mentor: '',
              affiliations: ['Whispering Woods', 'Village Healers']
            },
            appearance_in_chapters: [2, 3],
            tags: ['herbalist', 'mentor', 'nature-magic'],
            quote: 'The forest speaks to those who know how to listen.'
          },
          inferred_fields: ['personality', 'visual_design', 'abilities', 'quote'],
          missing_fields: ['age'],
          source: 'Luna Blackwood lived deep in the Whispering Woods...'
        });
      }
    }

    // Location extraction
    if (templates.includes('location')) {
      if (content.includes('Ashmoor University')) {
        results.push({
          type: 'location',
          confidence: 'extracted',
          data: {
            id: 'loc_ashmoor_university',
            name: 'Ashmoor University',
            type: 'Educational Institution',
            region: 'Academic District',
            description: 'Sprawling Gothic campus with dusty archives and ancient knowledge',
            history: 'Built in 1847, long history of supernatural occurrences',
            important_events: ['The Awakening Ceremony'],
            notable_residents: ['Elias Hart', 'Various scholars'],
            themes: ['knowledge', 'mystery', 'tradition'],
            visual_features: ['Gothic architecture', 'dusty archives', 'stone corridors'],
            chapter_appearances: [1, 2, 3],
            connected_locations: ['Whispering Woods']
          },
          inferred_fields: ['themes', 'visual_features'],
          source: 'The university itself was a sprawling Gothic campus built in 1847...'
        });
      }
      
      if (content.includes('Whispering Woods')) {
        results.push({
          type: 'location',
          confidence: 'extracted',
          data: {
            id: 'loc_whispering_woods',
            name: 'Whispering Woods',
            type: 'Ancient Forest',
            region: 'Wilderness',
            description: 'Dense forest that borders the university grounds, home to herbalist',
            history: 'Ancient forest with mystical properties',
            important_events: ['Luna\'s guidance rituals'],
            notable_residents: ['Luna Blackwood'],
            themes: ['nature', 'wisdom', 'magic'],
            visual_features: ['dense canopy', 'hidden paths', 'mystical atmosphere'],
            chapter_appearances: [2, 3],
            connected_locations: ['Ashmoor University']
          },
          inferred_fields: ['history', 'themes', 'visual_features'],
          source: 'Luna Blackwood lived deep in the Whispering Woods, a dense forest...'
        });
      }
    }

    // Story extraction
    if (templates.includes('story')) {
      results.push({
        type: 'story',
        confidence: 'extracted',
        data: {
          title: 'The Awakening Chronicle',
          summary: 'A scholar discovers his magical abilities with the help of a forest herbalist',
          themes: ['discovery', 'transformation', 'ancient knowledge', 'mentorship'],
          genre: 'Fantasy',
          world_rules: {
            magic_system: 'Latent abilities awakened through ritual and guidance',
            technology_level: 'Victorian-era with magical elements',
            governing_bodies: ['University Council'],
            factions: ['Scholars', 'Forest Dwellers']
          },
          core_conflict: 'Elias must accept and master his newfound magical abilities',
          main_characters: ['Elias Hart', 'Luna Blackwood'],
          timeline: ['Discovery in archives', 'Meeting Luna', 'Awakening ceremony'],
          chapter_order: [1, 2, 3],
          author_notes: 'Focus on character growth and magical discovery'
        },
        inferred_fields: ['title', 'summary', 'themes', 'world_rules', 'author_notes'],
        source: 'Overall narrative extracted from the provided content...'
      });
    }

    // Chapter extraction
    if (templates.includes('chapter')) {
      results.push({
        type: 'chapter',
        confidence: 'extracted',
        data: {
          id: 'ch_awakening_ceremony',
          title: 'The Awakening Ceremony',
          chapter_number: 3,
          summary: 'Elias undergoes the awakening ritual guided by Luna',
          events: ['Ritual preparation', 'Barrier thinning', 'Ability manifestation', 'Transformation'],
          POV_character: 'Elias Hart',
          locations: ['Whispering Woods'],
          characters_present: ['Elias Hart', 'Luna Blackwood'],
          themes: ['transformation', 'guidance', 'supernatural'],
          narrative_function: 'Climactic awakening of protagonist powers',
          conflict: 'Elias must overcome fear and accept his magical nature',
          tone: 'mystical and transformative',
          word_count: 0
        },
        inferred_fields: ['title', 'chapter_number', 'summary', 'events', 'narrative_function'],
        missing_fields: ['word_count'],
        source: 'The Awakening Ceremony took place on the autumn equinox...'
      });
    }

    return results;
  };

  const handleApproveAll = () => {
    alert(`${extractedData.length} items approved and saved to respective categories:\n\n${extractedData.map(item => `• ${item.type}: ${item.data.name || item.data.title}`).join('\n')}`);
  };

  const handleExportData = () => {
    const jsonData = JSON.stringify(extractedData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_story_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUploadSuccess = () => {
    // Refresh any data views or show success message
    // The file upload component already handles the success toast
  };

  const handleReset = () => {
    setContent(SAMPLE_CONTENT);
    setExtractedData([]);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="max-w-7xl mx-auto p-5">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">
                📖 Story Content Extraction Tool
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              {!loading && (
                isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm opacity-75">
                      Welcome back!
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={signOut}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Sign In
                  </Button>
                )
              )}
            </div>
          </div>
          <p className="text-xl opacity-90 mb-4">
            Non-generative AI-assisted structured data extraction
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              📊 Template-Based
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              🔍 Pattern Recognition
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              ⚠️ Inference Flagging
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              ✅ Human Review
            </div>
          </div>
        </div>

        {/* Process Indicator */}
        <ProcessIndicator currentStep={currentStep} />

        {/* Main Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ContentInput
            content={content}
            setContent={setContent}
            selectedTemplates={selectedTemplates}
            setSelectedTemplates={setSelectedTemplates}
            onExtract={handleExtractContent}
            onReset={handleReset}
            isExtracting={isExtracting}
            onFileUploadSuccess={handleFileUploadSuccess}
          />
          
          <ExtractedResults
            extractedData={extractedData}
            onApproveAll={handleApproveAll}
            onExportData={handleExportData}
          />
        </div>

        {/* Templates Section */}
        <TemplatesSection />

        {/* Saved Data Viewer */}
        <SavedDataViewer />

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setShowAuthModal(false);
          }}
        />
      </div>
    </div>
  );
};