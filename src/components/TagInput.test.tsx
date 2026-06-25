import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagInput from './TagInput';

describe('TagInput', () => {
  it('should render each tag as a chip element when tags prop is given', () => {
    render(
      <TagInput
        tags={['react', 'typescript']}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('should render no chips when tags prop is empty array', () => {
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('should call onAdd with current inputValue when Enter key is pressed', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        tags={[]}
        inputValue="react"
        onInputChange={vi.fn()}
        onAdd={onAdd}
        onRemove={vi.fn()}
      />,
    );
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{Enter}');
    expect(onAdd).toHaveBeenCalledWith('react');
  });

  it('should call onAdd with value stripped of comma when comma is typed', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        tags={[]}
        inputValue="react"
        onInputChange={vi.fn()}
        onAdd={onAdd}
        onRemove={vi.fn()}
      />,
    );
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, ',');
    expect(onAdd).toHaveBeenCalledWith('react');
  });

  it('should call onInputChange when input value changes', async () => {
    const onInputChange = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={onInputChange}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'r');
    expect(onInputChange).toHaveBeenCalled();
  });

  it('should render a remove button for each tag chip when tags prop is given', () => {
    render(
      <TagInput
        tags={['react', 'typescript']}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    const removeButtons = screen.getAllByRole('button', { name: /삭제/ });
    expect(removeButtons).toHaveLength(2);
  });

  it('should call onRemove with correct index when remove button is clicked', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        tags={['react', 'typescript']}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={onRemove}
      />,
    );
    const removeButtons = screen.getAllByRole('button', { name: /삭제/ });
    await user.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('should render no remove buttons when tags array is empty', () => {
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryAllByRole('button', { name: /삭제/ })).toHaveLength(0);
  });

  it('should call onRemove with index 0 when the only tag remove button is clicked', async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        tags={['react']}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={onRemove}
        isShaking={false}
        onShakeEnd={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: /삭제/ }));
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('should disable input when isMaxed is true', () => {
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        isMaxed={true}
      />,
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should show max count message when isMaxed is true', () => {
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        isMaxed={true}
      />,
    );
    expect(screen.getByText('태그는 최대 10개까지 추가할 수 있습니다')).toBeInTheDocument();
  });

  it('should enable input when isMaxed is false', () => {
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        isMaxed={false}
      />,
    );
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('should not show max count message when isMaxed is false', () => {
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        isMaxed={false}
      />,
    );
    expect(screen.queryByText('태그는 최대 10개까지 추가할 수 있습니다')).not.toBeInTheDocument();
  });

  it('should not call onAdd when Enter is pressed while input is disabled', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        tags={[]}
        inputValue="react"
        onInputChange={vi.fn()}
        onAdd={onAdd}
        onRemove={vi.fn()}
        isMaxed={true}
      />,
    );
    await user.keyboard('{Enter}');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should not call onAdd when comma is typed while input is disabled', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(
      <TagInput
        tags={[]}
        inputValue="react"
        onInputChange={vi.fn()}
        onAdd={onAdd}
        onRemove={vi.fn()}
        isMaxed={true}
      />,
    );
    await user.type(screen.getByRole('textbox'), ',');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('should apply shake class to input when isShaking is true', () => {
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        isShaking={true}
        onShakeEnd={vi.fn()}
      />,
    );
    expect(screen.getByRole('textbox')).toHaveClass('animate-shake');
  });

  it('should call onShakeEnd when animation ends on input', () => {
    const onShakeEnd = vi.fn();
    render(
      <TagInput
        tags={[]}
        inputValue=""
        onInputChange={vi.fn()}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        isShaking={true}
        onShakeEnd={onShakeEnd}
      />,
    );
    fireEvent.animationEnd(screen.getByRole('textbox'));
    expect(onShakeEnd).toHaveBeenCalled();
  });
});
