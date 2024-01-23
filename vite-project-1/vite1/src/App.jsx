
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
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <Router>
    
      <Routes>
       <Route path='/' element={<Home/>}></Route>
       <Route path='/tools' element={<Tools/>}></Route>
       <Route path='/blogpage' element={<BlogPage/>}></Route>
       <Route path='/login' element={<UserLogin/>}></Route>
       <Route path='/register' element={<Register/>}></Route>
       <Route path='/writeblog' element={<WriteBlog/>}></Route>
      </Routes>
    
    <Footer/>
    </Router>
      
  
    </>
  )
}

export default App
