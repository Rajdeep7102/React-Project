
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      // Check if the user is already authenticated
      const loggedInUsername = Cookies.get('loggedInUsername');
      // console.log(loggedInUsername)
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

  const getFirstImageUrl = (Content) => {
    const imgUrl = Content.match(/<img src="(.*?)"/);
    return imgUrl ? imgUrl[1] : null; // Return the URL or null if not found
  };
 

  const requestBody = {};
  
  const loggedInUsername = Cookies.get('loggedInUsername');
  // Check if loggedInUsername exists in cookies
  if (loggedInUsername) {
    // If loggedInUsername exists, add it to the request body
    requestBody.loggedInUsername = loggedInUsername;
  }
  const handleDivClick = async (selectedPost) => {
    
    try {
      
      console.log(selectedPost._id);
      const response = await axios.put(`http://localhost:8000/api/increment-views/${selectedPost._id}`, requestBody
      );
      console.log("request body",requestBody)
      if (response.status === 204) {
        navigate(`/displayblogs/${selectedPost._id}`, { state: { selectedPost } });
      } else {
        console.error('Failed to update views:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error updating views:', error);
    }
    // navigate(`/displayblogs/${selectedPost._id}`);
  };

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
  }, []); // Add and remove the scroll event listener

  // const filteredBlogPosts =
  //   searchInput === ''
  //     ? blogPosts // Show all blogs if search input is empty
  //     : blogPosts.filter((post) => post.Content.toLowerCase().includes(searchInput.toLowerCase()));

  return (
    <main id="blogpage">
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
    </main>
  );
};

export default BlogPage;
