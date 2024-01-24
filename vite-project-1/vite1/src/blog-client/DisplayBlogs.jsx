import React, { useEffect } from 'react'
import {Link} from "react-router-dom";

const DisplayBlogs = () => {

  return (
    
    <>
    <div className=' ' >
    
        <div className='text-xl  justify-center pb-36 flex space-x-96 pt-11'>

        <div className=''>
          <Link className='font-bold' to="/blogpage"> Explore</Link>
         
        </div>

        <div className='flex gap-9'>
        <Link className='' to="/">Home</Link>
          <button className='' >Edit</button>
          <Link className=""to="/register">MyProfile</Link>
        </div>

        </div>

      <div className=''>
        {/* <div>L</div> */}
        <div>
     <div className='-mt-24 bg-zinc-500 w-2/3 justify-center items-center ml-72'>
     <h1 className='bg-red-400 '>Heading</h1>
       
      <div className='flex justify-between '>
      <a href="">Author</a>
       <p>Date/Time</p>
      </div>

         <p>Content</p>
      
     </div></div>
        {/* <div>R</div> */}
      </div>

    </div>
    
    
    </>
  );    
}


export default DisplayBlogs