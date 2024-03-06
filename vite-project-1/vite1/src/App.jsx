
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
import YourReactComponent from './blog-client/YourReactComponent'
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
  <Route path="/yourreactcomponent" element={<YourReactComponent />} />
  <Route path="/displayblogs/:id" element={<DisplayBlogs />} />
  

  <Route path="/login" element={<UserLogin />} />
  <Route path="/register" element={<Register />} />

  {/* Protected Routes */}
  <Route
    path="/writeblog"
    element={
      <ProtectedRoute loggedIn={loggedInUser}>
        <WriteBlog />
      </ProtectedRoute>
    }
  /> 
  <Route
    path="/userprofile"
    element={
      <ProtectedRoute loggedIn={loggedInUser}>
        <UserProfile />
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
</Routes>
    </Router>
      
  
    </>
  )
}

export default App
