const express = require('express');
const morgan = require('morgan');
var helmet = require('helmet');
const authRouter = require('./routes/authRouter');
const itemRouter = require('./routes/itemRouter');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/item', itemRouter);

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`🚀 Server ready at http://localhost:${port}`));
