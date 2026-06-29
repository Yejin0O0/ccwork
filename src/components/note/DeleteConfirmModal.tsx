interface DeleteConfirmModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 삭제 대상 노트 제목 (모달 내 표시용) */
  noteTitle: string;
  /** "삭제" 버튼 클릭 또는 확인 시 호출 */
  onConfirm: () => void;
  /** "취소" 버튼 클릭 또는 오버레이 클릭 시 호출 */
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  noteTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div data-testid="modal-overlay" onClick={onCancel}>
      <div role="dialog" onClick={(e) => e.stopPropagation()}>
        <p data-testid="modal-note-title">{noteTitle}</p>
        <button onClick={onCancel}>취소</button>
        <button onClick={onConfirm}>삭제</button>
      </div>
    </div>
  );
}
