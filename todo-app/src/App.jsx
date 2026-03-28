import { useState } from 'react';
import Header from './components/Header';
import ToDoList from './components/ToDoList';
import './App.css';

function App() {
  // ONE state holds ALL todos
  const [todos, setTodos] = useState([]);

  // Add new todo
  const addTodo = (text) => {
    setTodos([...todos, {
      id: Date.now(),      // Unique ID
      text,                // Task name
      completed: false,    // Done or not?
      editing: false,      // Editing mode?
      editText: text       // Temp edit text
    }]);
  };

  // Toggle complete
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Edit functions
  const startEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, editing: true } : todo
    ));
  };

  const updateEditText = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, editText: newText } : todo
    ));
  };

  const saveEdit = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text: newText, editing: false, editText: newText }
        : todo
    ));
  };

  const cancelEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, editing: false } : todo
    ));
  };

  return (
    <div className="app">
      <Header />
      <ToDoList
        todos={todos}
        addTodo={addTodo}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        startEdit={startEdit}
        updateEditText={updateEditText}
        saveEdit={saveEdit}
        cancelEdit={cancelEdit}
      />
    </div>
  );
}

export default App;