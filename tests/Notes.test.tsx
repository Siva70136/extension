import { render,fireEvent,screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import Notes from "../entrypoints/popup/Note";

// Notes component test cases using vitest

describe("Notes component", () => {
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
  test("renders notes list", () => {
    const { getByText } = render(<Notes />);
    expect(getByText("Notes Saver")).toBeInTheDocument();
  });
  test("renders correctly", () => {
    const result = render(<Notes />);
    expect(result).toMatchSnapshot();
  });
});
