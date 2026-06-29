import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteItem from './NoteItem';
import { Note } from '../../types/note';

const mockNote: Note = {
  id: '1',
  title: '테스트 노트',
  content: '내용',
  tags: ['react', 'typescript'],
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

describe('NoteItem', () => {
  it('should render a chip for each tag when note.tags is not empty', () => {
    render(<NoteItem {...defaultProps} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('should render no tag chips when note.tags is empty array', () => {
    render(<NoteItem {...defaultProps} note={{ ...mockNote, tags: [] }} />);
    expect(screen.queryByRole('button', { name: 'react' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'typescript' })).not.toBeInTheDocument();
  });

  it('should call onTagClick with the tag name when a tag chip is clicked', async () => {
    const onTagClick = vi.fn();
    const user = userEvent.setup();
    render(<NoteItem {...defaultProps} onTagClick={onTagClick} />);
    await user.click(screen.getByRole('button', { name: 'react' }));
    expect(onTagClick).toHaveBeenCalledWith('react');
  });

  it('should apply active style to the chip that matches activeTag', () => {
    render(<NoteItem {...defaultProps} activeTag="react" />);
    expect(screen.getByRole('button', { name: 'react' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'typescript' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
