import express from 'express';
const app = express();
app.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);
app.listen(3000, () => console.log(`Express server running on port 3000`));