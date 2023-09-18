const sql = require('mssql');
const dbConfig = require('../dbconfig');

class Project {
  constructor({ projectId, projectName, userId }) {
    this.projectId = projectId;
    this.projectName = projectName;
    this.userId = userId;
  }

  static async create({ projectName, userId }) {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool
        .request()
        .input('projectName', sql.NVarChar, projectName)
        .input('userId', sql.Int, userId)
        .query(`
          INSERT INTO Projects (projectName, userId)
          VALUES (@projectName, @userId);
        `);

      const projectId = result.recordset[0].projectId;

      return new Project({
        projectId,
        projectName,
        userId,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    try {
      const pool = await sql.connect(dbConfig);

      const result = await pool
        .request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Projects WHERE userId = @userId');

      const projects = result.recordset.map((row) => new Project(row));

      return projects;
    } catch (error) {
      throw error;
    }
  }

  static async updateById(projectId, { projectName }) {
    try {
      const pool = await sql.connect(dbConfig);

      await pool
        .request()
        .input('projectId', sql.Int, projectId)
        .input('projectName', sql.NVarChar, projectName)
        .query(`
          UPDATE Projects
          SET projectName = @projectName
          WHERE projectId = @projectId;
        `);

      return true;
    } catch (error) {
      throw error;
    }
  }


  static async deleteById(projectId) {
    try {
      const pool = await sql.connect(dbConfig);

      await pool
        .request()
        .input('projectId', sql.Int, projectId)
        .query('DELETE FROM Projects WHERE projectId = @projectId');

      await pool
        .request()
        .input('projectId', sql.Int, projectId)
        .query('DELETE FROM Tasks WHERE projectId = @projectId');

      return true; 
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Project;
