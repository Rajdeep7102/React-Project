import React, { useEffect } from 'react'
import {Link,useLocation,useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import sanitizeHtml from 'sanitize-html';

const DisplayBlogs = () => {
  const location = useLocation();
  const selectedPost = location.state.selectedPost;
  const navigate = useNavigate();
  console.log("selectedPost data is : ",selectedPost)
  const loggedInUsername = Cookies.get('loggedInUsername');
  const sanitizedContent = sanitizeHtml(selectedPost.Content);
  console.log(loggedInUsername)

  const handleEditClick = async (selectedPost) =>{
    navigate(`/editblog/${selectedPost._id}`,{state:{selectedPost}});
  }
  return (
    
    <>
   
    <div className=' ' >
        <div className='text-xl  justify-center pb-36 flex space-x-96 pt-11'>
          <div className=''>
            <Link className='font-bold' to="/blogpage"> Explore</Link>
          </div>
          <div className='flex gap-9'>
            <Link className='' to="/">Home</Link>
            {loggedInUsername === selectedPost.Author ? (
              <Link className='' key={selectedPost._id}  to={{ pathname: `/editblog/${selectedPost._id}`, state: { postId : selectedPost._id } }}>Link</Link>
              // to={{ pathname: `/editblog/${selectedPost._id}`, state: { selectedPost } }}
            ):null} 
            <Link className=""to="/summarize">MyProfile</Link>
          </div>
        </div>
        <div className=''>
          <div>
            <div className='-mt-24  w-2/3 justify-center items-center ml-72'>
              <h1 className='text-4xl font-bold font-serif text-start pb-5'>{selectedPost.Heading}</h1>
              <div className='flex flex-col pb-4 text-start '>
                <a href="">{selectedPost.Author}</a>
                <p>{selectedPost.Time}</p>
              </div>
              <p  className="text-xl text-start" dangerouslySetInnerHTML={{ __html: selectedPost.Content }} ></p>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );    
}


export default DisplayBlogs