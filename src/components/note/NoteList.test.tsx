import { render, screen } from '@testing-library/react';
import NoteList from './NoteList';
import * as NotesContext from '../../context/NotesContext';

vi.mock('../../context/NotesContext', () => ({
  useNotes: vi.fn(),
}));

const mockNotes = [
  {
    id: '1',
    title: '리액트 노트',
    content: '리액트 내용',
    tags: ['react'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: '리액트 가이드',
    content: '가이드 내용',
    tags: ['typescript'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    title: '타입스크립트 노트',
    content: '타입스크립트 내용',
    tags: ['react'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

const defaultUseNotes = {
  notes: mockNotes,
  loading: false,
  error: null,
  createNote: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
};

const defaultProps = {
  selectedNoteId: null,
  onSelect: vi.fn(),
  activeTag: null,
  onTagFilter: vi.fn(),
};

beforeEach(() => {
  vi.mocked(NotesContext.useNotes).mockReturnValue(defaultUseNotes);
});

describe('NoteList', () => {
  it('should show only notes that include activeTag when activeTag is set', () => {
    render(<NoteList {...defaultProps} activeTag="react" />);
    expect(screen.getByText('리액트 노트')).toBeInTheDocument();
    expect(screen.getByText('타입스크립트 노트')).toBeInTheDocument();
    expect(screen.queryByText('리액트 가이드')).not.toBeInTheDocument();
  });

  it('should show all notes when activeTag is null', () => {
    render(<NoteList {...defaultProps} activeTag={null} />);
    expect(screen.getByText('리액트 노트')).toBeInTheDocument();
    expect(screen.getByText('리액트 가이드')).toBeInTheDocument();
    expect(screen.getByText('타입스크립트 노트')).toBeInTheDocument();
  });

  it('should display filter status text when activeTag is set', () => {
    render(<NoteList {...defaultProps} activeTag="react" />);
    expect(screen.getByText('#react 필터 적용 중')).toBeInTheDocument();
  });

  it('should apply searchQuery and activeTag as AND condition simultaneously', () => {
    // 노트1: 제목에 '리액트' 포함 + 태그 'react' → 표시
    // 노트2: 제목에 '리액트' 포함 + 태그 'typescript' (react 아님) → 숨김
    // 노트3: 태그 'react' 있음 + 제목에 '리액트' 없음 → 숨김
    render(<NoteList {...defaultProps} searchQuery="리액트" activeTag="react" />);
    expect(screen.getByText('리액트 노트')).toBeInTheDocument();
    expect(screen.queryByText('리액트 가이드')).not.toBeInTheDocument();
    expect(screen.queryByText('타입스크립트 노트')).not.toBeInTheDocument();
  });

  it('should show empty state message when no notes match activeTag filter', () => {
    render(<NoteList {...defaultProps} activeTag="vue" />);
    expect(screen.queryByText('리액트 노트')).not.toBeInTheDocument();
    expect(screen.queryByText('타입스크립트 노트')).not.toBeInTheDocument();
    expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
  });
});
