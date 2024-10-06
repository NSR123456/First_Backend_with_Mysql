const db = require("../config/db");

//get all student list
const getStudents = async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM students');
        if (!data) {
            return res.status(404).send({
                success: false,
                message: 'No Records found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'All Students Records',
           totalStudents: data[0].length,
            data: data[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get All Student API',
            error
        });
    }
};

//get student by id
const getStudentByID = async(req,res) => {
    try{
        const studentId = req.params.id
        if(!studentId){
            return res.status(404).send({
                success:false,
                message:'Invalid Or Provide Student id'
            })
        }
        //const data = await db.query(` SELECT * FROM students WHERE id =`+ studentId)
        const data = await db.query(`SELECT * FROM students WHERE id =? `, [studentId]) //prevent sql injection, secure query
        if(!data){
            return res.status(404).send({
                success: false,
                message:'no Records found'
            })
        }
        res.status(200).send({
            success:true,
            studentDetails:data[0]
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Get student by id API',
            error
        });
    }
};
//create student
const createStudent = async(req,res) => {
    try{
       const {Sect, Dept, Phn_no, Email} = req.body;
        if(!Sect || !Dept || !Phn_no || !Email){
            return res.status(500).send({
                success: false,
                message: 'Please Provide all fields'
            })
        }
        const data = await db.query('INSERT INTO students (Sect, Dept, Phn_no, Email) VALUES (?, ?, ?, ?)',
              [Sect, Dept, Phn_no, Email]
            );
        if(!data){
            return res.status(404).send({
                success: false,
                message: 'Error In INSERT QUERY'
            });
        }
        res.status(201).send({
            success: true,
            message: 'New Student Record Created',
        })
    } catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Create Studennt API',
            error
        });
    }
};

//update student
const updateStudent = async(req,res) => {
    try{
        const studentId = req.params.id
        if(!studentId){
            return res.status(404).send({
                success: false,
                message:'Invalid ID or provide id'
            })
        }
        const {Sect, Dept, Phn_no, Email} = req.body
        const data = await db.query(`UPDATE students SET Sect = ?, Dept = ?, Phn_no = ?, Email = ? WHERE Id = ?`,[Sect,Dept, Phn_no, Email, studentId ])
        if(!data){
            return res.status(401).send({
                success: false,
                message: 'Error In Update Data'
            })
        }
        res.status(200).send({
            success: true,
            message: "Student Details Updated",
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            message:'Error In Update Student API',
            error
        })
    }
};

const deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        console.log(`Attempting to delete student with ID: ${studentId}`); // Log the student ID
        
        // Validate studentId
        if (!studentId) {
            return res.status(400).send({
                success: false,
                message: 'Please provide a valid student ID'
            });
        }

        // Query the database to check if the student exists
        const checkStudent = await db.query(`SELECT * FROM students WHERE id = ?`, [studentId]);
        if (checkStudent[0].length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No student found with this ID'
            });
        }

        // Proceed to delete the student
        const result = await db.query(`DELETE FROM students WHERE id = ?`, [studentId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'No student found with this ID to delete'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Delete Student API',
            error
        });
    }
};


module.exports = { getStudents, getStudentByID, createStudent, updateStudent, deleteStudent };
