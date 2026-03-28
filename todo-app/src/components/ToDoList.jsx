import { useState } from 'react';
import ToDoItem from './ToDoItem';
import './../App.css';

function ToDoList({ todos, addTodo, toggleTodo, deleteTodo, startEdit, updateEditText, saveEdit, cancelEdit }) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      addTodo(inputText);
      setInputText('');
    }
  };

  return (
    <main className="todo-container">
      {/* ADD FORM */}
      <form onSubmit={handleSubmit} className="add-form">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="add-button">➕ Add Task</button>
      </form>

      {/* TODO LIST - MAP FUNCTION */}
      <ul className="todo-list">
        {todos.map(todo => (
          <ToDoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            startEdit={startEdit}
            updateEditText={updateEditText}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
          />
        ))}
      </ul>
    </main>
  );
}

export default ToDoList;