
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Users = require('./UserDataModel')
const Blogs = require('./BlogDataModel')

const multer = require('multer')

// const uploadMiddleware = multer({dest : 'uploads/'});

// import('@xenova/transformers').then((transformersModule) => {
//   const { pipeline } = transformersModule;
//   // Now you can use pipeline
// });


// import {promisify} from 'util';
// import { T5Tokenizer,T5ForConditionalGeneration } from '@xenova/transformers';
// const { createSummarizer } = require('./summarizer'); 


const app = express();
const port = 8000;
const cors = require('cors');
const { pipeline } = require('stream');

// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB URI)
mongoose.connect('mongodb://localhost:27017/registerdata', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // Enable credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));
app.use(multer().none())

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { username, password,email } = req.body;
  console.log(req.body)
  // Check if the username already exists
  const existingUser = await Users.findOne({ username });

  if (existingUser) {
    // Username is already taken
    return res.status(400).json({ message: 'Username is already taken' });
  }

  // Create a new user
  const newUser = new Users({ username, password,email });

  try {
    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match a user in the database
  const user = await Users.findOne({ username, password });

  if (user) {
    // Successful login
    res.status(200).json({ message: 'Login successful' });
  } else {
    // Invalid credentials
    res.status(401).json({ message: 'Invalid username or password' });
  }
});




// Submit Posts
app.post('/blogs',async(req,res)=>{


  const {Author,Time,Heading,Content,Summary,Category} = req.body;
  console.log(req.body)
  // const filePath = req.file ? req.file.path : null; 
  const newBlog = new Blogs({Author,Time,Heading,Content,Summary,Category}) // Might want to include file also.

  try {
    await newBlog.save();
    res.status(201).json({message:'Blog submitted successfully'});
  }
  catch (error){
    console.error('Error while submitting blog: ',error);
    res.status(500).json({message:'Internal server Error'})
  }
});

// Route to fetch top 4 blogs
app.get('/top-blogs', async (req, res) => {
  try {
    const topBlogs = await Blogs.find().limit(4).sort({ createdAt: -1 }); // adjust your query accordingly
    console.log("top blogs",topBlogs);
    res.json(topBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/blogdata/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    // Find the blog post by its ID and remove it from the database
    const deletedPost = await Blogs.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully', deletedPost });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Root endpoint
// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.get('/blogdata',async (req,res) =>{
  res.json(await Blogs.find());
})

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});




// const summarizer = createSummarizer();

// app.post('/summarize',async (req,res)=>{
//   const text = req.body.text;
//   try{
//     const summarizedText = await summarizer.summarize(text);
//     res.json({summary : summarizedText});
//   }catch (error){
//     console.error('Error summarizing text:',error);
//     res.status(500).json({error:'Internal server error'});
//   }
// });