
import React from 'react'
import './BlogPage.css'
import Cookies from 'js-cookie';

import { useEffect, useState,useLayoutEffect } from 'react';
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
  const [filteredRecommends, setFilteredRecommends] = useState([]);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  // const [data, setData] = useState([]);
 
  useEffect(() => {
    
    const fetchData = async () => {
      const clickedPostHeading = Cookies.get('clickedPostHeading');
      if (clickedPostHeading) {
        try {
          const answer = await axios.post(
            'http://localhost:5000/send_clicked_heading',
            { data: clickedPostHeading }
          );
          // console.log("This is answer : ", answer);
        } catch (error) {
          console.error('Error sending data to the server:', error);
        }
      }
    
      try {
        const response = await axios.get(`http://localhost:5000/get_data_for_python`);
        const jsonData = response.data;
        console.log("this is the answer: ", jsonData.data);
        // setData(jsonData.data);
        // console.log("this is data  after setData",jsonData.data.Heading)
        // Create headingset after the data is set
        const headingSet = new Set(jsonData.data);
        console.log('this is heading set', headingSet);
  
        const responseBlogData = await axios.get(`http://localhost:8000/blogdata?page=${page}`);
        console.log("This is length of response :",responseBlogData.data.length)
        const filteredPosts = responseBlogData.data.filter((post) =>
          post.Content.toLowerCase().includes(searchInput.toLowerCase())
        );
  
        // const filteredRecommendedData = responseBlogData.data.filter(item => headingSet.has(item.Heading));
        // console.log("these are filtered recommended heading data", filteredRecommendedData);
        // setFilteredRecommends(filteredRecommendedData);
        const filteredRecommendedData = responseBlogData.data.filter(item => headingSet.has(item.Heading));
        setFilteredRecommends(filteredRecommendedData);
        console.log("These is recommended headings",filteredRecommendedData)
        setBlogPosts((prevPosts) => [...prevPosts, ...responseBlogData.data]);
        setFilteredBlogPosts(filteredPosts);
        setHasMorePosts(responseBlogData.data.length > 0);
  
       

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [page, searchInput]);
  
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

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMorePosts
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMorePosts]);
  // console.error('Error sending data to the server:', error);


  return (
    <main id="blogpage" className='w-full mt-5'>
      <div className='flex '>
      <div className='w-1/4 mt-48 '>

      {filteredRecommends.map((item, index) => (
        <div key={index} className="recommended-item">
          {/* ... your existing code for displaying images */}
          <div className="texts flex gap-1 py-4">
          {extractImgTags(item.Content).slice(0, 1).map((imgTag, index) => (
            <div className="w-36 overflow-hidden" key={index} dangerouslySetInnerHTML={{ __html: imgTag }} />
          ))}
           <div className='flex flex-col'>  <h1 className='text-sm font-bold'>{item.Heading.slice(0, 36)}...</h1>
            <p className="info">
              <span className="author text-xs">{item.Author}</span>
            </p>
            </div>
          </div>
        </div>
      ))}

      </div>
      <div className='w-1/2 '> 
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
      <div className="w-1/4 "> Advertisment</div>

      </div>

    </main>
  );
};

export default BlogPage;
