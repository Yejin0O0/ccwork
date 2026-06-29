import { useState } from 'react';
import { NotesProvider } from './context/NotesContext';
import Layout from './components/Layout';
import NoteList from './components/note/NoteList';
import NoteEditor from './components/note/NoteEditor';
import NoteSearch from './components/note/NoteSearch';

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleTagFilter = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setIsCreating(false);
  };

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setIsCreating(true);
  };

  const handleDone = () => {
    setIsCreating(false);
    // 저장 후 선택 상태는 유지
  };

  return (
    <NotesProvider>
      <Layout
        onNewNote={handleNewNote}
        sidebar={
          <>
            <NoteSearch value={searchQuery} onChange={setSearchQuery} />
            <NoteList
              selectedNoteId={selectedNoteId}
              onSelect={handleSelectNote}
              searchQuery={searchQuery}
              activeTag={activeTag}
              onTagFilter={handleTagFilter}
            />
          </>
        }
        main={
          <NoteEditor selectedNoteId={selectedNoteId} isCreating={isCreating} onDone={handleDone} />
        }
      />
    </NotesProvider>
  );
}

export default App;
