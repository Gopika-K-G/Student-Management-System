const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 4000;

// PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Student_management',
    password: 'Gopi@sql08',
    port: 5432,
});
app.use(session({
    secret: 'gopi@08', // Change this to a random string
    resave: false,
    saveUninitialized: true,
}));
// Middleware
app.use(bodyParser.urlencoded({ extended: false })); // Use body-parser to parse URL-encoded form data
app.use(bodyParser.json());

// Middleware to check admin session
function isAdminLoggedIn(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

function isStudentLoggedIn(req, res, next) {
    if (req.session && req.session.student) {
        req.studentUsername = req.session.student; // Store student's username in request object
        return next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

app.get('/api/getStudentName', isStudentLoggedIn, async (req, res) => {
    const studentUsername = req.studentUsername;
    if (!studentUsername) {
        return res.status(400).json({ error: 'No student username found in session' });
    }
    console.log('Fetching name for:', studentUsername);
    try {
        const result = await pool.query('SELECT first_name, last_name FROM students WHERE username = $1', [studentUsername]);
        if (result.rows.length > 0) {
            const { first_name, last_name } = result.rows[0];
            res.json({ fullName: `${first_name} ${last_name}` });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student name', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'studhome.html'));
});

// Route for admin login form
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin_login.html'));
});

// Route for student login form
app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'student_login.html'));
});

// Route to handle admin login
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Admin login attempt:', { username, password }); // Log received data
    try {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1 AND password = $2', [username, password]);
        console.log('Query result:', result.rows); // Log query result
        if (result.rows.length > 0) {
            req.session.admin = username;
            res.redirect('/admin/dashboard'); // Redirect to admin dashboard
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle student login
app.post('/student/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Student login attempt:', { username, password }); // Log received data
    try {
        const result = await pool.query('SELECT * FROM students WHERE username = $1 AND password = $2', [username, password]);
        console.log('Query result:', result.rows); // Log query result
        if (result.rows.length > 0) {
            req.session.student = username;
            res.redirect('/student/dashboard'); // Redirect to student dashboard
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal server error');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

// Example dashboard routes
app.get('/admin/dashboard', isAdminLoggedIn,(req, res) => {
    res.sendFile(path.join(__dirname, 'admin_home.html'));
});

app.get('/student/dashboard', isStudentLoggedIn,(req, res) => {
    res.sendFile(path.join(__dirname, 'student_home.html'));
});

app.get('/admin/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students ORDER BY student_id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching students data', error);
        res.status(500).send('Internal server error');
    }
});

// Route to serve view_students.html
app.get('/view_students', (req, res) => {
    res.sendFile(path.join(__dirname, 'view_students.html'));
});


app.get('/admin/add_stu', (req, res) => {
    res.sendFile(path.join(__dirname, 'add_student.html'));
});

app.post('/admin/add-student', async (req, res) => {
    const { rollNo, username, password, email, firstName, lastName, dateOfBirth, address, phoneNumber, department, yearOfStudy, section } = req.body;

    try {
        // Insert the new student into the database
        await pool.query('INSERT INTO students (student_id, username, password, email, first_name, last_name, date_of_birth, address, phone_number, department, year_of_study, section) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', 
        [rollNo, username, password, email, firstName, lastName, dateOfBirth, address, phoneNumber, department, yearOfStudy, section]);

        // Send a success response
        res.status(200).send('Student added successfully');
    } catch (error) {
        console.error('Error adding student', error);
        res.status(500).send('Internal server error');
    }
});

// Route to serve update_student.html
app.get('/admin/update_stu', (req, res) => {
    res.sendFile(path.join(__dirname, 'update_student.html'));
});

// Route to fetch student details
app.get('/admin/student/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student data', error);
        res.status(500).send('Internal server error');
    }
});

// Route to handle updating student details
app.post('/admin/update-student/:id', async (req, res) => {
    const studentId = req.params.id;
    const { username, password, email, firstName, lastName, dateOfBirth, address, phoneNumber, department, yearOfStudy, section } = req.body;

    try {
        // Update the student details in the database
        await pool.query('UPDATE students SET username = $1, password = $2, email = $3, first_name = $4, last_name = $5, date_of_birth = $6, address = $7, phone_number = $8, department = $9, year_of_study = $10, section = $11 WHERE student_id = $12', 
        [username, password, email, firstName, lastName, dateOfBirth, address, phoneNumber, department, yearOfStudy, section, studentId]);

        // Send a success response
        res.status(200).send('Student updated successfully');
    } catch (error) {
        console.error('Error updating student', error);
        res.status(500).send('Internal server error');
    }
});
// Route to serve delete_student.html
app.get('/admin/delete_stu', (req, res) => {
    res.sendFile(path.join(__dirname, 'delete_student.html'));
});

