const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Teacher = require('../models/teacher');
const Student = require('../models/student');







// Generate JWT Token
const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check password format (at least 8 characters, containing letters and numbers)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Invalid password format' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password: hashedPassword, role });

        let profile;

        if (role === 'teacher') {
            const { educationalCredentials } = req.body;
            profile = await Teacher.create({ user: user._id, educationalCredentials });
        } else if (role === 'student') {
            const { educationalLevel, subjectsOfInterest } = req.body;
            profile = await Student.create({ user: user._id, educationalLevel, subjectsOfInterest });
        }

        const tokens = generateToken(user._id);
    
        res.json(tokens);
    } catch (error) {
        console.error(error);

        // Check for duplicate email error (code 11000)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { accessToken, refreshToken } = generateToken(user._id);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true ,sameSite : 'lax'});
        const response = {
            accessToken,
            refreshToken,
            role: user.role,
        };

        if (user.role === 'teacher') {
            const teacher = await Teacher.findOne({ user: user._id });
            if (teacher) {
                response.teacherId = teacher._id;
            }
        } else if (user.role === 'student') {
            const student = await Student.findOne({ user: user._id });
            if (student) {
                response.studentId = student._id;
            }
        }

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const refreshTokens = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        let response = { accessToken: null };

        try {
            
            const userDetails = await User.findOne({ _id: user.userId });

            if (!userDetails) {
                return res.status(404).json({ message: 'User not found' });
            }

            response.role = userDetails.role;

            if (userDetails.role === 'teacher') {
                const teacher = await Teacher.findOne({ user: userDetails._id });
                if (teacher) {
                    response.teacherId = teacher._id;
                }
            } else if (userDetails.role === 'student') {
                const student = await Student.findOne({ user: userDetails._id });
                if (student) {
                    response.studentId = student._id;
                }
            }

            const accessToken = jwt.sign({ userId: userDetails._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
            response.accessToken = accessToken;

            res.json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
};



module.exports = {
    signup,
    login,
    refreshTokens,
};
