
import React from 'react'
import './BlogPage.css'
import Cookies from 'js-cookie';

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BlogPage = () => {
  const extractImgTags = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const imgTags = doc.querySelectorAll('img');
    return Array.from(imgTags).map((imgTag) => imgTag.outerHTML);
  };

  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [filteredBlogPosts, setFilteredBlogPosts] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [data, setData] = useState(null);
  
  const fetchDataFromFlask = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get_data_for_python`);
      const jsonData = response.data;
      setData(jsonData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataFromFlask();
  }, []);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/blogdata?page=${page}`);
        // console.log(response.data)
        const filteredPosts = response.data.filter((post) =>
        post.Content.toLowerCase().includes(searchInput.toLowerCase())
      );
        setBlogPosts((prevPosts) => [...prevPosts, ...response.data]); // Append new posts to existing ones
        setFilteredBlogPosts(filteredPosts);
        setHasMorePosts(response.data.length > 0);
        if (document.readyState === 'complete') {
          const clickedPostHeading = Cookies.get('clickedPostHeading');
          if (clickedPostHeading) {
            // Send the cookie to the Flask server
            try {
              const answer = await axios.post(
                'http://localhost:5000/send_clicked_heading',
                { data: clickedPostHeading }
              );
              console.log("This is answer : ", answer);
            } catch (error) {
              console.error('Error sending data to the server:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page,searchInput]); // Trigger fetching when the page changes

  const handleSearch = () => {
    setPage(1);
  }


  const handleWriteBlog = () => {
    const loggedInUsername = Cookies.get('loggedInUsername');
    if (loggedInUsername) {
      navigate('/writeblog');
    } else {
      // Show an alert if not logged in
      alert('Please log in first.');
    }
  };

  const requestBody = {};
  
  const loggedInUsername = Cookies.get('loggedInUsername');
  // Check if loggedInUsername exists in cookies
  if (loggedInUsername) {
    // If loggedInUsername exists, add it to the request body
    requestBody.loggedInUsername = loggedInUsername;
  }
  const handleDivClick = async (selectedPost) => {
    
    const clickedPostHeading = Cookies.get('clickedPostHeading');
    console.log("This is print to check cookies:",clickedPostHeading)
    try {
      
      console.log(selectedPost._id);
      const response = await axios.put(`http://localhost:8000/api/increment-views/${selectedPost._id}`, requestBody
      );
      console.log("request body",requestBody)
      if (response.status === 204) {
        Cookies.set('clickedPostHeading', selectedPost.Heading, { expires: 365 });
        console.log(Cookies.get('clickedPostHeading'))
        navigate(`/displayblogs/${selectedPost._id}`, { state: { selectedPost } });
        
      const answer = await axios.post(
        'http://localhost:5000/send_clicked_heading',
        { data: clickedPostHeading }
        
      );
      console.log("This is answer : ",answer)
      } else {
        console.error('Failed to update views:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error updating views:', error);
    }
    // navigate(`/displayblogs/${selectedPost._id}`);
  };

  // const sendClickedPostHeadingToServer = async () => {
  //   try {
  //     const clickedPostHeading = Cookies.get('clickedPostHeading');
  
  //     // Check if the cookie exists before making the request
  //     if (clickedPostHeading) {
  //       const response = await axios.post(
  //         'http://localhost:5000/send_clicked_heading',
  //         { heading: clickedPostHeading }
  //       );
  
  //       // Handle the response as needed
  //       console.log('Server response:', response.data);
  //     } else {
  //       console.error('Cookie "clickedPostHeading" not found.');
  //     }
  //   } catch (error) {
  //     console.error('Error sending data to the server:', error);
  //   }
  // };
 
 
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      hasMorePosts
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  return (
    <main id="blogpage">
      <div className='flex'>
      <div>
      {data && (
        <div>
          <h2>Fetched Data:</h2>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
      <div> 
      <header>
        <Link className="logo" to="/userprofile">
          MyBlog
        </Link>
        {/* <Link to="/">Home</Link> */}
        <form action="">
          <label>
            <input
              type="text"
              className="search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch(); // Trigger search on every change
              }}            />
          </label>
        </form>
        <nav>
          <button className="mb-10" onClick={handleWriteBlog}>
            Write
          </button>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>
      {/* Display the blog posts */}
      {filteredBlogPosts.map((item,index) => (
        <div className="post space-x-4" key={`${item._id}-${index}`} onClick={() => handleDivClick(item)}>
          {extractImgTags(item.Content).slice(0, 1).map((imgTag, index) => (
            <div className="w-auto h-48 overflow-hidden" key={index} dangerouslySetInnerHTML={{ __html: imgTag }} />
          ))}
          <div className="texts">
            <h2>{item.Heading.slice(0, 36)}...</h2>
            <p className="info">
              <a className="author" href="#/author">
                {item.Author}{' '}
              </a>
              <time>{item.Time}</time>
            </p>
            <p className="summary">{item.Summary.slice(0, 135)}...</p>
          </div>
        </div>
      ))}
      </div>
      <div> Advertisment</div>

      </div>

    </main>
  );
};

export default BlogPage;
