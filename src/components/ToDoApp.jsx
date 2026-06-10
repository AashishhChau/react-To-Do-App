import React, { useEffect, useState } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos"));
    if (saved) setTodos(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;

    setTodos([
      {
        id: Date.now(),
        text: input,
        completed: false,
      },
      ...todos,
    ]);

    setInput("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = () => {
    if (!editText.trim()) return;

    setTodos(
      todos.map((t) =>
        t.id === editingId ? { ...t, text: editText } : t
      )
    );

    cancelEdit();
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 text-white">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Todo App
          </h1>
          <p className="text-white/70 mt-1">
            Clean • Fast • Minimal
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Write your task..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 
            outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-white/50"
          />

          <button
            onClick={addTodo}
            className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 
            active:scale-95 transition font-semibold shadow-lg"
          >
            Add
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm transition-all duration-200 border ${
                filter === f
                  ? "bg-white text-black border-white"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

    
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-white/60 py-6">
              No tasks found
            </p>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between bg-white/10 border border-white/10 
                rounded-2xl p-4 hover:bg-white/15 transition-all duration-200"
              >

                
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 accent-purple-500"
                  />

                  {editingId === todo.id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1 rounded-lg bg-white/10 border border-white/20 outline-none"
                    />
                  ) : (
                    <span
                      className={`break-words ${
                        todo.completed
                          ? "line-through text-white/40"
                          : "text-white"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                
                <div className="flex gap-2 ml-3 text-sm">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="text-green-400 hover:text-green-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-300 hover:text-white"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-blue-300 hover:text-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

    
        <div className="mt-6 text-center text-white/50 text-sm">
          Total Tasks: {todos.length}
        </div>
      </div>
    </div>
  );
}