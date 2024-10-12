import { render, screen, fireEvent, act } from "@testing-library/react";
import Home from "../app/page";
import axiosInstance from "../app/utils/axiosInstance";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom"; // Import jest-dom matchers

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

// Mock axiosInstance
jest.mock("../app/utils/axiosInstance");

describe("Home Page", () => {
  let mockPush;
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    // Mock the return value of useRouter
    useRouter.mockReturnValue({
      push: mockPush, // Mock the push method
    });
  });

  test("HOME-003: adds a new todo", async () => {
    // Mock the POST API call for adding a new todo
    await axiosInstance.post.mockResolvedValueOnce({
      data: { id: "3", title: "New Todo", completed: false },
    });

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Simulate user typing a new todo
    fireEvent.change(screen.getByPlaceholderText("Add a new todo"), {
      target: { value: "New Todo" },
    });

    // Simulate button click to add the todo
    await act(async () => {
      fireEvent.click(screen.getByText("Add Todo"));
    });

    // Ensure axios post is called with correct data
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "http://localhost:5001/api/todos",
      { title: "New Todo" }
    );

    // Check if the new todo is added to the list
    expect(screen.getByText("New Todo")).toBeInTheDocument();
  });
});
