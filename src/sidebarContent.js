function toggleSidebarProjects(projectListArray, projectList, event) {
  clearContent();
  const li = event.target.closest("li");

  if (!li || !projectList.contains(li)) return;

  projectList
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("active"));

  const text = li.querySelector("div").textContent.trim();
  li.classList.add("active");

  localStorage.setItem("activeProject", text);

  loadProjectContent(projectListArray);
}

function loadProjectContent(projectListArray) {
  const currentSelectedProject = document.querySelector("li.active");
  const taskContainer = document.querySelector(".taskContainer");
  const projectTitleDisplayElement = document.querySelector(".ProjectDetails");

  if (!currentSelectedProject) return;
  if (!Array.isArray(projectListArray)) return; // defensive check

  const selectedProjectTitle = currentSelectedProject.textContent.trim();
  taskContainer.innerHTML = "";
  projectTitleDisplayElement.innerHTML = "";

  for (let i = 0; i < projectListArray.length; i++) {
    const proj = projectListArray[i];
    if (!proj) continue; // skip null/undefined entries
    if (selectedProjectTitle === proj.title) {
      ProjectTitleDisplay(proj);
      // loop tasks
      for (let j = 0; j < (proj.projects || []).length; j++) {
        const task = proj.projects[j];
        if (!task) continue;
        const taskCard = createTaskCard(
          task.title,
          task.desc,
          task.dueDate,
          task.checklist,
          i,
          j,
          projectListArray,
          () => loadProjectContent(projectListArray)
        );
        taskContainer.appendChild(taskCard);
      }
    }
  }
}

function createTaskCard(
  title,
  desc,
  dueDate,
  checklist,
  projectIndex,
  taskIndex,
  projectListArray,
  rerenderCallback
) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("taskCard");

  const taskCheckBox = document.createElement("input");
  taskCheckBox.type = "checkbox";
  taskCheckBox.checked = checklist;

  taskCheckBox.addEventListener("change", () => {
    projectListArray[projectIndex].projects[taskIndex].checklist =
      taskCheckBox.checked;
    localStorage.setItem("projects", JSON.stringify(projectListArray));
    if (typeof rerenderCallback === "function") {
      rerenderCallback();
    }
  });

  const taskTitle = document.createElement("span");
  taskTitle.textContent = title;
  if (checklist) {
    taskTitle.style.textDecoration = "line-through";
  }

  const taskDueDate = document.createElement("span");
  taskDueDate.textContent = dueDate;
  taskDueDate.classList.add("dueDate");

  const taskDesc = document.createElement("span");
  taskDesc.textContent = desc;

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("titleContainer");

  const dateDescContainer = document.createElement("div");
  dateDescContainer.classList.add("dateDescContainer");

  const separationElement = document.createElement("div");
  separationElement.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dot-icon lucide-dot"><circle cx="12.1" cy="12.1" r="1"/></svg>`;

  const taskDataContainer = document.createElement("div");
  taskDataContainer.classList.add("taskDataContainer");

  titleContainer.appendChild(taskTitle);
  dateDescContainer.appendChild(taskDueDate);
  dateDescContainer.appendChild(separationElement);
  dateDescContainer.appendChild(taskDesc);

  taskDataContainer.appendChild(titleContainer);
  taskDataContainer.appendChild(dateDescContainer);

  taskCard.appendChild(taskCheckBox);
  taskCard.appendChild(taskDataContainer);

  return taskCard;
}

function ProjectTitleDisplay(Project) {
  const projectTitleDisplayElement = document.querySelector(".ProjectDetails");
  const projectTitle = document.createElement("div");
  projectTitle.textContent = Project.title;
  projectTitle.classList.add("projectTitle");

  projectTitleDisplayElement.appendChild(projectTitle);

  if (Project.title === "My Day") {
    const currentDate = document.createElement("div");
    const today = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    currentDate.textContent = today.toLocaleDateString("en-GB", options);
    currentDate.classList.add("currentDate");
    projectTitleDisplayElement.appendChild(currentDate);
  }
}

function userInput(title, desc, dueDate) {
  // Return plain object — index.js's addTask will accept this.
  return { title, desc, dueDate, checklist: false };
}

function clearContent() {
  const taskContainer = document.querySelector(".taskContainer");
  if (taskContainer) taskContainer.innerHTML = "";
}

/*
 * Instead of importing addTask from index.js (circular),
 * we export an initializer that accepts addTask as a callback.
 */
function initAddTaskHandler(addTaskCallback) {
  const addTaskBtn = document.querySelector("#addTaskBtn");
  if (!addTaskBtn) return;

  addTaskBtn.addEventListener("click", () => {
    const titleEl = document.querySelector("#task-title");
    const dateEl = document.querySelector("#task-date");
    const descEl = document.querySelector("#task-desc");

    const title = titleEl ? titleEl.value.trim() : "";
    const dueDate = dateEl ? dateEl.value : "";
    const desc = descEl ? descEl.value : "";

    if (!title || !dueDate) {
      // you could show a small UI hint here
      return;
    }

    // hide description (mirrors your previous behavior)
    if (descEl) descEl.classList.remove("active");

    const task = userInput(title, desc, dueDate);

    // call the callback provided by index.js (which owns the project list)
    if (typeof addTaskCallback === "function") {
      addTaskCallback(task);
    } else {
      console.error("addTask callback not provided to initAddTaskHandler");
    }

    if (titleEl) titleEl.value = "";
    if (dateEl) dateEl.value = "";
    if (descEl) descEl.value = "";

    // hide desc and blur title
    if (descEl) descEl.classList.remove("active");
    if (titleEl) titleEl.blur();
  });

  // attach focus listener ONCE
  const titleInput = document.querySelector("#task-title");
  if (titleInput) {
    titleInput.addEventListener("focus", () => {
      const taskDesc = document.querySelector("#task-desc");
      if (taskDesc) taskDesc.classList.add("active");
    });
  }
}

export { toggleSidebarProjects, initAddTaskHandler };
