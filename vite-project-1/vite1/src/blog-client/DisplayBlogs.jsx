import React, { useEffect } from 'react'
import {Link,useLocation} from "react-router-dom";
import Cookies from 'js-cookie';

const DisplayBlogs = () => {
  const location = useLocation();
  const selectedPost = location.state.selectedPost;
  const loggedInUsername = Cookies.get('loggedInUsername');

  return (
    
    <>
    <div className=' ' >
    
        <div className='text-xl  justify-center pb-36 flex space-x-96 pt-11'>

        <div className=''>
          <Link className='font-bold' to="/blogpage"> Explore</Link>
         
        </div>

        <div className='flex gap-9'>
        <Link className='' to="/">Home</Link>
        {loggedInUsername === selectedPost.Author && (
          <button className=''>Edit</button>
        )}
          <Link className=""to="/register">MyProfile</Link>
        </div>

        </div>

      <div className=''>
        {/* <div>L</div> */}
        <div>
     <div className='-mt-24  w-2/3 justify-center items-center ml-72'>
     <h1 className=''>{selectedPost.Heading}</h1>
       
      <div className='flex justify-between '>
      <a href="">{selectedPost.Author}</a>
       <p>{selectedPost.Time}</p>
      </div>

         <p>{selectedPost.Content}</p>
      
     </div></div>
        {/* <div>R</div> */}
      </div>

    </div>
    
    
    </>
  );    
}


export default DisplayBlogs