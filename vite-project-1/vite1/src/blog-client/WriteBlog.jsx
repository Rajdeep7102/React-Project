// BlogPage.js
import React from 'react';
// import './Writeblog.css'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import {useState,useEffect,useRef} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
// import 'react-quill/dist/quill.bubble.css';
import axios from 'axios'; 
import Footer from '../components/Footer';
import sanitizeHtml from 'sanitize-html';


const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean'],
  ],

};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'align',
  'blockquote', 'code-block',
  'link', 'image', 'video',
  'list', 'bullet',
];



const WriteBlog = () => {
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [Category,setCategory] = useState('');
  const [Summary,setSummary] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'heading') {
      setHeading(value);
    } 
    // else if (name === 'text') {
    //   setText(value);
    // }
    else if (name == "Category"){
      setCategory(value);
    }
    else if(name=="Summary"){
      setSummary(value);
    }
  };
  const navigate = useNavigate();

  const handleSave = async () => {
    const fieldsToCheck = ['heading', 'text', 'Summary', 'Category'];
    const emptyFields = [];

    fieldsToCheck.forEach((field) => {
      if (!eval(field).trim()) {
        emptyFields.push(field);
      }
    });

    if (emptyFields.length > 0) {
      // alert(`Please fill in the following fields: ${emptyFields.join(', ')}`);
      setEmptyFields(emptyFields);
      return;
    }
    const extractTextFromHTML = (htmlContent) => {
      const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
      return doc.body.textContent || "";
    };
    try {
      const Author = Cookies.get('loggedInUsername');
      const Time = new Date();
      // const summary = (Summary.trim() ? Summary : text.slice(0, 150)).replace(/<\/?[^>]+(>|$)/g, "");
      const summary = (Summary.trim() ? Summary : extractTextFromHTML(text).slice(0, 150));
   // const Summary = new GenerateSummary(text);
      // const summarizedContent = await pipeline('summarization',text)
      
      const response = await fetch('http://localhost:8000/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Author,Time,Heading: heading,Content:text,Summary:summary,Category,Views:0}),
      });


    if (response.ok) {
        console.log('Blog data saved successfully');
        navigate('/');
        
        
      } else {
        console.error('Failed to save blog data');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  };
  const resetEmptyFields = () => {
    setEmptyFields([]);
  };

  return (
    <>
     <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
  <div style={{flex:'1', width: '90%', margin: 'auto', marginTop: '30px' }}>
  <div className="w-100 mx-auto bg-white p-8 shadow-md rounded-md">
    <h1 className="text-3xl font-bold mb-6">Create a New Blog</h1>

    {/* <label className="block mb-2 text-gray-800">Title:</label> */}
    <input
      type="text"
      className={`w-full border border-gray-300 p-2 rounded mb-4 ${emptyFields.includes('heading') ? 'border-red-300' : ''}`}

      value={heading}
      onChange={(e) => setHeading(e.target.value)}
      placeholder='Title of the post'
      onFocus={resetEmptyFields}
    />

    <ReactQuill
      value={text}
      onChange={(value) => setText(value)}
      theme="snow"
      className="mb-4"
      placeholder='Write the content here'
      modules={modules}
      formats={formats}
    />
    {/* <label className="block mt-4 mb-2 text-gray-800">Summary:</label> */}
        <input
        type="text"
        className={`w-full border border-gray-300 p-2 rounded mb-4 ${emptyFields.includes('Summary') ? 'border-red-300' : ''}`}

          value={Summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter a brief summary of the blog"
          onFocus={resetEmptyFields}
        />

{/* <label className="block mt-4 mb-2 text-gray-800">Categories:</label> */}
        <input
          type="text"
          className={`w-full border border-gray-300 p-2 rounded mb-4 ${emptyFields.includes('Category') ? 'border-red-300' : ''}`}

          value={Category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter categories separated by commas"
          onFocus={resetEmptyFields}
        />

    <button
      className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      onClick={handleSave}
    >
      Publish
    </button>
  </div>
  
</div>
<Footer/>
</div>
</>
  );
};

export default WriteBlog;



