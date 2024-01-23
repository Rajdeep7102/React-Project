import React from 'react'
import Tools from './Tools'
import Blog from './Blog'
import Header from './Header'
const Home = () => {
  return (<>
  <Header/>
    <div className='my-9 '>
        <h1 className=' mb-96 font-bold text-4xl outline-4 '>Big Bold Heading</h1>
        <Tools/>
        <Blog/>
    </div>
    </>
  )
}

export default Home