import React, { useEffect,useState ,useRef} from 'react'
import {Link,useLocation,useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import sanitizeHtml from 'sanitize-html';
import './DisplayBlogs.css'

const DisplayBlogs = () => {
  const location = useLocation();
  const selectedPost = location.state.selectedPost;
  const navigate = useNavigate();
  const loggedInUsername = Cookies.get('loggedInUsername');
  const sanitizedContent = sanitizeHtml(selectedPost.Content);
  const [h1Tags, setH1Tags] = useState([]);
  const [h2Tags, setH2Tags] = useState([]);
  const contentRef = useRef(null); 

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
    window.scrollTo(0,0)
    console.log("this is to print local state on displayblog ",selectedPost)
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
    if (selectedPost && selectedPost.Content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(selectedPost.Content, 'text/html');
      const h2Elements = doc.querySelectorAll('h2');
      h2Elements.forEach((h2, index) => {
        h2.id = `h2-${index}`;
      });
      const h1Tags = Array.from(doc.querySelectorAll('h1')).map(tag => tag.textContent);
      const h2Tags = Array.from(h2Elements).map(tag => tag.textContent);
      setH1Tags(h1Tags);
      setH2Tags(h2Tags);
      
      // Update the contentRef after setting IDs
      contentRef.current.innerHTML = doc.body.innerHTML;
    }
  
   
  
    // Cleanup function to remove event listeners and clear intervals
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(scrollingInterval);
  
      // Calculate and send data on component unmount
      const end = new Date().getTime();
      updateHaltState();
      const totalTime =
        (end - start) / 1000 - (timeSpentScrolling / 1000) - totalHaltedTime;
      // console.log("Total time ---- ", totalTime);
  
      const response = fetch(`http://localhost:8000/updateElapsedTime/${selectedPost._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalTime }),
      }).then(response => {
        // console.log(response);
  
        if (!response.ok) {
          console.error('Failed to update elapsed time on the server');
        }
      })
      .catch(error => {
        console.error('Error during fetch:', error);
      });
    };
  }, [selectedPost]);
  const handleEditClick = async (selectedPost) =>{
    navigate(`/editblog/${selectedPost._id}`,{state:{selectedPost}});
  }

  const handleH2Click = (index) => {
    console.log("Clicked on h2 index:", index);
    const targetElement = contentRef.current.querySelector(`#h2-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error(`Element with ID 'h2-${index}' not found.`);
    }
  }; 
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
            <Link className=""to="/yourreactcomponent">MyProfile</Link>
          </div>
        </div>
        <div className=''>
          <div className='flex'>
          <div className='table-of-contents'>
  <h3 className='text-xl font-bold mb-2'>Table of Contents</h3>
  <ul className='text-lg font-semibold'>
    {h2Tags.map((tag, index) => (
      <li className='toc-item hover:text-red-600 hover:text-xl' key={index} onClick={() => handleH2Click(index)}>
        {tag.split(' ').join(' ')}
      </li>
    ))}
  </ul>
</div>
            <div className='-mt-24  w-2/3 justify-center items-center ml-72'>
              <h1 className='text-4xl font-bold font-serif text-start pb-5'>{selectedPost.Heading}</h1>
              <div className='flex flex-col pb-4 text-start '>
                <a href="">{selectedPost.Author}</a>
                <p>{selectedPost.Time}   {selectedPost.elapsedTime} read</p>
              </div>
              <p  ref={contentRef} className="text-xl text-start" dangerouslySetInnerHTML={{ __html: selectedPost.Content }} ></p>
            </div>
          </div>
        </div>
      </div>
    
    </>
  );    
}


export default DisplayBlogs