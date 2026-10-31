"use strict";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#taskName");
const taskList = document.querySelector("#task-list");
const counter = document.querySelector("#counter");
const filters = document.querySelector(".filtering-buttons");

const STORAGE_KEY = "todo-tasks";

const tasks = loadTasks();
let index = Math.max(0, ...tasks.map((t) => t.id)) + 1;
let currentFilter = "all";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks.filter(
      (task) =>
        task &&
        typeof task.id === "number" &&
        typeof task.title === "string" &&
        typeof task.completed === "boolean",
    );
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
}

function getFilteredTasks() {
  switch (currentFilter) {
    case "active":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);

    default:
      return tasks;
  }
}

function updateCounter() {
  const count = tasks.filter((task) => !task.completed).length;

  counter.textContent = `${count} Task${count === 1 ? "" : "s"} Remaining`;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.id = task.id;

  if (task.completed) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-checkbox");
  checkbox.checked = task.completed;

  const title = document.createElement("span");
  title.classList.add("task-title");
  title.textContent = task.title;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "Delete";

  li.append(checkbox, title, deleteButton);

  return li;
}

function renderTasks() {
  taskList.replaceChildren();

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    const msg = document.createElement("li");
    msg.classList.add("empty-message");

    if (tasks.length === 0) {
      msg.textContent = "No tasks yet. Add your Tasks :D";
    } else if (currentFilter === "active") {
      msg.textContent = "No active tasks.";
    } else if (currentFilter === "completed") {
      msg.textContent = "No completed tasks.";
    } else {
      msg.textContent = "No tasks to show.";
    }

    // BEFORE: msg was built but never inserted -> message never showed
    // AFTER: appended
    taskList.append(msg);
  } else {
    for (const task of filteredTasks) {
      taskList.append(createTaskElement(task));
    }
  }

  updateCounter();
}

function addTask(title) {
  const newTask = { id: index++, title: title, completed: false };
  tasks.push(newTask);

  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) {
    taskInput.focus();
    return;
  }

  addTask(title);

  taskForm.reset();
  taskInput.focus();
});

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return;
  }

  task.completed = !task.completed; // find() returns a REFERENCE -> mutates tasks

  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  if (!["all", "active", "completed"].includes(filter)) {
    return;
  }

  currentFilter = filter;

  const filterButtons = filters.querySelectorAll("button");

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;

    button.setAttribute("aria-pressed", String(isActive));
  });

  renderTasks();
}

function deleteTask(id) {
  const i = tasks.findIndex((t) => t.id === id);

  if (i === -1) {
    return;
  }

  tasks.splice(i, 1);

  saveTasks();
  renderTasks();
}

taskList.addEventListener("change", function (event) {
  if (!event.target.matches(".task-checkbox")) {
    return;
  }

  const taskElement = event.target.closest(".task-item");

  if (!taskElement) {
    return;
  }

  toggleTask(Number(taskElement.dataset.id));
});

taskList.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".delete-btn");

  if (!deleteButton) {
    return;
  }

  const taskElement = deleteButton.closest(".task-item");

  if (!taskElement) {
    return;
  }

  deleteTask(Number(taskElement.dataset.id));
});

filters.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-filter]");

  if (!button) {
    return;
  }

  filterTasks(button.dataset.filter);
});

renderTasks();
