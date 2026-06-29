import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteItem from './NoteItem';
import { Note } from '../../types/note';

const mockNote: Note = {
  id: '1',
  title: '테스트 노트',
  content: '내용',
  tags: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const defaultProps = {
  note: mockNote,
  isSelected: false,
  onSelect: vi.fn(),
  onDelete: vi.fn(),
  activeTag: null,
  onTagClick: vi.fn(),
};

describe('NoteItem (이슈 17 — 삭제 확인 모달)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should open DeleteConfirmModal when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<NoteItem {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: '삭제' }));
    // 모달 오버레이가 열려야 한다
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
  });

  it('should call onDelete after confirming deletion in modal', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<NoteItem {...defaultProps} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: '삭제' }));
    // 모달 다이얼로그가 열려야 한다
    const dialog = screen.getByRole('dialog');
    // 모달 내부의 삭제 버튼 클릭
    const { getByRole: getByRoleInDialog } = within(dialog);
    await user.click(getByRoleInDialog('button', { name: '삭제' }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('should not call onDelete when modal is cancelled after delete button click', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<NoteItem {...defaultProps} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: '삭제' }));
    // 모달 다이얼로그가 열려야 한다
    const dialog = screen.getByRole('dialog');
    // 모달 내부의 취소 버튼 클릭
    const { getByRole: getByRoleInDialog } = within(dialog);
    await user.click(getByRoleInDialog('button', { name: '취소' }));
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('should not call onDelete immediately when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<NoteItem {...defaultProps} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: '삭제' }));
    // 삭제 버튼 클릭 직후 onDelete가 즉시 호출되어서는 안 된다
    expect(onDelete).not.toHaveBeenCalled();
  });
});
