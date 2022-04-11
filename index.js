const express = require('express');
const morgan = require('morgan');
var helmet = require('helmet');
const authRouter = require('./routes/authRouter');
require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`🚀 Server ready at http://localhost:${port}`));
