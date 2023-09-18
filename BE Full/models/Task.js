const sql = require('mssql');
const dbConfig = require('../dbconfig');

class Task {
  constructor({ taskId, projectId, description, creationDate, finishDate, completed }) {
    this.taskId = taskId;
    this.projectId = projectId;
    this.description = description;
    this.creationDate = creationDate;
    this.finishDate = finishDate;
    this.completed = completed;
  }

  static async create({ projectId, description, creationDate, finishDate, completed }) {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool
        .request()
        .input('projectId', sql.Int, projectId)
        .input('description', sql.NVarChar, description)
        .input('creationDate', sql.DateTime, creationDate)
        .input('finishDate', sql.DateTime, finishDate)
        .input('completed', sql.Bit, completed)
        .query(`
          INSERT INTO Tasks (projectId, description, creationDate, finishDate, completed)
          VALUES (@projectId, @description, @creationDate, @finishDate, @completed);
        `);

      const taskId = result.recordset[0].taskId;

      return new Task({
        taskId,
        projectId,
        description,
        creationDate,
        finishDate,
        completed,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getById(taskId) {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool
        .request()
        .input('taskId', sql.Int, taskId)
        .query('SELECT * FROM Tasks WHERE taskId = @taskId');

      const taskDetails = result.recordset[0];

      if (!taskDetails) {
        return null; 
      }

      return new Task(taskDetails);
    } catch (error) {
      throw error;
    }
  }

  static async getByProjectId(projectId) {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool
        .request()
        .input('projectId', sql.Int, projectId)
        .query('SELECT * FROM Tasks WHERE projectId = @projectId');

      const tasks = result.recordset.map((row) => new Task(row));

      return tasks;
    } catch (error) {
      throw error;
    }
  }

  static async updateById(taskId, { description, finishDate, completed }) {
    try {
      const pool = await sql.connect(dbConfig);

      await pool
        .request()
        .input('taskId', sql.Int, taskId)
        .input('description', sql.NVarChar, description)
        .input('finishDate', sql.DateTime, finishDate)
        .input('completed', sql.Bit, completed)
        .query(`
          UPDATE Tasks
          SET description = @description, finishDate = @finishDate, completed = @completed
          WHERE taskId = @taskId;
        `);

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(taskId) {
    try {
      const pool = await sql.connect(dbConfig);

      await pool
        .request()
        .input('taskId', sql.Int, taskId)
        .query('DELETE FROM Tasks WHERE taskId = @taskId');

      return true; 
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Task;
