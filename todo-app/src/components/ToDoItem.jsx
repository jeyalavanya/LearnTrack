function ToDoItem({ todo, toggleTodo, deleteTodo, startEdit, updateEditText, saveEdit, cancelEdit }) {
  if (todo.editing) {
    return (
      <li className="todo-item editing">
        <input
          type="text"
          value={todo.editText}
          onChange={(e) => updateEditText(todo.id, e.target.value)}
          autoFocus
          className="edit-input"
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit(todo.id, e.target.value);
            if (e.key === 'Escape') cancelEdit(todo.id);
          }}
          onBlur={(e) => saveEdit(todo.id, e.target.value)}
        />
        <div className="edit-buttons">
          <button onClick={() => saveEdit(todo.id, todo.editText)} className="save-btn">✓</button>
          <button onClick={() => cancelEdit(todo.id)} className="cancel-btn">✕</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="checkbox"
      />
      <span className="todo-text" onClick={() => toggleTodo(todo.id)}>
        {todo.text}
      </span>
      <button onClick={() => startEdit(todo.id)} className="edit-btn">✏️</button>
      <button onClick={() => deleteTodo(todo.id)} className="delete-btn">🗑️</button>
    </li>
  );
}

export default ToDoItem;