const Project = require('../models/Project'); 

const createProject = async (req, res) => {
  try {
    const { projectName, userId } = req.body;

    const newProject = await Project.create({ projectName, userId });

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.getByUserId(userId);

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { projectName, description } = req.body;

    const updated = await Project.updateById(projectId, { projectName });

    if (updated) {
      res.status(200).json({ message: 'Project updated successfully' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deleted = await Project.deleteById(projectId);

    if (deleted) {
      res.status(200).json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.getById(projectId);

    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createProject,
  getProjectsByUser,
  updateProject,
  deleteProject,
  getProjectDetails,
};
