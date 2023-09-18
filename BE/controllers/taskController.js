const Task = require('../models/Task'); // Add this import statement

const createTask = async (req, res) => {
  try {
    const { projectId, description, creationDate, finishDate } = req.body;

    const newTask = await Task.create({ projectId, description, creationDate, finishDate });

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.getByProjectId(projectId);

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description, finishDate, completed } = req.body;
    const updated = await Task.updateById(taskId, { description, finishDate, completed });

    if (updated) {
      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markTaskCompleted = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;

    const updated = await Task.updateById(taskId, { completed });

    if (updated) {
      res.status(200).json({ message: 'Task status updated successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deleted = await Task.deleteById(taskId);

    if (deleted) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.getById(taskId);

    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  markTaskCompleted,
  deleteTask,
  getTaskDetails,
};
