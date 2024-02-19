// BlogPage.js
import React from 'react';
import './Writeblog.css'
import Cookies from 'js-cookie';
import { useNavigate,useLocation,useParams } from "react-router-dom";
import {useState,useEffect,useRef} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
// import 'react-quill/dist/quill.bubble.css';
import axios from 'axios';

import sanitizeHtml from 'sanitize-html';


const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];
const EditBlog = () => {
    // const [heading, setHeading] = useState('');
    // const [text, setText] = useState('');
    // const [Category,setCategory] = useState('');
    // const [Summary,setSummary] = useState('');
    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;

  const [postInfo, setPostInfo] = useState({
    Heading: '',
    Content: '',
    Summary: '',
    Category: '',
  });
  const location = useLocation();

  // const postId = location.state.postId;
    
      // Ensure that selectedPost has a value and log it to verify
  console.log(id);

    useEffect(() => {
      
      // Check if location state has the selectedPost data
      const fetchPostInfo = async () => {
        console.log(id)
        try {

          const response = await axios.get(`http://localhost:8000/editblog/${id}`);
          console.log(response.data)
          if (response.status === 200 ) {
            const post = await response.data;
            // console.
          // setHeading(post.Heading || ''); // Assuming your response has a property 'heading'
          // setSummary(post.Summary || ''); // Assuming your response has a property 'summary'
          // setText(post.Content || '');    // Assuming your response has a property 'content'
          // setCategory(post.Category || '');
            setPostInfo(post);
          } else {
            console.error('Failed to fetch blog data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      fetchPostInfo();
    }, [id]);

    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  
  
    const handleSave = async () => {
      try {

        const response = await axios.put(`http://localhost:8000/editblog/${id}`, postInfo);

      if (response.status === 200) {
        console.log('Blog data updated successfully');
        navigate('/');
      } else {
        console.error('Failed to update blog data');
      }
    } catch (error) {
      console.error('Error:', error);
      }

    };
      
    return (
      <div className="div1">
        <div className='px-32'>
          <h1 className="text-4xl text-bold">Edit Blog</h1>
          <div  className="">
            <label className="heading">
              Heading:</label>
              <input className="blog-heading" 
              type="text" 
              name="Heading" 
              value={postInfo.Heading} 
              onChange={handleInputChange} />
            <label className="Summary">Summary:</label>
            <input className='Summary' 
                    type="text" 
                    name="Summary" 
                    value={postInfo.Summary} 
                    onChange={handleInputChange} 
                    placeholder='Enter Summary of the blog'/>
  
            <ReactQuill value={postInfo.Content} name='text' type="text"
            onChange={newValue => setPostInfo((prevInfo) => ({ ...prevInfo, Content: newValue }))}/>
  
            <label className="Category">Category:</label>
            <input className='Categories' 
                   type="text" 
                   name="Category" 
                   value={postInfo.Category} 
                   onChange={handleInputChange} 
                   placeholder='Technology,Science,Art, etc.'/>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    );
}

export default EditBlog