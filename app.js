const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.locals.BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; 
  next();
});

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/', userRoutes);
app.use('/posts', postRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
