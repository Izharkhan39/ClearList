import "./style.css";
import { Task } from "./task";
import { Project } from "./project";

const createListBtn = document.querySelector("#createListBtn");
const projectUnorderdList = document.querySelector("#taskList");
let projectListArray = [];

//New List Button event listener
createListBtn.addEventListener("click", (e) => {
  addProject(task1);
});

function addProject(task) {
  const userInput = prompt("Name of Project");
  const project = createProject(userInput);
  projectListArray.push(project);
  project.addTaskToProjects(task);

  saveProjects();
  displayProjectTitle(project);
  return project;
}

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projectListArray));
}

function loadProjects() {
  const storedProjects = localStorage.getItem("projects");
  if (storedProjects) {
    projectListArray = JSON.parse(storedProjects);
    projectListArray.forEach(displayProjectTitle);
  }
}

function createProject(projectTitle) {
  return new Project(projectTitle);
}

function createTask(title, desc, dueDate, note, checklist) {
  return new Task(title, desc, dueDate, note, checklist);
}

function displayProjectTitle(project) {
  const projectDiv = document.createElement("div");
  projectDiv.textContent = project.title ? project.title : "Untitled";
  const li = document.createElement("li");
  li.appendChild(projectDiv);
  projectUnorderdList.appendChild(li);
}

loadProjects();

const task1 = new createTask(
  "Walking",
  "Take a walk",
  new Date().toISOString().split("T")[0],
  "Take and evening walk in the park",
  false
);

console.table(
  projectListArray[0].projects[0].title,
  projectListArray[0].projects[0].dueDate
);

// const task2 = new Tasks(
//   "Study",
//   "Study for exams",
//   new Date().toISOString().split("T")[0],
//   "Learn physics and chemistry",
//   false
// );

// const task3 = new Tasks(
//   "Build a project",
//   "A todo app",
//   new Date().toISOString().split("T")[0],
//   "Make the project organize",
//   false
// );

// const todayProject = new Projects("My Day");

// todayProject.addTaskToProjects(task1);

// //ul of Projects
// const ProjectList = document.querySelector("#taskList");

// //Today project btn
// const todayProjectBtn = document.createElement("button");

// const content = document.querySelector(".content");

// todayProjectBtn.textContent = todayProject.title;

// const li = document.createElement("li");
// li.appendChild(todayProjectBtn);

// ProjectList.appendChild(li);

// todayProjectBtn.addEventListener("click", () => {
//   for (let i = 0; i < todayProject.projects.length; i++) {
//     DisplayTask(i, todayProject);
//   }
// });

// function DisplayTask(index, projectTitle) {
//   const task = document.createElement("div");
//   task.textContent = projectTitle.projects[index].title;
//   content.appendChild(task);
// }
