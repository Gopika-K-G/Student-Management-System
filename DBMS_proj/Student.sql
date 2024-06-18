CREATE TABLE Admins (
    admin_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department VARCHAR(100)
);
insert into admins values('adm1','Admin', 'kecadm', 'kecadmin@kongu.edu', 'Dr.S.Shanthi','Professor', 'CSE');

CREATE TABLE Students (
    student_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    address TEXT,
    phone_number VARCHAR(15),
    department VARCHAR(100),
    year_of_study INT,
    section VARCHAR(10)
);
insert into students values('22CSR057', '22CSR057','kecstud', 'gopikakg.22cse@kongu.edu', 'Gopika','K G', '30-Aug-2004', '4/126, Moolakkarai kadu, Periyeri (Po), Attur(Tk), Salem (Dt)','8610755869', 'CSE', 2, 'A');
insert into students values('22CSR037', '22CSR037','kecstud', 'debehaaj.22cse@kongu.edu', 'Debehaa','J', '27-Sep-2004', '15/120 Ayeepalayam,Athanur(Po),Rasipuram(Tk),Namakkal(Dt)','9842027519', 'CSE', 2, 'A');
insert into students values('22CSR039', '22CSR039','kecstud', 'deepigap.22cse@kongu.edu', 'Deepiga','P', '20-Nov-2004', '112, Agrahara street Bala silks road Near star lodge','6381553551', 'CSE', 2, 'A');
insert into students values('22CSR043', '22CSR043','kecstud', 'dhaaranig.22cse@kongu.edu', 'Dhaarani','G', '15-Oct-2004', '28 Agilmedu 2nd Street Erode','9976831113', 'CSE', 2, 'A');
insert into students values('22CSR044', '22CSR044','kecstud', 'dhamayandhir.22cse@kongu.edu', 'Dhamayandhi','R', '14-Sept-2004', '1/84 Lagampalayam,Kuttagam(PO),vemandampalayam(VIA),Nambiyur(TK)','9344337350', 'CSE', 2, 'A');



CREATE TABLE Courses (
    course_id VARCHAR(50) PRIMARY KEY,
    course_name VARCHAR(100),
    credits INT
);

INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22MAT35', 'Discrete Mathematical Structures', 4,3);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CST31', 'Java Programming', 3,3);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CST32', 'Data Structures', 3,3);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CST33', 'Computer Organization', 3,3);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CSC31', 'Digital Principles and Design', 4,3);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CSC41', 'Python Programming and Frameworks', 4,4);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CST41', 'Database Management Systems', 3,4);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CSC42', 'Web Technology', 3,4);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CST43', 'Operating Systems', 3,4);
INSERT INTO Courses (course_id, course_name, credits,semester) VALUES ('22CST44', 'Design and Analysis of Algorithms', 4,4);

CREATE TABLE StudentMarks (
    student_id VARCHAR(50),
    course_id VARCHAR(50),
    semester INT,
    marks_obtained DECIMAL,
    grade VARCHAR,
    PRIMARY KEY (student_id, course_id),
    CONSTRAINT fk4 FOREIGN KEY (student_id) REFERENCES Students(student_id),
    CONSTRAINT fk5 FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);
CREATE OR REPLACE FUNCTION get_grade(marks DECIMAL)
RETURNS VARCHAR AS $$
BEGIN
    IF marks >= 95 THEN
        RETURN 'O';
    ELSIF marks >= 85 THEN
        RETURN 'A+';
    ELSIF marks >= 75 THEN
        RETURN 'A';
    ELSIF marks >= 65 THEN
        RETURN 'B+';
    ELSIF marks >= 60 THEN
        RETURN 'B';
    ELSIF marks >= 50 THEN
        RETURN 'C';
    ELSE
        RETURN 'U';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert values for each student, course, and semester
INSERT INTO StudentMarks (student_id, course_id, semester, marks_obtained, grade) VALUES
('22CSR024', '22MAT35', 3, 85, get_grade(85)),
('22CSR024', '22CST31', 3, 78, get_grade(78)),
('22CSR024', '22CST32', 3, 65, get_grade(65)),
('22CSR024', '22CST33', 3, 92, get_grade(92)),
('22CSR024', '22CSC31', 3, 55, get_grade(55)),
('22CSR024', '22CSC41', 4, 48, get_grade(48)),
('22CSR024', '22CST41', 4, 88, get_grade(88)),
('22CSR024', '22CSC42', 4, 76, get_grade(76)),
('22CSR024', '22CST43', 4, 84, get_grade(84)),
('22CSR024', '22CST44', 4, 95, get_grade(95)),

('22CSR026', '22MAT35', 3, 67, get_grade(67)),
('22CSR026', '22CST31', 3, 89, get_grade(89)),
('22CSR026', '22CST32', 3, 54, get_grade(54)),
('22CSR026', '22CST33', 3, 73, get_grade(73)),
('22CSR026', '22CSC31', 3, 91, get_grade(91)),
('22CSR026', '22CSC41', 4, 82, get_grade(82)),
('22CSR026', '22CST41', 4, 77, get_grade(77)),
('22CSR026', '22CSC42', 4, 66, get_grade(66)),
('22CSR026', '22CST43', 4, 58, get_grade(58)),
('22CSR026', '22CST44', 4, 49, get_grade(49)),

