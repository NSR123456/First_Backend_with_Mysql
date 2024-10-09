const db = require("../config/db");
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

// Get all students
const getStudents = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM students');
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Records found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'All Students Records',
            totalStudents: data.length,
            data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error in Get All Student API',
            error
        });
    }
};

// Get student by ID
const getStudentByID = async (req, res) => {
    try {
        const studentId = req.params.id;
        if (!studentId) {
            return res.status(404).json({
                success: false,
                message: 'Invalid or Provide Student id'
            });
        }

        const [data] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]);
        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Records found'
            });
        }
        res.status(200).json({
            success: true,
            studentDetails: data[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error in Get Student by ID API',
            error
        });
    }
};

// Create student
const createStudent = async (req, res) => {
    try {
        const { Id, Sect, Dept, Phn_no, Email, Password } = req.body;
        if (!Id || !Sect || !Dept || !Phn_no || !Email || !Password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields'
            });
        }

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(Password, salt);

        const [data] = await db.query('INSERT INTO students (Id, Sect, Dept, Phn_no, Email, Password) VALUES (?, ?, ?, ?, ?, ?)',
            [Id, Sect, Dept, Phn_no, Email, hashedPassword]);

        res.status(201).json({
            success: true,
            message: 'New Student Record Created',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error in Create Student API',
            error
        });
    }
};

// Update student
const updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { Id, Sect, Dept, Phn_no, Email, Password } = req.body;

        if (!studentId) {
            return res.status(404).json({
                success: false,
                message: 'Invalid ID or provide ID'
            });
        }

        let hashedPassword = Password;
        if (Password) {
            const salt = genSaltSync(10);
            hashedPassword = hashSync(Password, salt);
        }

        const [data] = await db.query('UPDATE students SET Id = ?, Sect = ?, Dept = ?, Phn_no = ?, Email = ?, Password = ? WHERE Id = ?',
            [Id, Sect, Dept, Phn_no, Email, hashedPassword, studentId]);

        if (data.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error in Update Data'
            });
        }
        res.status(200).json({
            success: true,
            message: "Student Details Updated",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error in Update Student API',
            error
        });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        if (!studentId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid student ID'
            });
        }

        const [result] = await db.query('DELETE FROM students WHERE id = ?', [studentId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'No student found with this ID to delete'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error in Delete Student API',
            error
        });
    }
};

// Get user by email
const getUserByUserEmail = async (email) => {
    try {
        const [results] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
        return results[0];  // Return the first user, if any
    } catch (error) {
        throw error;  // Throw error to be caught in calling function
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const user = await getUserByUserEmail(Email);
        if (!user) {
            return res.status(400).json({
                success: 0,
                data: "Invalid email or password"
            });
        }

        const isMatch = compareSync(Password, user.Password);
        if (!isMatch) {
            return res.status(400).json({
                success: 0,
                data: "Invalid email or password"
            });
        }

        user.Password = undefined;  // Remove password from returned data
        const token = sign({ result: user }, "qwe1234", { expiresIn: "1h" });

        return res.status(200).json({
            success: 1,
            message: "Login successful",
            token
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: 0,
            message: "Server error during login",
            error
        });
    }
};

// Export modules
module.exports = {
    getStudents,
    getStudentByID,
    createStudent,
    updateStudent,
    deleteStudent,
    loginUser
};
