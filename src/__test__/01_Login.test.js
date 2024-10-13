import { render, screen, fireEvent, act } from "@testing-library/react";
import Login from "../app/login/page";
import { useRouter } from "next/navigation"; // Using the correct hook from next/navigation
import axiosInstance from "../app/utils/axiosInstance";
import "@testing-library/jest-dom"; // Import jest-dom matchers

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

// Mock axiosInstance
jest.mock("../app/utils/axiosInstance");

describe("Login Page", () => {
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

  test("LOGIN-000: renders the login form", () => {
    render(<Login />);

    // Check if input fields and button are present
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("LOGIN-001: handles successful login", async () => {
    // Mock the API call for a successful login
    await axiosInstance.post.mockResolvedValueOnce({
      data: { token: "fake-token" },
    });

    render(<Login />);

    await act(async () => {
      // Simulate user typing into the input fields
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "testuser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });

      // Simulate button click
      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    // Ensure axios post is called with correct data
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "http://localhost:5001/api/users/login",
      {
        username: "testuser",
        password: "password123",
      }
    );

    // Ensure redirect to home page is triggered
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("LOGIN-002: handles invalid login", async () => {
    // Mock the API call to fail
    await axiosInstance.post.mockRejectedValueOnce(new Error("Login failed"));

    render(<Login />);

    await act(async () => {
      // Simulate user input
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "invaliduser" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpassword" },
      });

      // Simulate button click
      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    // Ensure axios post was called
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "http://localhost:5001/api/users/login",
      {
        username: "invaliduser",
        password: "wrongpassword",
      }
    );

    // Check that the error message is shown
    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });

  test("LOGIN-003: handles empty login", async () => {
    // Mock the API call to fail
    await axiosInstance.post.mockRejectedValueOnce(new Error("Login failed"));

    render(<Login />);

    await act(async () => {
      // Simulate user input
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "" },
      });

      // Simulate button click
      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    // Ensure axios post was called
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "http://localhost:5001/api/users/login",
      {
        username: "",
        password: "",
      }
    );

    // Check that the error message is shown
    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });
});
