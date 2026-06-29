import { useNotes } from '../../context/NotesContext';
import NoteItem from './NoteItem';

interface NoteListProps {
  selectedNoteId: string | null;
  onSelect: (id: string) => void;
  searchQuery?: string;
  activeTag: string | null;
  onTagFilter: (tag: string) => void;
}

export default function NoteList({
  selectedNoteId,
  onSelect,
  searchQuery = '',
  activeTag,
  onTagFilter,
}: NoteListProps) {
  const { notes, loading, error, deleteNote } = useNotes();
  const filtered = notes.filter((n) => {
    const matchesSearch =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !activeTag || (n.tags ?? []).includes(activeTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return <p className="text-sm text-muted-foreground text-center py-8">로딩 중...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive text-center py-8">오류: {error}</p>;
  }

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        {searchQuery || activeTag ? '검색 결과가 없습니다' : '노트가 없습니다'}
      </p>
    );
  }

  return (
    <>
      {activeTag && (
        <p className="text-xs text-muted-foreground px-1 pb-1">#{activeTag} 필터 적용 중</p>
      )}
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground px-1 pb-1">
        노트 {filtered.length}개
      </p>
      {filtered.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={onSelect}
          onDelete={deleteNote}
          activeTag={activeTag}
          onTagClick={onTagFilter}
        />
      ))}
    </>
  );
}
