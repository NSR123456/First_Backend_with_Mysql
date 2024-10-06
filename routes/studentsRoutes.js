const express = require('express')
const { getStudents, getStudentByID, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController')
//const { deleteStudent } = require('./controllers/studentController');
//router object
const router = express.Router()
//routes

//get all students list
router.get('/getall',getStudents); //done basic route setup

//get student by id
router.get('/get/:id', getStudentByID );

//create student || post
router.post('/create',createStudent );

//update student
router.put('/update/:id', updateStudent);

//dele student
router.delete('/delete/:id', deleteStudent);

module.exports = router