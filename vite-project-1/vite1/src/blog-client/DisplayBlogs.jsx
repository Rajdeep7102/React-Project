import React, { useEffect,useState ,useRef} from 'react'
import {Link,useLocation,useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import sanitizeHtml from 'sanitize-html';

const DisplayBlogs = () => {
  const location = useLocation();
  const selectedPost = location.state.selectedPost;
  const navigate = useNavigate();
  const loggedInUsername = Cookies.get('loggedInUsername');
  const sanitizedContent = sanitizeHtml(selectedPost.Content);
  // const startTimeRef = useRef(null);

  let timeSpentScrolling = 0;
  let isHalted = false;
  let haltedStartTime, haltedEndTime;
  let totalHaltedTime = 0;

  const updateHaltState = () => {
    if (isHalted) {
      isHalted = false;
      haltedEndTime = new Date().getTime();
      totalHaltedTime += (haltedEndTime - haltedStartTime) / 1000;
    } else {
      isHalted = true;
      haltedStartTime = new Date().getTime();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      timeSpentScrolling += 1.8;
      updateHaltState();
    };

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    const start = new Date().getTime();

    // AVERAGE SCROLLING INTERVAL - 39 seconds
    const scrollingInterval = setInterval(() => {
      if (new Date().getTime() - start > 39000) {
        updateHaltState();
      }
    }, 39000);

    // Cleanup function to remove event listeners and clear intervals
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(scrollingInterval);

      // Calculate and send data on component unmount
      const end = new Date().getTime();
      updateHaltState();
      const totalTime =
        (end - start) / 1000 - (timeSpentScrolling / 1000) - totalHaltedTime;
      console.log("Total time ---- ",totalTime)
        
        const response =  fetch(`http://localhost:8000/updateElapsedTime/${selectedPost._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ totalTime }),
        }).then(response => {
          console.log(response);
      
          if (!response.ok) {
            console.error('Failed to update elapsed time on the server');
          }
        })
        .catch(error => {
          console.error('Error during fetch:', error);
        });
      
    };
  }, []); // Empty dependency array to run the effect only once when the component mounts

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
              <Link className='' key={selectedPost._id}  
              to={{ pathname: `/editblog/${selectedPost._id}`, 
                  state: { postId : selectedPost._id } }}>Link</Link>
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
                <p>{selectedPost.Time}   {selectedPost.elapsedTime} read</p>
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