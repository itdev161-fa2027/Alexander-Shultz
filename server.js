import express from 'express';
import connectDatabase from './config/db.js';
import { check, validationResult} from 'express-validator';
const app = express();
connectDatabase();
//
app.use(express.json({ extended: false}));
//
app.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);
//
app.post('/api/users', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6+ characters').isLength({ min: 6})
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            //database code soon
            return res.send(req.body);
        }
    }
);
//
app.listen(3000, () => console.log(`Express server running on port 3000`));
