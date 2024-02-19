
import './App.css'
import Header from "./components/Header"
import Home from "./components/Home"

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Tools from './components/Tools'
import Blog from './components/Blog'
import Footer from './components/Footer'
import BlogPage from './blog-client/BlogPage'
import UserLogin from './blog-client/UserLogin'
import Register from './blog-client/Register'
import WriteBlog from './blog-client/WriteBlog'
import DisplayBlogs from './blog-client/DisplayBlogs'
import UserProfile from './blog-client/UserProfile'
import EditBlog from './blog-client/EditBlog'
import ProtectedRoute from './components/ProtectedRoute'
import Cookies from 'js-cookie'

let loggedInUser = Cookies.get('loggedInUsername')
// import summar from '/AImodel/FirstModel'
import Summarizetest from './blog-client/Summarizetest'
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <Router>
    
    <Routes>
  {/* <Route path="/" element={<Home />} /> */}
  <Route path="/tools" element={<Tools />} />
  <Route path="/blog" element={<Blog />} />
  <Route path="/" element={<BlogPage />} />
  <Route path="*" element={<BlogPage />} />


  <Route path="/login" element={<UserLogin />} />
  <Route path="/register" element={<Register />} />

  // Protected Routes
  {/* <ProtectedRoute loggedIn={loggedInUser} path="/writeblog" element={<WriteBlog />} /> */}
  <Route
    path="/writeblog"
    element={
      <ProtectedRoute loggedIn={loggedInUser}>
        <WriteBlog />
      </ProtectedRoute>
    }
  />
  {/* <ProtectedRoute loggedIn={loggedInUser} path="/writeblog" element={<WriteBlog />} /> */}
  <Route
    path="/userprofile"
    element={
      <ProtectedRoute loggedIn={loggedInUser}>
        <UserProfile />
      </ProtectedRoute>
    }
  />
  {/* <ProtectedRoute loggedIn={loggedInUser} path="/writeblog" element={<WriteBlog />} /> */}
  <Route
    path="/displayblogs/:id"
    element={
      <ProtectedRoute loggedIn={loggedInUser}>
        <DisplayBlogs />
      </ProtectedRoute>
    }
  />
  <Route
    path="/editblog/:id"
    element={
      <ProtectedRoute loggedIn={loggedInUser}>
        <EditBlog />
      </ProtectedRoute>
    }
  />
  {/* <ProtectedRoute loggedIn={loggedInUser} path="/userprofile" element={<UserProfile />} />
  <ProtectedRoute loggedIn={loggedInUser} path="/displayblogs/:id" element={<DisplayBlogs />} />
  <ProtectedRoute loggedIn={loggedInUser} path="/editblog/:id" element={<EditBlog />} /> */}

  <Route path="/summarize" element={<Summarizetest />} />
</Routes>

      {/* <Routes>
       <Route path='/' element={<Home/>}></Route>
       <Route path='/tools' element={<Tools/>}></Route>
       <Route path='/blog' element={<Blog/>}></Route>

       <Route path='/blogpage' element={<BlogPage/>}></Route>
       <Route path='/login' element={<UserLogin/>}></Route>
       <Route path='/register' element={<Register/>}></Route>
       <Route path='/writeblog' element={<WriteBlog/>}></Route>
       <Route path='/userprofile' element={<UserProfile/>}></Route>
       <Route path='/displayblogs/:id' element={<DisplayBlogs/>}></Route>
       <Route path='/editblog/:id' element={<EditBlog/>}></Route>
       <Route path='/editblog' element={<EditBlog/>}></Route>
       <Route path='/summarize' element={<Summarizetest/>}></Route>

      </Routes> */}
    
    <Footer/>
    </Router>
      
  
    </>
  )
}

export default App