// Route to handle deleting a student
app.delete('/admin/delete-student/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        // Delete the student from the database
        await pool.query('DELETE FROM students WHERE student_id = $1', [studentId]);

        // Send a success response
        res.status(200).send('Student deleted successfully');
    } catch (error) {
        console.error('Error deleting student', error);
        res.status(500).send('Internal server error');
    }
});
// Route to serve view_marks.html
app.get('/view_marks', (req, res) => {
    res.sendFile(path.join(__dirname, 'view_marks.html'));
});

app.get('/admin/view-marks', async (req, res) => {
    const semester = parseInt(req.query.semester);

    try {
        // Fetch courses that have marks for the specified semester
        const coursesResult = await pool.query(`
            SELECT DISTINCT c.course_id, c.course_name
            FROM courses c
            JOIN studentmarks sm ON c.course_id = sm.course_id AND sm.semester = $1
            ORDER BY c.course_id
        `, [semester]);

        // Fetch marks for students for the specified semester and courses
        const marksResult = await pool.query(`
            SELECT s.student_id, s.first_name, s.last_name, c.course_id, sm.marks_obtained, sm.grade
            FROM students s
            JOIN studentmarks sm ON s.student_id = sm.student_id AND sm.semester = $1
            JOIN courses c ON c.course_id = sm.course_id
            ORDER BY s.student_id, c.course_id
        `, [semester]);

        const courses = coursesResult.rows;
        const marks = {};

        marksResult.rows.forEach(row => {
            if (!marks[row.student_id]) {
                marks[row.student_id] = {
                    student_id: row.student_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    marks: []
                };
            }
            marks[row.student_id].marks.push({
                course_id: row.course_id,
                marks_obtained: row.marks_obtained || '', // Handle null marks if any
                grade: row.grade || '' // Handle null grade if any
            });
        });

        res.json({
            courses,
            marks: Object.values(marks)
        });
    } catch (error) {
        console.error('Error fetching marks', error);
        res.status(500).send('Internal server error');
    }
});
app.get('/view_report', (req, res) => {
    res.sendFile(path.join(__dirname, 'view_report.html'));
});
app.get('/student/gpa-cgpa/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const coursesQuery = `
            SELECT c.course_id, c.credits, sm.semester, sm.grade
            FROM Courses c
            JOIN StudentMarks sm ON c.course_id = sm.course_id
            WHERE sm.student_id = $1
            ORDER BY sm.semester, c.course_id
        `;
        const result = await pool.query(coursesQuery, [studentId]);

        const semesters = {};

        result.rows.forEach(row => {
            const { semester, credits, grade } = row;
            if (!semesters[semester]) {
                semesters[semester] = [];
            }
            semesters[semester].push({ credits, grade });
        });

        const calculateGradePoints = (grade) => {
            switch (grade.toUpperCase()) {
                case 'O': return 10;
                case 'A+': return 9;
                case 'A': return 8;
                case 'B+': return 7;
                case 'B': return 6;
                case 'C': return 5;
                case 'U': return 0;
                case 'SC': return 0;
                default: return 0;
            }
        };

        const calculateGPA = (courses) => {
            let totalCredits = 0;
            let totalWeightedPoints = 0;
            courses.forEach(course => {
                const gradePoints = calculateGradePoints(course.grade);
                totalCredits += course.credits;
                totalWeightedPoints += course.credits * gradePoints;
            });
            return totalCredits === 0 ? 0 : totalWeightedPoints / totalCredits;
        };

        const calculateCGPA = (semesters) => {
            let totalCredits = 0;
            let totalWeightedPoints = 0;
            Object.values(semesters).forEach(courses => {
                courses.forEach(course => {
                    const gradePoints = calculateGradePoints(course.grade);
                    totalCredits += course.credits;
                    totalWeightedPoints += course.credits * gradePoints;
                });
            });
            return totalCredits === 0 ? 0 : totalWeightedPoints / totalCredits;
        };

        const gpas = Object.keys(semesters).map(semester => ({
            semester: semester,
            gpa: calculateGPA(semesters[semester]).toFixed(2)
        }));

        const cgpa = calculateCGPA(semesters).toFixed(2);

        res.json({ gpas, cgpa });
    } catch (error) {
        console.error('Error calculating GPA/CGPA', error);
        res.status(500).send('Internal server error');
    }
});
// API Endpoint to save results
app.post('/api/saveResults', (req, res) => {
    const { studentId, gpaResults, cgpa } = req.body;

    // Insert GPA results for each semester
    gpaResults.forEach(result => {
        const { semester, gpa } = result;
        const sql = `INSERT INTO Results (student_id, semester, gpa, cgpa) VALUES (?, ?, ?, ?)`;
        const values = [studentId, semester, gpa, cgpa];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error inserting GPA result:', err);
                res.status(500).json({ success: false });
                return;
            }
            console.log(`Inserted GPA result for semester ${semester}`);
        });
    });

    // Send response
    res.json({ success: true });
});
app.get('/view_profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'view_profile.html'));
});

app.get('/api/getStudentProfile', isStudentLoggedIn, async (req, res) => {
    const studentUsername = req.studentUsername;
    if (!studentUsername) {
        return res.status(400).json({ error: 'No student username found in session' });
    }
    try {
        const result = await pool.query('SELECT * FROM students WHERE username = $1', [studentUsername]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student profile', error);
        res.status(500).send('Internal server error');
    }
});
// Update Student Profile (/api/updateStudentProfile/:studentId)
app.post('/api/updateStudentProfile/:studentId', isStudentLoggedIn, async (req, res) => {
    const studentId = req.params.studentId;
    const { username, password, email, firstName, lastName, dateOfBirth, address, phoneNumber, department, yearOfStudy, section } = req.body;

    try {
        await pool.query('UPDATE students SET username = $1, password = $2, email = $3, first_name = $4, last_name = $5, date_of_birth = $6, address = $7, phone_number = $8, department = $9, year_of_study = $10, section = $11 WHERE student_id = $12', 
        [username, password, email, firstName, lastName, dateOfBirth, address, phoneNumber, department, yearOfStudy, section, studentId]);
        res.status(200).send('Student updated successfully');
    } catch (error) {
        console.error('Error updating student', error);
        res.status(500).send('Internal server error');
    }
});
app.get('/view_semres', (req, res) => {
    res.sendFile(path.join(__dirname, 'view_semres.html'));
});
// Route to fetch student profile
app.get('/api/getStudentId', isStudentLoggedIn, async (req, res) => {
    const studentUsername = req.studentUsername;
    if (!studentUsername) {
        return res.status(400).json({ error: 'No student username found in session' });
    }
    try {
        const result = await pool.query('SELECT student_id FROM students WHERE username = $1', [studentUsername]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student profile', error);
        res.status(500).send('Internal server error');
    }
});
app.get('/api/getMarks', async (req, res) => {
    const studentId = req.query.student_id;
    const semester = parseInt(req.query.semester);

    if (!studentId || !semester) {
        return res.status(400).json({ error: 'Missing student ID or semester parameter' });
    }

    try {
        // Fetch courses that have marks for the specified semester for a given student
        const coursesResult = await pool.query(`
            SELECT DISTINCT c.course_id, c.course_name
            FROM courses c
            JOIN studentmarks sm ON c.course_id = sm.course_id AND sm.semester = $1 AND sm.student_id = $2
            ORDER BY c.course_id
        `, [semester, studentId]);

        // Fetch marks for the specified semester and student
        const marksResult = await pool.query(`
            SELECT c.course_id, sm.marks_obtained, sm.grade
            FROM courses c
            JOIN studentmarks sm ON c.course_id = sm.course_id AND sm.semester = $1 AND sm.student_id = $2
            ORDER BY c.course_id
        `, [semester, studentId]);

        const courses = coursesResult.rows;
        const marks = marksResult.rows;

        res.json({ courses, marks });
    } catch (error) {
        console.error('Error fetching marks', error);
        res.status(500).send('Internal server error');
    }
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
