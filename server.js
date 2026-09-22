import express from 'express';
import connectDatabase from './config/db.js';
import { check, validationResult} from 'express-validator';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//
dotenv.config();
const app = express();
connectDatabase();
//
app.use(express.json({ extended: false}));
//
app.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);
//Register Users
app.post('/api/users', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6+ characters').isLength({ min: 6})
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            //check to see if user exists
            let user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                return res.status(400).json({
                    errors: [{ msg: 'User with this email already exists' }]
                });
            }
            //Create user object
            user = new User({
                name,
                email: email.toLowerCase(),
                password
            });
            //hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            //save to database
            await user.save();
            //create payload for JWT
            const payload = {
                user: {
                    id: user.id
                }
            };
            //generate JWT token
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h'},
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        msg: 'User registered successfully',
                        token
                    });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
);
//Login Code
app.post('/api/auth', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            //see if user exists
            let user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(400).json({
                    errors: [{ msg: 'Invalid credentials' }]
                });
            }

            //verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: 'Invalid credentials' }]
                });
            }

            //create payload for JWT
            const payload = {
                user: {
                    id: user.id
                }
            };

            //generate JWT token
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        msg: 'User logged in successfully',
                        token
                    });
                }
            );

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server error');
        }
    }
);
//Connection Listener
app.listen(3000, () => console.log(`Express server running on port 3000`));
