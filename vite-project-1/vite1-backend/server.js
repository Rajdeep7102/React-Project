
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Users = require('./UserDataModel')
const Blogs = require('./BlogDataModel')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "Interstellar"
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

app.use(bodyParser.json({limit:'10mb'}))
app.use(bodyParser.urlencoded({extended:true,limit:'10mb'}))

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
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create a new user
  const newUser = new Users({ username,password: hashedPassword,email });
  const data = {
        newUser:{
          id : req.body._id,
      }
  }
  const authToken =  jwt.sign(data,JWT_SECRET)
  res.json({authToken})
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
  const user = await Users.findOne({username},{password});
  console.log(user)
  if (!user) {
    res.status(401).json({ message: 'Invalid username or password' });
    
  } 

  const isPasswordMatch =  bcrypt.compare(password,user.password);
  if(isPasswordMatch){
    const data = {
      newUser:{
        id: user._id,
      }
    };
    const authToken = jwt.sign(data,JWT_SECRET);
    res.json({authToken});
  }else{
    res.status(401).json({message:'Invalid username or password'})
  }
});




// Submit Posts
app.post('/blogs',async(req,res)=>{
  const {Author,Time,Heading,Content,Summary,Category} = req.body;
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
    const topBlogs = await Blogs.find().limit(4).sort({ Views: -1 }); // adjust your query accordingly
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

// Modify your server.js or backend file
app.put('/api/increment-views/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    // Find the blog post by ID and increment the views
    const result = await Blogs.findByIdAndUpdate(postId, { $inc: { Views: 1 } });

    if (result) {
      res.status(204).end(); // Success, no content to send
    } else {
      res.status(404).json({ error: 'Blog post not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Root endpoint
// app.get('/', (req, res) => {
//   res.send('Hello, World!');

// Handle fetching a specific blog post
app.get('/editblog/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const blogPost = await Blogs.findById(postId);

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.setHeader('Content-Type', 'application/json');

    console.log(blogPost);
    res.json(blogPost);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle updating a specific blog post
app.put('/editblog/:id',(req, res) => {
  console.log(req.body)
  const postId = req.params.postId;

  const { Author, Time, Heading, Content, Summary, Category } = req.body;
  // Update the blog post in the database using postId and the received data
  // Example: Replace the following line with your database update query
  updateBlogPost(postId, { Author, Time, Heading, Content, Summary, Category });

  res.status(200).send('Blog post updated successfully');
});


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