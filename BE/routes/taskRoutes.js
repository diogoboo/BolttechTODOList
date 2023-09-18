const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/project/:projectId', taskController.getTasksByProject);
router.put('/:taskId', taskController.updateTask);
router.put('/:taskId/markCompleted', taskController.markTaskCompleted);
router.delete('/:taskId', taskController.deleteTask);
router.get('/:taskId', taskController.getTaskDetails);

module.exports = router;
