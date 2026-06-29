import { useState } from 'react';
import { Note } from '../../types/note';
import DeleteConfirmModal from './DeleteConfirmModal';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

export default function NoteItem({
  note,
  isSelected,
  onSelect,
  onDelete,
  activeTag,
  onTagClick,
}: NoteItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setIsModalOpen(true);
  }

  function handleConfirmDelete() {
    onDelete(note.id);
    setIsModalOpen(false);
  }

  function handleCancelDelete() {
    setIsModalOpen(false);
  }

  return (
    <div
      onClick={() => onSelect(note.id)}
      className={`bg-card rounded-2xl p-4 border cursor-pointer transition-all ${
        isSelected ? 'border-foreground' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 flex-1">
          {note.title || '(제목 없음)'}
        </h3>
        <button
          onClick={handleDeleteClick}
          className="text-muted-foreground hover:text-destructive text-xs shrink-0 transition-colors cursor-pointer"
        >
          삭제
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
        {note.content || '(내용 없음)'}
      </p>
      <p className="text-[10px] text-muted-foreground/70 mt-2">
        {new Date(note.updatedAt).toLocaleDateString('ko-KR')}
      </p>
      {(note.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {(note.tags ?? []).map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={tag === activeTag}
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
              className={`text-xs px-2 py-0.5 rounded-full ${
                tag === activeTag ? 'bg-foreground text-card' : 'bg-muted text-muted-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      <DeleteConfirmModal
        isOpen={isModalOpen}
        noteTitle={note.title}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
