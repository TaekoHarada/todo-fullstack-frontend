import { render, screen, act } from "@testing-library/react";
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

describe("Viewing a List of Tasks", () => {
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

  test("VIEW_TASK-001: ToDo page has been rendered and user views the list of all tasks", async () => {
    // Mock the GET API call to return a list of todos
    await axiosInstance.get.mockResolvedValueOnce({
      data: [
        { id: "1", title: "Test Todo 1", completed: false },
        { id: "2", title: "Test Todo 2", completed: true },
      ],
    });

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    const todoList = screen.queryByTestId("todo-list");
    expect(todoList.children.length).not.toBe(0); // Asserts that there are no task items inside

    // Check if todos are rendered on the page
    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    // Ensure completed todo has line-through
    expect(screen.getByText("Test Todo 2")).toHaveClass("line-through");
  });

  test("VIEW_TASK-002: View tasks when any tasks have not been added", async () => {
    // Mock the GET API call to return an empty list
    await axiosInstance.get.mockResolvedValueOnce({
      data: [], // API returns empty array when there's no data
    });

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Check if todos are not rendered on the page
    // Check for presence of the list element (optional with data-testid)
    const todoList = screen.queryByTestId("todo-list");
    expect(todoList.children.length).toBe(0); // Asserts that there are no task items inside
  });

  test("VIEW_TASK-003: Redirect to login page when the user is not authorized", async () => {
    // Mock the GET API call to throw an error
    await axiosInstance.get.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    // Spy on console.error to verify log output
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Assert that the correct error message is logged with console.error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching todos:",
      expect.anything()
    );

    // Ensure the user is redirected to the login page
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
