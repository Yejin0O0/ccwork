import { render, screen } from '@testing-library/react';
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
      />,
    );
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('should render no chips when tags prop is empty array', () => {
    render(<TagInput tags={[]} inputValue="" onInputChange={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('should call onAdd with current inputValue when Enter key is pressed', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={[]} inputValue="react" onInputChange={vi.fn()} onAdd={onAdd} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.keyboard('{Enter}');
    expect(onAdd).toHaveBeenCalledWith('react');
  });

  it('should call onAdd with value stripped of comma when comma is typed', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={[]} inputValue="react" onInputChange={vi.fn()} onAdd={onAdd} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    await user.type(input, ',');
    expect(onAdd).toHaveBeenCalledWith('react');
  });

  it('should call onInputChange when input value changes', async () => {
    const onInputChange = vi.fn();
    const user = userEvent.setup();
    render(<TagInput tags={[]} inputValue="" onInputChange={onInputChange} onAdd={vi.fn()} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'r');
    expect(onInputChange).toHaveBeenCalled();
  });
});
