class Project {
  projects = [];

  constructor(title) {
    this.title = title;
  }

  addTaskToProjects(task) {
    this.projects.push(task);
  }
}

export { Project };
