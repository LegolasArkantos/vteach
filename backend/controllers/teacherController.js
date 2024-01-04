const Session = require('../models/session');
const Teacher = require('../models/teacher');
const User = require('../models/user');
const Student = require('../models/student');

const getTeacherName = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        const teacher = await Teacher.findOne({ user: teacherId }).populate('user');
        console.log(teacherId)
        console.log( teacher)
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        const { firstName, lastName } = teacher.user;
        const fullName = `${firstName} ${lastName}`;

        res.json({ fullName });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getTeacherProfile = async (req, res) => {
    try {
        const { teacherId } = req.params;

        // Find the teacher by ID and populate the 'user' and 'sessions' fields
        const teacher = await Teacher.findById(teacherId).populate('user').populate('sessions');

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Organize the teacher data
        const teacherData = {
            // User information
            user: {
                firstName: teacher.user.firstName,
                lastName: teacher.user.lastName,
                email: teacher.user.email,
                contactInformation: teacher.user.contactInformation,
                profilePicture: teacher.user.profilePicture,
            },
            // Teacher-specific details
            educationalCredentials: teacher.educationalCredentials,
            subjectsTaught: teacher.subjectsTaught,
            availableTimeSlots: teacher.availableTimeSlots,
            // Sessions details
            sessions: teacher.sessions.map(session => ({
                startTime: session.startTime,
                endTime: session.endTime,
                status: session.status,
                paymentStatus: session.paymentStatus,
                subject: session.subject,
                sessionPrice: session.sessionPrice
            }))
        };

        // Respond with the organized teacher data
        res.status(200).json({ teacher: teacherData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};






const getMyStudents = async (req, res) => {
    try {
      const { teacherId } = req.params;
  
      // Find the teacher
      const teacher = await Teacher.findById(teacherId);
  
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      // Find sessions for the teacher
      const sessions = await Session.find({ teacher: teacherId });
  
      const studentsData = [];
  
      // Loop through sessions
      for (const session of sessions) {
        const sessionData = {
          sessionId :session.id,
          subject: session.subject,
          startTime: session.startTime,
          endTime: session.endTime,
          paymentStatus:session.paymentStatus,
          status:session.status,
          sessionPrice:session.sessionPrice,
          students: [],
        };
  
        // Loop through students of the session
        for (const studentId of session.students) {
          const student = await Student.findById(studentId).populate('user', ['firstName', 'lastName', 'email', 'profilePicture', 'contactInformation']);
  
          if (student) {
            sessionData.students.push({
              studentId: student.id,
              firstName: student.user.firstName,
              lastName: student.user.lastName,
              email: student.user.email,
              profilePicture: student.user.profilePicture,
              contactInformation: student.user.contactInformation,
            });
          }
        }
  
        studentsData.push(sessionData);
      }
  
      res.status(200).json({ studentsData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const updateProfile = async (req, res) => {
    try {
      const { teacherId } = req.params;
      const { educationalCredentials, subjectsTaught, availableTimeSlots, firstName, lastName, profilePicture, contactInformation } = req.body;
  
      // Find the teacher
      const teacher = await Teacher.findById(teacherId);
  
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      // Update teacher profile
      teacher.educationalCredentials = educationalCredentials || teacher.educationalCredentials;
      teacher.subjectsTaught = subjectsTaught || teacher.subjectsTaught;
      teacher.availableTimeSlots = availableTimeSlots || teacher.availableTimeSlots;
  
      // Update user information
      const user = await User.findById(teacher.user);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.profilePicture = profilePicture || user.profilePicture;
      user.contactInformation = contactInformation || user.contactInformation;
  
      await teacher.save();
      await user.save();
  
      res.status(200).json({ message: 'Teacher profile and user information updated successfully', teacher, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  const getSpecificSessionAndStudents = async (req, res) => {
    try {
        const { teacherId, sessionId } = req.params;

        // Find the teacher
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Find the session
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Check if the session belongs to the teacher
        if (session.teacher.toString() !== teacherId) {
            return res.status(403).json({ message: 'You are not authorized to view this session' });
        }

        const sessionData = {
            subject: session.subject,
            startTime: session.startTime,
            endTime: session.endTime,
            students: [],
        };

        // Loop through students of the session
        for (const studentId of session.students) {
            const student = await Student.findById(studentId).populate('user', ['firstName', 'lastName', 'email', 'profilePicture', 'contactInformation']);

            if (student) {
                sessionData.students.push({
                    firstName: student.user.firstName,
                    lastName: student.user.lastName,
                    email: student.user.email,
                    profilePicture: student.user.profilePicture,
                    contactInformation: student.user.contactInformation,
                });
            }
        }

        res.status(200).json({ sessionData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    getTeacherName,
    getTeacherProfile,
    getMyStudents,
    updateProfile,
    getSpecificSessionAndStudents,
};
