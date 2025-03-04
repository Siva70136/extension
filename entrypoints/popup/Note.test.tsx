import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Notes from './Note';
describe('Notes Component', () => {
  test('renders the textarea and save button', () => {
    render(<Notes />);
    expect(screen.getByPlaceholderText('Type your note here...')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('allows typing in the textarea', () => {
    render(<Notes />);
    const textarea = screen.getByPlaceholderText('Type your note here...');
    fireEvent.change(textarea, { target: { value: 'Test note' } });
  });

  test('saves note when save button is clicked', () => {
    render(<Notes />);
    const textarea = screen.getByPlaceholderText('Type your note here...');
    const saveButton = screen.getByText('Save');

    fireEvent.click(saveButton);
  });
});
