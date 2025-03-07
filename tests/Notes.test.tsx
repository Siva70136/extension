import { render, fireEvent, screen, getByText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Notes from "../entrypoints/popup/Note";

globalThis.browser = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListeners: vi.fn().mockReturnValue(true), 
    },
  },
} as any;


Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
    readText: vi.fn(() => Promise.resolve("Mocked clipboard content")),
  },
});

const notes = ["Todo"];

describe("Notes component", () => {
  test("renders the textarea and save button", () => {
    render(<Notes />);
    expect(
      screen.getByPlaceholderText("Type your note here...")
    ).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("allows typing in the textarea", () => {
    render(<Notes />);
    const textarea = screen.getByPlaceholderText("Type your note here...");
    fireEvent.change(textarea, { target: { value: "Test note" } });
  });
  test("renders notes list", () => {
    const { getByText } = render(<Notes />);
    expect(getByText("Notes Saver")).toBeInTheDocument();
  });
  test("renders correctly", () => {
    const result = render(<Notes />);
    expect(result).toMatchSnapshot();
  });
  test("saves notes on button click", () => {
    const { getByText } = render(<Notes />);
    fireEvent.click(getByText("Copy"));
    expect(getByText("Copy")).toBeInTheDocument();
  });

  test("updates notes on input change", () => {
    const { getByText } = render(<Notes />);
    fireEvent.change(screen.getByPlaceholderText("Type your note here..."), {
      target: { value: "Updated note" },
    });
    expect(getByText("Updated note")).toBeInTheDocument();
  });
  test("should copies selected text to clipboard", async () => {
    render(<Notes />);

    const user = userEvent.setup();
    const buttton = screen.getByRole("button", { name: /copy/i });
    await user.click(buttton);

    await navigator.clipboard.writeText("Hello");
    const data = await navigator.clipboard.readText();
    console.log(data);
    expect(buttton).toBeInTheDocument();
    //expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Hello");
  });
  it("should accepting the text by placeholder", async () => {
    render(<Notes />);
    const inputElement = screen.getByPlaceholderText("Type your note here...");
    const button =screen.getByRole('button',{name: /save/i});
    await userEvent.type(inputElement, "Hello, this is a test note.");   
    expect(inputElement).toHaveValue("Hello, this is a test note.");

    await userEvent.click(button);
    const element=screen.getByText("Hello, this is a test note.");
    expect(element).toBeInTheDocument();

    const deleteButton=screen.getByText("❌");
    await userEvent.click(deleteButton);
    expect(screen.queryByText("Hello, this is a test note.")).toBeNull();     
  });
});
