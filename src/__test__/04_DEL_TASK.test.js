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

  test("HOME-004: deletes a todo", async () => {
    // Mock the GET and DELETE API calls
    await axiosInstance.get.mockResolvedValueOnce({
      data: [{ id: "1", title: "Test Todo 1", completed: false }],
    });
    await axiosInstance.delete.mockResolvedValueOnce({});

    // Render the Home component
    await act(async () => {
      render(<Home />);
    });

    // Simulate button click to delete the todo
    await act(async () => {
      fireEvent.click(screen.getByText("Delete"));
    });

    // Ensure axios delete is called with correct data
    expect(axiosInstance.delete).toHaveBeenCalledWith(
      "http://localhost:5001/api/todos/1"
    );

    // Check if the todo is removed from the list
    expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
  });
});
