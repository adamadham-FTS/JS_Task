"use strict";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#taskName");
const taskList = document.querySelector("#task-list");
const counter = document.querySelector("#counter");
const filters = document.querySelector(".filtering-buttons");

const STORAGE_KEY = "todo-tasks";

const tasks = new Map(loadTasks().map((task) => [task.id, task]));

let index = Math.max(0, ...tasks.keys()) + 1;
const FILTER = Object.freeze({
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
});

let currentFilter = FILTER.ALL;
const taskTemplate = document.querySelector("#task-template");

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...tasks.values()]));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
}

function getFilteredTasks() {
  switch (currentFilter) {
    case FILTER.ACTIVE:
      return [...tasks.values()].filter((task) => !task.completed);
    case FILTER.COMPLETED:
      return [...tasks.values()].filter((task) => task.completed);

    default:
      return [...tasks.values()];
  }
}

function updateCounter() {
  const count = [...tasks.values()].filter((task) => !task.completed).length;

  counter.textContent = `${count} Task${count === 1 ? "" : "s"} Remaining`;
}

function createTaskElement(task) {
  const li = taskTemplate.content.firstElementChild.cloneNode(true);

  li.dataset.id = task.id;
  li.classList.toggle("completed", task.completed);

  const checkbox = li.querySelector(".task-checkbox");
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Complete ${task.title}`);

  li.querySelector(".task-title").textContent = task.title;

  li.querySelector(".delete-btn").setAttribute(
    "aria-label",
    `Delete ${task.title}`,
  );

  return li;
}

function renderTasks() {
  taskList.replaceChildren();

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    const msg = document.createElement("li");
    msg.classList.add("empty-message");

    if (tasks.size === 0) {
      msg.textContent = "No tasks yet. Add your Tasks :D";
    } else if (currentFilter === FILTER.ACTIVE) {
      msg.textContent = "No active tasks.";
    } else if (currentFilter === FILTER.COMPLETED) {
      msg.textContent = "No completed tasks.";
    } else {
      msg.textContent = "No tasks to show.";
    }

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
  tasks.set(newTask.id, newTask);

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
  const task = tasks.get(id);

  if (!task) {
    return;
  }

  task.completed = !task.completed;

  saveTasks();
  renderTasks();
}

function filterTasks(filterKey) {
  if (!Object.hasOwn(FILTER, filterKey)) return;

  currentFilter = FILTER[filterKey];

  filters.querySelectorAll("button").forEach((button) => {
    const isActive = FILTER[button.dataset.filter] === currentFilter;

    button.setAttribute("aria-pressed", String(isActive));
  });

  renderTasks();
}

function deleteTask(id) {
  if (!tasks.delete(id)) return;

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
