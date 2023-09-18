const sql = require('mssql');
const dbConfig = require('../dbconfig');

class User {
    constructor({ userId, username, email, password }) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
    }


    static async create({ username, email, password }) {
        try {
            const pool = await sql.connect(dbConfig);

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await pool
                .request()
                .input('username', sql.NVarChar, username)
                .input('email', sql.NVarChar, email)
                .input('password', sql.NVarChar, hashedPassword)
                .query(`
          INSERT INTO Users (username, email, password)
          VALUES (@username, @email, @password);
        `);

            const userId = result.recordset[0].userId;

            return new User({
                userId,
                username,
                email,
                password: hashedPassword,
            });
        } catch (error) {
            throw error;
        }
    }

    static async findByUsernameOrEmail(identifier) {
        try {
            const pool = await sql.connect(dbConfig);

            const result = await pool
                .request()
                .input('identifier', sql.NVarChar, identifier)
                .query(`
          SELECT * FROM Users
          WHERE username = @identifier OR email = @identifier;
        `);

            const userData = result.recordset[0];

            if (!userData) {
                return null;
            }

            return new User(userData);
        } catch (error) {
            throw error;
        }
    }

    static async findById(userId) {
        try {
            const pool = await sql.connect(dbConfig);

            const result = await pool
                .request()
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM Users WHERE userId = @userId');

            const userData = result.recordset[0];

            if (!userData) {
                return null;
            }

            return new User(userData);
        } catch (error) {
            throw error;
        }
    }

    static async updateById(userId, { username, email }) {
        try {
            const pool = await sql.connect(dbConfig);

            await pool
                .request()
                .input('userId', sql.Int, userId)
                .input('username', sql.NVarChar, username)
                .input('email', sql.NVarChar, email)
                .query(`
                UPDATE Users
                SET username = @username, email = @email
                WHERE userId = @userId;
            `);

            return true;
        } catch (error) {
            throw error;
        }
    }

    static async changePassword(userId, newPassword) {
        try {
            const pool = await sql.connect(dbConfig);

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool
                .request()
                .input('userId', sql.Int, userId)
                .input('password', sql.NVarChar, hashedPassword)
                .query(`
                UPDATE Users
                SET password = @password
                WHERE userId = @userId;
            `);

            return true;
        } catch (error) {
            throw error;
        }
    }

    static async deleteById(userId) {
        try {
            const pool = await sql.connect(dbConfig);

            await pool
                .request()
                .input('userId', sql.Int, userId)
                .query('DELETE FROM Users WHERE userId = @userId');

            return true; 
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
