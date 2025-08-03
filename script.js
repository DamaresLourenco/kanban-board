document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  enableDrag();
});

function addTask(columnId) {
  const input = document.getElementById(`input-${columnId}`);
  const taskText = input.value.trim();
  if (taskText === "") return;

  const task = createTaskElement(taskText);
  document.getElementById(columnId).appendChild(task);
  input.value = "";

  saveTasks();
}

function createTaskElement(text) {
  const div = document.createElement("div");
  div.className = "task";
  div.draggable = true;
  div.textContent = text;

  const btn = document.createElement("button");
  btn.textContent = "🗑️";
  btn.onclick = () => {
    div.remove();
    saveTasks();
  };

  div.appendChild(btn);
  return div;
}

function enableDrag() {
  const taskLists = document.querySelectorAll(".task-list");

  taskLists.forEach(list => {
    list.addEventListener("dragover", e => e.preventDefault());
    list.addEventListener("drop", e => {
      const task = document.querySelector(".dragging");
      list.appendChild(task);
      saveTasks();
    });
  });

  document.addEventListener("dragstart", e => {
    if (e.target.classList.contains("task")) {
      e.target.classList.add("dragging");
    }
  });

  document.addEventListener("dragend", e => {
    if (e.target.classList.contains("task")) {
      e.target.classList.remove("dragging");
    }
  });
}

function saveTasks() {
  const data = {};
  document.querySelectorAll(".task-list").forEach(list => {
    const id = list.id;
    data[id] = Array.from(list.children).map(task => task.childNodes[0].textContent);
  });
  localStorage.setItem("kanban", JSON.stringify(data));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem("kanban"));
  if (!data) return;

  Object.keys(data).forEach(column => {
    data[column].forEach(taskText => {
      const task = createTaskElement(taskText);
      document.getElementById(column).appendChild(task);
    });
  });
}

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
