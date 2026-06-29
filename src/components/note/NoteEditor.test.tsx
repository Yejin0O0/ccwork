import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteEditor from './NoteEditor';
import * as NotesContext from '../../context/NotesContext';

vi.mock('../../context/NotesContext', () => ({
  useNotes: vi.fn(),
}));

const mockNote = {
  id: '1',
  title: '테스트 노트',
  content: '내용',
  tags: ['react'],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockNoteWithMultipleTags = {
  id: '3',
  title: '멀티 태그 노트',
  content: '내용',
  tags: ['react', 'typescript'],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockNoteWithoutTags = {
  id: '2',
  title: '구버전 노트',
  content: '내용',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const createMockContext = (overrides = {}) => ({
  notes: [mockNote],
  loading: false,
  error: null,
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
  ...overrides,
});

beforeEach(() => {
  vi.mocked(NotesContext.useNotes).mockReturnValue(createMockContext());
});

describe('NoteEditor', () => {
  it('should initialize useTagEditor with selectedNote.tags when a note is selected', () => {
    render(<NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} />);
    expect(screen.getByText('react')).toBeInTheDocument();
  });

  it('should initialize useTagEditor with empty array when creating new note', () => {
    render(<NoteEditor selectedNoteId={null} isCreating={true} onDone={vi.fn()} />);
    expect(screen.queryByText('react')).not.toBeInTheDocument();
  });

  it('should initialize useTagEditor with empty array when selectedNote has no tags field', () => {
    vi.mocked(NotesContext.useNotes).mockReturnValue(
      createMockContext({ notes: [mockNoteWithoutTags as typeof mockNote] }),
    );
    expect(() => {
      render(<NoteEditor selectedNoteId="2" isCreating={false} onDone={vi.fn()} />);
    }).not.toThrow();
  });

  it('should include tags in updateNote call when save is clicked', async () => {
    const updateNote = vi.fn();
    vi.mocked(NotesContext.useNotes).mockReturnValue(createMockContext({ updateNote }));
    const user = userEvent.setup();
    render(<NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} />);
    await user.click(screen.getByText('저장'));
    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith('1', expect.objectContaining({ tags: ['react'] }));
    });
  });

  it('should include tags in createNote call when save is clicked', async () => {
    const createNote = vi.fn();
    vi.mocked(NotesContext.useNotes).mockReturnValue(createMockContext({ notes: [], createNote }));
    const user = userEvent.setup();
    render(<NoteEditor selectedNoteId={null} isCreating={true} onDone={vi.fn()} />);
    await user.type(screen.getByPlaceholderText('제목'), '새 노트');
    await user.click(screen.getByText('저장'));
    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith('새 노트', '', []);
    });
  });

  it('should restore saved tags as chips when same note is re-selected', () => {
    const { rerender } = render(
      <NoteEditor selectedNoteId={null} isCreating={true} onDone={vi.fn()} />,
    );
    rerender(<NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} />);
    expect(screen.getByText('react')).toBeInTheDocument();
  });

  it('should include existing tags when only title or content is changed before save', async () => {
    const updateNote = vi.fn();
    vi.mocked(NotesContext.useNotes).mockReturnValue(createMockContext({ updateNote }));
    const user = userEvent.setup();
    render(<NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} />);
    const titleInput = screen.getByPlaceholderText('제목');
    await user.clear(titleInput);
    await user.type(titleInput, '수정된 제목');
    await user.click(screen.getByText('저장'));
    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith('1', expect.objectContaining({ tags: ['react'] }));
    });
  });

  it('should render tag input placeholder when creating new note', () => {
    render(<NoteEditor selectedNoteId={null} isCreating={true} onDone={vi.fn()} />);
    expect(screen.getByPlaceholderText('태그 입력 후 Enter')).toBeInTheDocument();
  });

  it('should render zero chips when selectedNote has no tags field', () => {
    vi.mocked(NotesContext.useNotes).mockReturnValue(
      createMockContext({ notes: [mockNoteWithoutTags as typeof mockNote] }),
    );
    render(<NoteEditor selectedNoteId="2" isCreating={false} onDone={vi.fn()} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('should remove tag chip immediately when remove button is clicked', async () => {
    vi.mocked(NotesContext.useNotes).mockReturnValue(
      createMockContext({ notes: [mockNoteWithMultipleTags] }),
    );
    const user = userEvent.setup();
    render(<NoteEditor selectedNoteId="3" isCreating={false} onDone={vi.fn()} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'react 삭제' }));
    expect(screen.queryByText('react')).not.toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('should save note without removed tag when save is clicked after removal', async () => {
    const updateNote = vi.fn();
    vi.mocked(NotesContext.useNotes).mockReturnValue(
      createMockContext({ notes: [mockNoteWithMultipleTags], updateNote }),
    );
    const user = userEvent.setup();
    render(<NoteEditor selectedNoteId="3" isCreating={false} onDone={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'react 삭제' }));
    await user.click(screen.getByText('저장'));
    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith(
        '3',
        expect.objectContaining({ tags: ['typescript'] }),
      );
    });
  });

  it('should save with empty tags array when all chips are removed before saving', async () => {
    const updateNote = vi.fn();
    vi.mocked(NotesContext.useNotes).mockReturnValue(createMockContext({ updateNote }));
    const user = userEvent.setup();
    render(<NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'react 삭제' }));
    await user.click(screen.getByText('저장'));
    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith('1', expect.objectContaining({ tags: [] }));
    });
  });

  it('should keep tags state unchanged when save API call fails', async () => {
    const updateNote = vi.fn().mockRejectedValue(new Error('서버 오류'));
    vi.mocked(NotesContext.useNotes).mockReturnValue(createMockContext({ updateNote }));
    const user = userEvent.setup();
    render(<NoteEditor selectedNoteId="1" isCreating={false} onDone={vi.fn()} />);
    await user.click(screen.getByText('저장'));
    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
    });
  });
});
