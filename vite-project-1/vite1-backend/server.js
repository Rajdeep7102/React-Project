
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Users = require('./UserDataModel')
const Blogs = require('./BlogDataModel')
const UserHistory = require('./UserHistory')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const db = require('./keys').mongoURL;
const JWT_SECRET = "Interstellar"


const app = express();
const port = 8000;
const cors = require('cors');
const { AsyncLocalStorage } = require('async_hooks');

app.use(bodyParser.json({limit:'10mb'}))
app.use(bodyParser.urlencoded({extended:true,limit:'10mb'}))

// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB URI)
mongoose.connect('mongodb+srv://rajdeep:rajdeep2017@omnispectra.j3xzuo0.mongodb.net/OmniSpectra?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017/registerdata', { useNewUrlParser: true, useUnifiedTopology: true });
 
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
  // console.log(req.body) 
  // Check if the username already exists
  const existingUser = await Users.findOne({ username });
  // console.log
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
  // const authToken =  jwt.sign(data,JWT_SECRET)
  // res.json({authToken})
  try {
    // Save the new user to the database
    await newUser.save();
    
    const data = {
      newUser: {
        id: req.body._id,
      }
    };
  
    const authToken = jwt.sign(data, JWT_SECRET);
    res.status(201).json({ message: 'Registration successful', authToken });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Check if the username and password match a user in the database
 try {
  const user = await Users.findOne({username});
  if(!user) {
    return res.status(401).json({message:'Invalid username'});
  }

  const isPasswordMatch =  await bcrypt.compare(password,user.password);

  if(isPasswordMatch){
    const data = {
      newUser:{
        id:user._id,
      }
    };

    const authToken = jwt.sign(data,JWT_SECRET);
    res.json({authToken});
  }else{
    res.status(401).json({message:'Invalid password'})
  }
 } catch(error){
  console.error(error);
  res.status(500).json({error:'Internal Server Error'});
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



app.put('/api/increment-views/:postId', async (req, res) => {
  const postId = req.params.postId;
  const loggedInUsername = req.body.loggedInUsername;

  try {
    if (loggedInUsername) {
      const result = await Blogs.findByIdAndUpdate(postId, { $inc: { Views: 1 } });
      // console.log("This is the result",result)
      if (result) {
        let userHistory = await UserHistory.findOne({ userId: loggedInUsername });
        // console.log("This is userHistory:",userHistory)
        const blogData = await Blogs.findById(postId, { Heading: 1, Category: 1 });

        if (!userHistory) {
          userHistory = await UserHistory.create({
            userId: loggedInUsername,
            viewedBlogs: [{
              blogId: postId,
              heading: blogData.Heading,
              categories: [blogData.Category],
              viewCount: 1
            }]
          });
          return res.status(204).end();
        } 
          console.log("this is post Id",postId)
          const blogIndex = userHistory.viewedBlogs.findIndex(blog => blog.blogId && blog.blogId.toString() === postId);
          // console.log("raw blogIndex",blogIndex)
          if (blogIndex === -1) {
            // If postId doesn't exist in viewedBlogs, add a new post with views initialized to 1
            userHistory.viewedBlogs.push({
              blogId: postId,
              heading: blogData.Heading,
              categories: [blogData.Category],
              viewCount: 1
            });

            // Update the user history collection with the modified document
            await UserHistory.updateOne(
              { userId: loggedInUsername },
              { $push: { viewedBlogs: userHistory.viewedBlogs[userHistory.viewedBlogs.length - 1] } }
            );
          } else {
            // If postId exists, increment its views
            userHistory.viewedBlogs[blogIndex].viewCount += 1;
            await UserHistory.updateOne(
              { userId: loggedInUsername, 'viewedBlogs.blogId': postId },
              {
                $set: {
                  'viewedBlogs.$.heading': blogData.Heading,
                  'viewedBlogs.$.categories': [blogData.Category],
                  'viewedBlogs.$.viewCount': userHistory.viewedBlogs[blogIndex].viewCount
                }
              }
            );
          }
      }
    }

    res.status(204).end(); // Success, no content to send
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/updateElapsedTime/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { totalTime } = req.body;

    const blog = await Blogs.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update elapsedTime
    console.log("(",blog.elapsedTime,"*",blog.Views,"+",totalTime,")/(",blog.Views,"+1)")
    blog.elapsedTime = (blog.elapsedTime * blog.Views + totalTime)/(blog.Views+1)
    console.log("=",blog.elapsedTime)
    // Save the updated blog
    await blog.save();

    res.status(200).json({ message: 'Elapsed time updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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

    res.json(blogPost);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle updating a specific blog post
app.put('/editblog/:id', async(req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;

  try {
    // Update the post in the MongoDB database using Mongoose
    const updatedBlog = await Blogs.findByIdAndUpdate(postId, updatedPost, { new: true });

    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.get('/blogdata',async (req,res) =>{
//   res.json(await Blogs.find());
// })

app.get('/blogdata', async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blog data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


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