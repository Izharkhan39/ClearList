import "./style.css";
import { Task } from "./task";
import { Project } from "./project";
import { toggleSidebarProjects, initAddTaskHandler } from "./sidebarContent";

const createListBtn = document.querySelector("#createListBtn");
const projectUnorderdList = document.querySelector("#projectList");
let projectListArray = [];

//New List Button event listener
createListBtn.addEventListener("click", () => {
  addProject();
});

document.addEventListener("DOMContentLoaded", () => {
  projectUnorderdList.addEventListener("click", (event) => {
    toggleSidebarProjects(projectListArray, projectUnorderdList, event);
  });

  const activeProjectTitle = localStorage.getItem("activeProject");

  if (activeProjectTitle) {
    const listItems = projectUnorderdList.querySelectorAll("li");
    listItems.forEach((li) => {
      const title = li.querySelector("div").textContent.trim();
      if (title === activeProjectTitle) {
        li.classList.add("active");
        toggleSidebarProjects(projectListArray, projectUnorderdList, {
          target: li,
        });
      }
    });
  } else {
    const firstLi = projectUnorderdList.querySelector("li");
    if (firstLi) {
      firstLi.classList.add("active");
      toggleSidebarProjects(projectListArray, projectUnorderdList, {
        target: firstLi,
      });
    }
  }
});

//Add Project to the project list
function addProject(projectName) {
  let project;

  if (projectName) {
    project = createProject(projectName);
  } else {
    let userInput = prompt("Name of Project");
    project = createProject(userInput);
  }

  projectListArray.push(project);

  saveProjects();
  const li = displayProjectTitle(project);
  toggleSidebarProjects(projectListArray, projectUnorderdList, { target: li });
  return project;
}

//Add tasks to the project
function addTask(task) {
  const currentSelectedProject = document.querySelector("li.active");
  let selectedProjectTitle;

  if (currentSelectedProject) {
    selectedProjectTitle = currentSelectedProject.textContent.trim();
    console.log(`Adding task ${selectedProjectTitle}`);
  }

  for (let i = 0; i < projectListArray.length; i++) {
    if (selectedProjectTitle === projectListArray[i].title) {
      projectListArray[i].projects.push(task);
    }
  }

  saveProjects();

  toggleSidebarProjects(projectListArray, projectUnorderdList, {
    target: currentSelectedProject,
  });
}

//Saves Projects data into local storage
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projectListArray));
}

//Loads saved project data from local storage
function loadProjects() {
  const storedProjects = localStorage.getItem("projects");
  if (storedProjects) {
    projectListArray = JSON.parse(storedProjects);
    projectListArray.forEach(displayProjectTitle);
  }
}

//Diplays Project title on sidebar
function displayProjectTitle(project) {
  const li = document.createElement("li");

  // Project title
  const projectDiv = document.createElement("div");
  projectDiv.textContent = project.title;
  projectDiv.classList.add("projectTitleDiv");

  const projectOptions = document.createElement("div");
  projectOptions.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-icon lucide-ellipsis"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
  projectOptions.classList.add("projectOption");

  projectOptions.addEventListener("click", ProjectMenu);

  // Add SVG directly
  projectDiv.innerHTML += `
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
         viewBox="0 0 24 24" fill="none" stroke="#f96424"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         class="lucide lucide-sun-icon lucide-sun">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2"/>
      <path d="M12 20v2"/>
      <path d="m4.93 4.93 1.41 1.41"/>
      <path d="m17.66 17.66 1.41 1.41"/>
      <path d="M2 12h2"/>
      <path d="M20 12h2"/>
      <path d="m6.34 17.66-1.41 1.41"/>
      <path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  `;

  li.appendChild(projectDiv);
  li.appendChild(projectOptions);
  projectUnorderdList.appendChild(li);
  return li;
}

function removeMenuOverlay() {
  const overlay = document.querySelector(".menu-overlay");
  const menu = document.querySelector(".project-menu");
  if (overlay) overlay.remove();
  if (menu) menu.remove();
  document.removeEventListener("keydown", onMenuEsc);
}

function onMenuEsc(e) {
  if (e.key === "Escape") removeMenuOverlay();
}

function ProjectMenu(e) {
  // prevent the list's click handler / document handlers from firing
  e.stopPropagation();

  // If a menu is already open, close it first
  removeMenuOverlay();

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  overlay.addEventListener("click", removeMenuOverlay);

  // Create menu
  const menu = document.createElement("div");
  menu.className = "project-menu";
  // prevent clicks inside menu from bubbling to overlay
  menu.addEventListener("click", (ev) => ev.stopPropagation());

  menu.innerHTML = `
    <div class="menu-item rename">Rename</div>
    <div class="menu-item delete">Delete</div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(menu);

  // Position near the clicked 3-dots (use currentTarget, not target,
  // since target might be the SVG path)
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();

  // Wait a frame to ensure menu has layout (offsetWidth is correct)
  requestAnimationFrame(() => {
    const menuWidth = menu.offsetWidth || 160;
    const margin = 6;

    const top = rect.bottom + window.scrollY + margin;
    const left = Math.min(
      rect.left + window.scrollX,
      window.scrollX + window.innerWidth - menuWidth - margin
    );

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  });

  // Hook up actions
  const li = btn.closest("li");
  menu.querySelector(".rename").addEventListener("click", (ev) => {
    ev.stopPropagation();
    handleRename(li);
    removeMenuOverlay();
  });

  menu.querySelector(".delete").addEventListener("click", (ev) => {
    ev.stopPropagation();
    handleDelete(li);
    removeMenuOverlay();
  });

  // ESC to close
  document.addEventListener("keydown", onMenuEsc);
}

function handleRename(projectLi) {
  const titleDiv = projectLi.querySelector("div");
  const oldTitle = titleDiv.childNodes[0].textContent.trim(); // only text, not SVG
  const newTitle = prompt("Rename project:", oldTitle);
  if (!newTitle || !newTitle.trim()) return;

  // Update UI text node (leave SVG intact)
  titleDiv.childNodes[0].textContent = newTitle.trim();

  // Update storage
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const idx = projects.findIndex((p) => p.title === oldTitle);
  if (idx > -1) {
    projects[idx].title = newTitle.trim();
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  renderProjects();
}

function handleDelete(projectLi) {
  const title = projectLi.querySelector("div").childNodes[0].textContent.trim();

  // // Optional: protect fixed projects
  // const fixed = ["My Day", "Important", "Planned"];
  // if (fixed.includes(title)) {
  //   alert(`"${title}" is a fixed project and cannot be deleted.`);
  //   return;
  // }

  if (!confirm(`Delete project "${title}"?`)) return;

  // Remove from UI
  projectLi.remove();

  // Remove from storage
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  const filtered = projects.filter((p) => p.title !== title);
  localStorage.setItem("projects", JSON.stringify(filtered));

  renderProjects();
}

function renderProjects() {
  // Clear the sidebar
  projectUnorderdList.innerHTML = "";

  // Reload from storage
  const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
  projectListArray = storedProjects;

  // Rebuild the list
  storedProjects.forEach(displayProjectTitle);
}

loadProjects();
initAddTaskHandler(addTask);

function createProject(projectTitle) {
  return new Project(projectTitle);
}

export { addTask };
