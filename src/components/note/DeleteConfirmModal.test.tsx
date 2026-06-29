import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmModal from './DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  it('should render modal with note title when isOpen is true', () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        noteTitle="테스트 노트"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.getByText('테스트 노트')).toBeInTheDocument();
  });

  it('should call onConfirm when "삭제" button is clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        isOpen={true}
        noteTitle="테스트 노트"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when "취소" button is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        isOpen={true}
        noteTitle="테스트 노트"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when overlay is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <DeleteConfirmModal
        isOpen={true}
        noteTitle="테스트 노트"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByTestId('modal-overlay'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should display empty string as note title when noteTitle is empty', () => {
    render(
      <DeleteConfirmModal isOpen={true} noteTitle="" onConfirm={vi.fn()} onCancel={vi.fn()} />,
    );
    // 빈 제목 표시 영역이 존재해야 함
    expect(screen.getByTestId('modal-note-title')).toHaveTextContent('');
  });

  it('should not render modal content when isOpen is false', () => {
    // isOpen=true일 때 먼저 렌더해서 모달이 표시되는지 확인
    const { rerender } = render(
      <DeleteConfirmModal
        isOpen={true}
        noteTitle="테스트 노트"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    // isOpen=true일 때는 오버레이가 DOM에 있어야 한다
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    // isOpen=false로 전환 후 오버레이가 DOM에서 사라져야 한다
    rerender(
      <DeleteConfirmModal
        isOpen={false}
        noteTitle="테스트 노트"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });
});
