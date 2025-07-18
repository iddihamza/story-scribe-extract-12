import React from 'react';

export const TemplatesSection: React.FC = () => {
  const templates = [
    {
      title: '👤 Character Template',
      content: `{
  "id": "",
  "name": "",
  "title": "",
  "age": "",
  "species": "",
  "role": "",
  "background": "",
  "personality": {
    "core_traits": [],
    "flaws": [],
    "emotional_tone": ""
  },
  "visual_design": {
    "silhouette": "",
    "style_notes": "",
    "accessories": []
  },
  "abilities": {
    "core_skills": [],
    "powers": []
  },
  "relationships": {
    "allies": [],
    "rivals": [],
    "mentor": "",
    "affiliations": []
  },
  "appearance_in_chapters": [],
  "tags": [],
  "quote": ""
}`
    },
    {
      title: '📍 Location Template',
      content: `{
  "id": "",
  "name": "",
  "type": "",
  "region": "",
  "description": "",
  "history": "",
  "important_events": [],
  "notable_residents": [],
  "themes": [],
  "visual_features": [],
  "chapter_appearances": [],
  "connected_locations": []
}`
    },
    {
      title: '📚 Overall Story Template',
      content: `{
  "title": "",
  "summary": "",
  "themes": [],
  "genre": "",
  "world_rules": {
    "magic_system": "",
    "technology_level": "",
    "governing_bodies": [],
    "factions": []
  },
  "core_conflict": "",
  "main_characters": [],
  "timeline": [],
  "chapter_order": [],
  "author_notes": ""
}`
    },
    {
      title: '📖 Chapter Template',
      content: `{
  "id": "",
  "title": "",
  "chapter_number": 0,
  "summary": "",
  "events": [],
  "POV_character": "",
  "locations": [],
  "characters_present": [],
  "themes": [],
  "narrative_function": "",
  "conflict": "",
  "tone": "",
  "word_count": 0
}`
    }
  ];

  return (
    <div className="bg-gradient-panel backdrop-blur-panel rounded-2xl p-6 shadow-panel">
      <h2 className="text-2xl font-bold text-primary-dark mb-5 flex items-center gap-3">
        🧠 Master JSON Templates
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-5 border-l-4 border-primary-blue">
            <h3 className="text-lg font-semibold text-primary-dark mb-4">
              {template.title}
            </h3>
            <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre">
              {template.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};