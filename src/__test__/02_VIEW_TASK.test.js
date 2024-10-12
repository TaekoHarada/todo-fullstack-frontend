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

  test("HOME-001: renders the home page and fetches todos", async () => {
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

    // Check if todos are rendered on the page
    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    // Ensure completed todo has line-through
    expect(screen.getByText("Test Todo 2")).toHaveClass("line-through");
  });

  test("HOME-002: redirects to login if fetching todos fails", async () => {
    // Mock the GET API call to throw an error
    await axiosInstance.get.mockRejectedValueOnce(new Error("Unauthorized"));

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Ensure the user is redirected to the login page
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
