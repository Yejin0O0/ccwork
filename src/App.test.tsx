import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as NotesContext from './context/NotesContext';

vi.mock('./context/NotesContext', () => ({
  NotesProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
    title: '타입스크립트 노트',
    content: '타입스크립트 내용',
    tags: ['typescript'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

beforeEach(() => {
  vi.mocked(NotesContext.useNotes).mockReturnValue({
    notes: mockNotes,
    loading: false,
    error: null,
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
  });
});

describe('App', () => {
  it('should deactivate tag filter when the active tag chip is clicked again', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 초기: 두 노트 모두 표시
    expect(screen.getByText('리액트 노트')).toBeInTheDocument();
    expect(screen.getByText('타입스크립트 노트')).toBeInTheDocument();

    // react 태그 칩 클릭 → 필터 활성화
    await user.click(screen.getByRole('button', { name: 'react' }));
    expect(screen.queryByText('타입스크립트 노트')).not.toBeInTheDocument();

    // react 태그 칩 다시 클릭 → 필터 해제
    await user.click(screen.getByRole('button', { name: 'react' }));
    expect(screen.getByText('타입스크립트 노트')).toBeInTheDocument();
  });
});
