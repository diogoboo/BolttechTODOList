const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/', projectController.createProject);
router.get('/user/:userId', projectController.getProjectsByUser);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);
router.get('/:projectId', projectController.getProjectDetails);

module.exports = router;
