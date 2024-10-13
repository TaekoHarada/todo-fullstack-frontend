"use client";

import { useEffect, useState } from "react";
import axiosInstance from "./utils/axiosInstance";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5001/api/todos";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const router = useRouter();

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

  const addTodo = async () => {
    try {
      const res = await axiosInstance.post(API_URL, { title: newTodo });
      setTodos([...todos, res.data]);
      setNewTodo("");
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

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const res = await axiosInstance.put(`${API_URL}/${id}`, { completed });
      setTodos(todos.map((todo) => (todo.id === id ? res.data : todo)));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Todo App</h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border p-2"
            placeholder="Add a new todo"
          />
          <button
            onClick={addTodo}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white h-10 px-4"
          >
            Add Todo
          </button>
        </div>

        <ul className="list-none" data-testid="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between">
              <span
                className={`cursor-pointer ${
                  todo.completed ? "line-through" : ""
                }`}
                onClick={() => toggleTodo(todo.id, !todo.completed)}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white rounded p-2 ml-4"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>Todo App using Next.js</p>
      </footer>
    </div>
  );
}
