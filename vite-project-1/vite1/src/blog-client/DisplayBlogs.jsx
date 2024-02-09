import React, { useEffect,useState ,useRef} from 'react'
import {Link,useLocation,useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import sanitizeHtml from 'sanitize-html';

const DisplayBlogs = () => {
  const location = useLocation();
  const selectedPost = location.state.selectedPost;
  const navigate = useNavigate();
  // console.log("selectedPost data is : ",selectedPost)
  const loggedInUsername = Cookies.get('loggedInUsername');
  const sanitizedContent = sanitizeHtml(selectedPost.Content);
  const startTimeRef = useRef(null);
  // console.log(loggedInUsername)

  // const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    console.log(startTimeRef.current)
    const handleBeforeUnload = (event) => {
      
      if (startTimeRef.current) {
        console.log("slected",selectedPost._id)
        const elapsedTime = Date.now() - startTimeRef.current;
        console.log(elapsedTime)
        sendElapsedTimeToServer(selectedPost._id, elapsedTime);
      }
    };

    
    // console.log(startTime)
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedPost._id]);


   

  // Function to send elapsed time to the server

  const sendElapsedTimeToServer = async (postId, elapsedTime) => {
    try {
      const response = await fetch(`http://localhost:8000/api/update-elapsed-time/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elapsedTime,
        }),
      });
      console.log(response)

      if (!response.ok) {
        console.error('Failed to update elapsed time:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error updating elapsed time:', error);
    }
  };
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