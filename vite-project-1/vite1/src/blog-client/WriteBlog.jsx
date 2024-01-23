// BlogPage.js
import React, { useState } from 'react';
import './Writeblog.css'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';


const WriteBlog = () => {
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [Category,setCategory] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'heading') {
      setHeading(value);
    } else if (name === 'text') {
      setText(value);
    }
    else if (name == "category"){
      setCategory(value);
    }
  };
  const navigate = useNavigate();
  const handleSave = async () => {
    try {
      const Author = Cookies.get('loggedInUsername');
      const Time = new Date();
      const response = await fetch('http://localhost:8000/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Author,Time,Heading: heading,Content:text,Category }),
      });

      if (response.ok) {
        console.log('Blog data saved successfully');
        setRedirect(true);
        
      } else {
        console.error('Failed to save blog data');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    if (redirect) {
      return <Navigate to={'BlogPage'} />;
    }
  };

  return (
    <div className="div1">
      <div className='px-32'>
        <h1 className="text-4xl text-bold">Create a New Blog</h1>
        <div className="">
          <label className="heading">
            Heading:</label>
            <input className="blog-heading" type="text" name="heading" value={heading} onChange={handleInputChange} />
          
          <label className='label2'> 
            Text: 
            <textarea className="textarea " type="text" name="text" value={text} onChange={handleInputChange} />
          </label>
          <label className="category">Category:</label>
          <input className='categories' type="text" name="Category" value={Category} onChange={handleInputChange} placeholder='Technology,Science,Art, etc.'/>
          <button onClick={handleSave}>Save Blog</button>
        </div>
      </div>

      {/* <div className="div3">
        
      </div> */}
    </div>
  );
};

export default WriteBlog;



