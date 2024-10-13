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

describe("Marking Tasks as Complete", () => {
  let mockPush;
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

  test("COMPLETE_TASK-000: Mark a not-completed task", async () => {
    // GET todo
    await axiosInstance.get.mockResolvedValueOnce({
      data: [{ id: "1", title: "Test Todo 1", completed: false }],
    });
    // PUT as completed
    await axiosInstance.put.mockResolvedValueOnce({
      data: { id: "1", title: "Test Todo 1", completed: true },
    });

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Simulate clicking on the todo to toggle completion
    await act(async () => {
      fireEvent.click(screen.getByText("Test Todo 1"));
    });

    // Ensure axios put is called with correct data
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "http://localhost:5001/api/todos/1",
      { title: "Test Todo 1", completed: true }
    );

    // Check if the todo is marked as completed (line-through)
    expect(screen.getByText("Test Todo 1")).toHaveClass("line-through");
  });

  test("COMPLETE_TASK-001: Mark a completed task", async () => {
    // GET a completed todo
    await axiosInstance.get.mockResolvedValueOnce({
      data: [{ id: "1", title: "Test Todo 1", completed: true }],
    });
    // PUT as not completed
    await axiosInstance.put.mockResolvedValueOnce({
      data: { id: "1", title: "Test Todo 1", completed: false },
    });

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Simulate clicking on the todo to toggle completion
    await act(async () => {
      fireEvent.click(screen.getByText("Test Todo 1"));
    });

    // Ensure axios put is called with correct data
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "http://localhost:5001/api/todos/1",
      { title: "Test Todo 1", completed: false }
    );

    // Check if the todo is marked as completed (line-through)
    expect(screen.getByText("Test Todo 1")).not.toHaveClass("line-through");
  });
});
