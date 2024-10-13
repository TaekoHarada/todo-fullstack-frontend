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

describe("Add Todo", () => {
  let mockPush;
  let consoleErrorSpy;
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();

    // Mock the return value of useRouter
    useRouter.mockReturnValue({
      push: mockPush, // Mock the push method
    });

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore(); // Restore console.error after each test
  });

  test("ADD_TASK-000: Add a new task", async () => {
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

  test("ADD_TASK-001: Add a new task with a empty title", async () => {
    // Mock the POST API call for adding a new todo
    await axiosInstance.post.mockResolvedValueOnce({
      data: { id: "3", title: "", completed: false },
    });

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Simulate user typing a new todo
    fireEvent.change(screen.getByPlaceholderText("Add a new todo"), {
      target: { value: "" },
    });

    // Simulate button click to add the todo
    await act(async () => {
      fireEvent.click(screen.getByText("Add Todo"));
    });

    // Ensure axios post is NOT called
    expect(axiosInstance.post).not.toHaveBeenCalled();

    // Check if the new todo is added to the list
    expect(screen.getByText("Error: Input todo.")).toBeInTheDocument();
  });
});
