class Project {
  projects = [];

  constructor(title) {
    this.title = title || "Untitled";
  }

  addTaskToProjects(task) {
    this.projects.push(task);
  }

  renameTitle(newTitle) {
    this.title = newTitle;
  }
}

export { Project };
