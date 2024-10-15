"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "./utils/axiosInstance";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

const API_URL = "http://localhost:5001/api/todos";
const LOGOUT_API_URL = "http://localhost:5001/api/users/logout";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// Define Zod schema for form validation
const todoSchema = z.object({
  title: z.string().min(1, "Error: Input todo."), // Validation for non-empty title
});

type FormData = z.infer<typeof todoSchema>; // Infer form data type from Zod schema

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();

  // Use useForm hook from React Hook Form, pass Zod schema to resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(todoSchema),
  });

  // Fetch Todos with JWT
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axiosInstance.get(API_URL); // Cookies sent automatically
      res ? setTodos(res.data) : console.log("No todo data found");
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("You are not authorized. Please log in again.", error);
        router.push("/login");
      } else {
        console.error("Error fetching todos:", error);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axiosInstance.post(API_URL, { title: data.title });
      setTodos([...todos, res.data]);
      reset();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id: string, title: string, completed: boolean) => {
    try {
      const res = await axiosInstance.put(`${API_URL}/${id}`, {
        title,
        completed,
      });

      console.log("toggleTodo res.data", res.data);
      setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(LOGOUT_API_URL); // Call the logout endpoint
      router.push("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Todo App</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white p-2 rounded mb-4 text-sm"
        >
          Logout
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-4 items-center flex-col sm:flex-row"
        >
          <input
            type="text"
            {...register("title")} // Register input with validation
            className="border p-2"
            placeholder="Add a new todo"
          />
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white h-10 px-4"
          >
            Add Todo
          </button>
        </form>
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <ul className="list-none" data-testid="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between m-1">
              <span
                className={`cursor-pointer ${
                  todo.completed ? "line-through" : ""
                }`}
                onClick={() => toggleTodo(todo.id, todo.title, !todo.completed)}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white rounded p-2 ml-4 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>Todo App for Testing</p>
      </footer>
    </div>
  );
}
