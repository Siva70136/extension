import Popup from "@/entrypoints/popup/secreen";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Screen component", () => {
  it("should contain a button with label", () => {
    render(<Popup />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Start Capture/i);
  });
  it("should have the heading screen capture", () => {
    render(<Popup />);
    const heading = screen.getByText(/Screen Capture/i);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Screen Capture/i);
  });
  it("should match the snapshot", () => {
    const item = render(<Popup />);
    expect(item).toMatchSnapshot();
  });

  it("should contain allow screen", () => {
    render(<Popup />);
    const button = screen.getByRole("button");

    userEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Start Capture/i);
  });
});