('22CSR037', '22MAT35', 3, 59, get_grade(59)),
('22CSR037', '22CST31', 3, 68, get_grade(68)),
('22CSR037', '22CST32', 3, 73, get_grade(73)),
('22CSR037', '22CST33', 3, 84, get_grade(84)),
('22CSR037', '22CSC31', 3, 77, get_grade(77)),
('22CSR037', '22CSC41', 4, 86, get_grade(86)),
('22CSR037', '22CST41', 4, 64, get_grade(64)),
('22CSR037', '22CSC42', 4, 72, get_grade(72)),
('22CSR037', '22CST43', 4, 53, get_grade(53)),
('22CSR037', '22CST44', 4, 91, get_grade(91)),

('22CSR039', '22MAT35', 3, 71, get_grade(71)),
('22CSR039', '22CST31', 3, 49, get_grade(49)),
('22CSR039', '22CST32', 3, 85, get_grade(85)),
('22CSR039', '22CST33', 3, 79, get_grade(79)),
('22CSR039', '22CSC31', 3, 90, get_grade(90)),
('22CSR039', '22CSC41', 4, 68, get_grade(68)),
('22CSR039', '22CST41', 4, 82, get_grade(82)),
('22CSR039', '22CSC42', 4, 75, get_grade(75)),
('22CSR039', '22CST43', 4, 88, get_grade(88)),
('22CSR039', '22CST44', 4, 92, get_grade(92)),

('22CSR043', '22MAT35', 3, 60, get_grade(60)),
('22CSR043', '22CST31', 3, 78, get_grade(78)),
('22CSR043', '22CST32', 3, 84, get_grade(84)),
('22CSR043', '22CST33', 3, 91, get_grade(91)),
('22CSR043', '22CSC31', 3, 57, get_grade(57)),
('22CSR043', '22CSC41', 4, 89, get_grade(89)),
('22CSR043', '22CST41', 4, 72, get_grade(72)),
('22CSR043', '22CSC42', 4, 66, get_grade(66)),
('22CSR043', '22CST43', 4, 78, get_grade(78)),
('22CSR043', '22CST44', 4, 85, get_grade(85)),

('22CSR044', '22MAT35', 3, 88, get_grade(88)),
('22CSR044', '22CST31', 3, 74, get_grade(74)),
('22CSR044', '22CST32', 3, 64, get_grade(64)),
('22CSR044', '22CST33', 3, 79, get_grade(79)),
('22CSR044', '22CSC31', 3, 91, get_grade(91)),
('22CSR044', '22CSC41', 4, 87, get_grade(87)),
('22CSR044', '22CST41', 4, 76, get_grade(76)),
('22CSR044', '22CSC42', 4, 55, get_grade(55)),
('22CSR044', '22CST43', 4, 63, get_grade(63)),
('22CSR044', '22CST44', 4, 91, get_grade(91)),

('22CSR057', '22MAT35', 3, 73, get_grade(73)),
('22CSR057', '22CST31', 3, 82, get_grade(82)),
('22CSR057', '22CST32', 3, 92, get_grade(92)),
('22CSR057', '22CST33', 3, 68, get_grade(68)),
('22CSR057', '22CSC31', 3, 59, get_grade(59)),
('22CSR057', '22CSC41', 4, 75, get_grade(75)),
('22CSR057', '22CST41', 4, 78, get_grade(78)),
('22CSR057', '22CSC42', 4, 86, get_grade(86)),
('22CSR057', '22CST43', 4, 79, get_grade(79)),
('22CSR057', '22CST44', 4, 93, get_grade(93));

CREATE TABLE Results (
    student_id VARCHAR(50),
    semester INT,
    gpa DECIMAL,
    cgpa DECIMAL,
    PRIMARY KEY (student_id, semester),
    CONSTRAINT fk6 FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

select * from students;


CREATE TABLE Department (
    department_id VARCHAR(50) PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Staff (
    staff_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department_id VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    constraint fk1 FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE Staff_Courses (
    staff_id VARCHAR(50),
    course_id VARCHAR(50),
    course_year INT,
    course_section VARCHAR(10),
    PRIMARY KEY (staff_id, course_id),
    constraint fk2 FOREIGN KEY (staff_id) REFERENCES Staff(staff_id),
    constraint fk3 FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);






drop table department;

select * from students;


select * from courses;
select * from StudentMarks;
select * from students;
ALTER TABLE StudentMarks DROP CONSTRAINT fk4;
ALTER TABLE StudentMarks ADD CONSTRAINT fk4 FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE;
ALTER TABLE Results DROP CONSTRAINT fk6;
ALTER TABLE Results ADD CONSTRAINT fk6 FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE;

ALTER TABLE Courses ADD COLUMN semester INT;
truncate table courses;

ALTER TABLE StudentMarks
DROP CONSTRAINT fk5;

ALTER TABLE StudentMarks ADD CONSTRAINT fk5 FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE ON UPDATE CASCADE;
truncate table courses;
