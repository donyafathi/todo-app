
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Design the new website homepage",
    description: "Create a modern and responsive homepage design.",
    category: "Work",
    priority: "High",
    dueDate: "",
    completed: false,
  },
  {
    id: 2,
    title: "Study React fundamentals",
    description: "Learn components, props and state.",
    category: "Study",
    priority: "Medium",
    dueDate: "",
    completed: false,
  },
  {
    id: 3,
    title: "Go for a morning walk",
    description: "Walk for at least 30 minutes.",
    category: "Health",
    priority: "Low",
    dueDate: "",
    completed: true,
  },
];

const categories = ["Work", "Personal", "Study", "Health"];

function readTasks() {
  try {
    const saved = localStorage.getItem("todo-tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  } catch {
    return initialTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const today = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      total: tasks.length,
      completed,
      remaining: tasks.length - completed,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;

      if (activeFilter === "Today") {
        matchesFilter = task.dueDate === today && !task.completed;
      } else if (activeFilter === "Upcoming") {
        matchesFilter =
          task.dueDate > today && !task.completed;
      } else if (activeFilter === "Completed") {
        matchesFilter = task.completed;
      } else if (categories.includes(activeFilter)) {
        matchesFilter = task.category === activeFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [tasks, activeFilter, search, today]);

  function openAddForm() {
    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      category: "Personal",
      priority: "Medium",
      dueDate: "",
    });
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) return;

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...form, title: form.title.trim() }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),
        ...form,
        title: form.title.trim(),
        completed: false,
      };

      setTasks((prev) => [newTask, ...prev]);
    }

    setShowForm(false);
    setEditingTask(null);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  const filterItems = [
    { name: "All", icon: "◈" },
    { name: "Today", icon: "◷" },
    { name: "Upcoming", icon: "▦" },
    { name: "Completed", icon: "✓" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>TaskFlow</span>
        </div>

        <div className="side-label">MENU</div>

        <nav className="navigation">
          {filterItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activeFilter === item.name ? "active" : ""
              }`}
              onClick={() => setActiveFilter(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>

              {item.name === "All" && (
                <span className="nav-count">{stats.total}</span>
              )}

              {item.name === "Completed" && (
                <span className="nav-count">{stats.completed}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="side-label category-label">CATEGORIES</div>

        <nav className="navigation">
          {categories.map((category) => (
            <button
              key={category}
              className={`nav-item ${
                activeFilter === category ? "active" : ""
              }`}
              onClick={() => setActiveFilter(category)}
            >
              <span className={`category-dot ${category.toLowerCase()}`} />
              <span>{category}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">✦</div>
            <strong>Stay productive!</strong>
            <p>Small steps every day lead to big results.</p>
          </div>

          <div className="sidebar-footer">
            <div className="avatar">T</div>
            <div className="profile-info">
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{activeFilter}</strong>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-shortcut">⌘ K</span>
            </div>

            <div className="top-avatar">T</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <div className="eyebrow">YOUR WORKSPACE</div>
              <h1>
                Good day! <span className="wave">✦</span>
              </h1>
              <p>Let's make today productive.</p>
            </div>

            <button className="add-button" onClick={openAddForm}>
              <span>+</span> Add new task
            </button>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total tasks</span>
                <span className="stat-icon purple">◈</span>
              </div>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-description">Tasks in your workspace</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Completed</span>
                <span className="stat-icon green">✓</span>
              </div>
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-description">Tasks finished</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Remaining</span>
                <span className="stat-icon orange">◷</span>
              </div>
              <div className="stat-number">{stats.remaining}</div>
              <div className="stat-description">Tasks to complete</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Progress</span>
                <span className="stat-icon blue">↗</span>
              </div>
              <div className="stat-number">
                {stats.total
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0}
                %
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      stats.total
                        ? (stats.completed / stats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </section>

          <section className="task-section">
            <div className="task-section-header">
              <div>
                <h2>{activeFilter} tasks</h2>
                <p>
                  {filteredTasks.length}{" "}
                  {filteredTasks.length === 1 ? "task" : "tasks"} found
                </p>
              </div>

              <button className="sort-label" onClick={() => setActiveFilter("All")}>
                View all <span>→</span>
              </button>
            </div>

            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✓</div>
                  <h3>No tasks found</h3>
                  <p>Add a task or change your filters.</p>
                  <button className="add-button" onClick={openAddForm}>
                    + Create a task
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <article
                    key={task.id}
                    className={`task-card ${
                      task.completed ? "task-completed" : ""
                    }`}
                  >
                    <button
                      className={`task-checkbox ${
                        task.completed ? "checked" : ""
                      }`}
                      onClick={() => toggleTask(task.id)}
                      aria-label="Toggle task completion"
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="task-details">
                      <h3>{task.title}</h3>
                      {task.description && (
                        <p className="task-description">
                          {task.description}
                        </p>
                      )}

                      <div className="task-meta">
                        <span className={`category-badge ${task.category.toLowerCase()}`}>
                          {task.category}
                        </span>

                        <span
                          className={`priority-badge ${task.priority.toLowerCase()}`}
                        >
                          <span className="priority-dot" />
                          {task.priority}
                        </span>

                        {task.dueDate && (
                          <span className="date-badge">
                            ◷ {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="task-actions">
                      <button
                        onClick={() => openEditForm(task)}
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{editingTask ? "Edit task" : "Create a task"}</h2>
                <p>Fill in the details of your task.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Task title <span className="required">*</span>
                <input
                  type="text"
                  placeholder="What do you need to do?"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                  autoFocus
                />
              </label>

              <label>
                Description
                <textarea
                  placeholder="Add more details..."
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>

              <div className="form-row">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <label>
                Due date
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </label>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="add-button">
                  {editingTask ? "Save changes" : "Create task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
