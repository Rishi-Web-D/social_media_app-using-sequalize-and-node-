const bcrypt = require('bcrypt');
const { User } = require('../models'); 
const { Post } = require('../models');
const { Sequelize } = require('sequelize');


exports.renderDashboard = async (req, res) => {  
  try {
    const posts = await Post.findAll({
      where : {visibility : 'all'},
      include: [{ model: User, attributes: [] }],
      attributes: {
        include: [[Sequelize.col('User.name'), 'userName']],
      },
      raw: true,
    });
    // console.log(JSON.stringify(posts, null, 2));

    res.render('users/dashboard', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.upload_post = async (req, res) => {  
  try {
    res.render('posts/postForm', {post : null});
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.showRegisterForm =  (req, res) => {
  res.render('users/register'); 
}

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('User already exists with this email.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name : firstName + ' ' + lastName,
      email,
      password: hashedPassword,
    });

    res.redirect('/'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
}

exports.showLoginForm = (req, res) => {
  res.render('users/login'); 
}


exports.loginUser= async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password.');
    }

    // res.send(`Welcome, ${user.name}! You are now logged in.`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in user');
  }
}


exports.myPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { user_id: 1 },
      include: [{ model: User, attributes: [] }],
      attributes: {
        include: [[Sequelize.col('User.name'), 'userName']],
      },
      raw: true,
    });

    res.render('users/my-posts', { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(1);
    res.render('users/userProfile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}