let taskList = [];

if (localStorage.getItem("taskList") !== null) {
  taskList = JSON.parse(localStorage.getItem("taskList"));
}

let editID;
let isEditTask = false;

const taskInput = document.querySelector("#taskInput");
const allClearBtn = document.querySelector("#allClearBtn");
const filters = document.querySelectorAll(".filters span");
console.log(filters);

displayTasks("all");

function displayTasks(filter) {
  let ul = document.getElementById("task-list");
  ul.innerHTML = "";

  if (taskList.length == 0) {
    ul.innerHTML =
      "<p class='p-3 m-0'>There are no tasks. You can add new task and create your plan right away!</p>";
  } else {
    for (let task of taskList) {
      let completed = task.status == "completed" ? "checked" : "";

      if (filter == task.status || filter == "all") {
        let li = `
        <li class="task list-group-item">
            <div class="form-check">
                <input type="checkbox" onclick="updateStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
                <label for="${task.id}" class="form-check-label ${completed}">${task.taskList}</label>
            </div>
            <div class="dropdown">
              <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-ellipsis"></i>
              </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a onclick='updateTask(${task.id}, "${task.taskList}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen-to-square"></i> Edit</a></li>
                  <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Delete</a></li>
                </ul>
          </div>
        </li>
          `;
        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}

// AddTask Button click property is defined.
let addTask = document
  .querySelector("#addTask")
  .addEventListener("click", addNewTask);

// Pressing enter will add a new task.
document.querySelector("#addTask").addEventListener("keypress", function () {
  if (event.key == "Enter") {
    document.getElementById("addTask").click();
  }
});

for (let span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTasks(span.id);
  });
}

// Add New Task Function.
function addNewTask(e) {
  if (taskInput.value == "") {
    Swal.fire({
      icon: "error",
      text: "Please enter a task.",
      confirmButtonText: "Close",
      confirmButtonColor: "#031733",
    });
  } else {
    if (!isEditTask) {
      //* Added Task
      taskList.push({
        id: taskList.length + 1,
        taskList: taskInput.value,
        status: "pending",
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "A new task has been added.",
        showConfirmButton: false,
        timer: 1500,
      });
      displayTasks(document.querySelector("span.active").id);
      localStorage.setItem("taskList", JSON.stringify(taskList));
    } else {
      //* Update Task
      for (let task of taskList) {
        if (task.id == editID) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "The selected task has been updated.",
            showConfirmButton: false,
            timer: 1500,
          });
          task.taskList = taskInput.value;
        }
        isEditTask = false;
      }
    }
    taskInput.value = "";
    displayTasks(document.querySelector("span.active").id);
  }
  e.preventDefault();
}

// Delete Task Function
function deleteTask(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#031733",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your file has been deleted.",
        showConfirmButton: false,
        timer: 1500,
      });
      let deletedID = "";
      deletedID = taskList.findIndex((task) => task.id == id);
      taskList.splice(deletedID, 1);
      displayTasks(document.querySelector("span.active").id);
      localStorage.setItem("taskList", JSON.stringify(taskList));
    }
  });
}

// Update Task Function
function updateTask(taskID, taskName) {
  editID = taskID;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

// All Task Clear
allClearBtn.addEventListener("click", function () {
  taskList.splice(0, taskList.length);
  Swal.fire({
    position: "center",
    icon: "success",
    title: "All tasks have been deleted.",
    showConfirmButton: false,
    timer: 1500,
  });
  localStorage.setItem("taskList", JSON.stringify(taskList));
  displayTasks("all");
});

function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let status;

  if (selectedTask.checked) {
    label.classList.add("checked");
    status = "completed";
    Swal.fire({
      position: "center",
      icon: "success",
      title: "The job is done.",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    label.classList.remove("checked");
    status = "pending";

    Swal.fire({
      position: "center",
      icon: "info",
      title: "The task could not be completed has been rolled back.",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  for (let task of taskList) {
    if (task.id == selectedTask.id) {
      task.status = status;
    }
  }

  displayTasks(document.querySelector("span.active").id);

  localStorage.setItem("taskList", JSON.stringify(taskList));
}
