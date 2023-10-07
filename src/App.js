import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [updatedTodo, setUpdatedTodo] = useState(null);
  const inputRef = useRef(null);

  const toDoSuccess = (message) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };


  const errorTodo = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error)
        errorTodo("Failed to fetch todos");
    })
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim() === "") return;
    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([data, ...todos]);
        setNewTodo("");
        toDoSuccess("Task added successfully!");
      })
      .catch((error) => {
        console.error("Error fetching todos:", error)
        errorTodo("Failed to add todo");
    })
  };

  const handleUpdateTodo = () => {
    if (updatedTodo === null) return;

    fetch(`https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTodos = todos.map((todo) =>
          todo.id === updatedTodo.id ? data : todo
        );
        setTodos(updatedTodos);
        setNewTodo("");
        setUpdatedTodo(null);
        toDoSuccess("Task updated successfully!");
      })
      .catch((error) => {
        console.error("Error updaing todos:", error)
        errorTodo("Failed to update todo");
    })
  };

  const handleDeleteTodo = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        toDoSuccess("Task deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting todos:", error)
        errorTodo("Failed to delete todo");
    })
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <input
        type="text"
        className="input"
        placeholder="Add a new todo"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        ref={inputRef}
      />

      {updatedTodo !== null ? (
        <button id="update" className="btn" onClick={handleUpdateTodo}>
          Update
        </button>
      ) : (
        <button id="add" className="btn" onClick={handleAddTodo}>
          Add
        </button>
      )}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button
              id="update"
              className="btn"
              onClick={() => {
                setUpdatedTodo(todo);
                inputRef.current.focus();
              }}
            >
              Update
            </button>
            <button
              className="btn"
              id="delete"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
}

export default App;
