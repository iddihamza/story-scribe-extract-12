import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SavedData {
  characters: any[];
  locations: any[];
  stories: any[];
  chapters: any[];
}

export const SavedDataViewer: React.FC = () => {
  const [savedData, setSavedData] = useState<SavedData>({
    characters: [],
    locations: [],
    stories: [],
    chapters: []
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const loadSavedData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const [charactersResult, locationsResult, storiesResult, chaptersResult] = await Promise.all([
        supabase.from('character_profiles').select('*').limit(10),
        supabase.from('locations').select('*').limit(10),
        supabase.from('stories').select('*').limit(10),
        supabase.from('chapters').select('*').limit(10)
      ]);

      setSavedData({
        characters: charactersResult.data || [],
        locations: locationsResult.data || [],
        stories: storiesResult.data || [],
        chapters: chaptersResult.data || []
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load saved data",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Saved Data Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please sign in to view your saved data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Saved Data</CardTitle>
        <Button onClick={loadSavedData} disabled={loading} size="sm">
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="characters" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="characters">
              Characters ({savedData.characters.length})
            </TabsTrigger>
            <TabsTrigger value="locations">
              Locations ({savedData.locations.length})
            </TabsTrigger>
            <TabsTrigger value="stories">
              Stories ({savedData.stories.length})
            </TabsTrigger>
            <TabsTrigger value="chapters">
              Chapters ({savedData.chapters.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="characters" className="mt-4">
            <div className="space-y-3">
              {savedData.characters.length === 0 ? (
                <p className="text-muted-foreground">No characters saved yet.</p>
              ) : (
                savedData.characters.map((character, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{character.full_name}</h4>
                    <p className="text-sm text-muted-foreground">{character.title}</p>
                    <p className="text-sm">{character.summary_tagline}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="locations" className="mt-4">
            <div className="space-y-3">
              {savedData.locations.length === 0 ? (
                <p className="text-muted-foreground">No locations saved yet.</p>
              ) : (
                savedData.locations.map((location, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{location.name}</h4>
                    <p className="text-sm text-muted-foreground">{location.location_type}</p>
                    <p className="text-sm">{location.summary}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stories" className="mt-4">
            <div className="space-y-3">
              {savedData.stories.length === 0 ? (
                <p className="text-muted-foreground">No stories saved yet.</p>
              ) : (
                savedData.stories.map((story, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{story.title}</h4>
                    <p className="text-sm text-muted-foreground">{story.genre}</p>
                    <p className="text-sm">{story.summary}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="chapters" className="mt-4">
            <div className="space-y-3">
              {savedData.chapters.length === 0 ? (
                <p className="text-muted-foreground">No chapters saved yet.</p>
              ) : (
                savedData.chapters.map((chapter, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{chapter.title}</h4>
                    <p className="text-sm text-muted-foreground">Chapter {chapter.chapter_number}</p>
                    <p className="text-sm">{chapter.summary}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};