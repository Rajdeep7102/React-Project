// BlogPage.js
import React from 'react';
import './Writeblog.css'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import {useState,useEffect,useRef} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
// import 'react-quill/dist/quill.bubble.css';

import sanitizeHtml from 'sanitize-html';


const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ align: [] }],
    ['blockquote'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
  'align',
  'blockquote',
  'font', 'size',
];



const WriteBlog = () => {
  const [heading, setHeading] = useState('');
  const [text, setText] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [Category,setCategory] = useState('');
  const [Summary,setSummary] = useState('');
  const [files,setFiles] = useState('');


  
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
        navigate('/BlogPage');
        
        
      } else {
        console.error('Failed to save blog data');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // const [summarizedText,setSummarizedText] = useState('');
    // const handleSummarize = async () => {
    //     try {
    //       const response = await axios.post('http://localhost:5000/summarize',{
    //         text: text,
    //       });
    //       setSummarizedText(response.data.summary);
    //     }catch(error){
    //       console.error('Error summarizing text:',error);
    //     }
    // }
    // handleSummarize();
  };

  return (
    <div className="div1">
      <div className='px-32'>
        <h1 className="text-4xl text-bold">Create a New Blog</h1>
        <div  className="">
          <label className="heading">
            Heading:</label>
            <input className="blog-heading" type="text" name="heading" value={heading} onChange={handleInputChange} />
            
      
          {/* <label className='label2'> 
            Text: 
            <textarea className="textarea " type="text" name="text" value={text} onChange={handleInputChange} />
          </label> */}
         
          <label className="Summary">Summary:</label>
          <input className='Summary' 
                  type="text" 
                  name="Summary" 
                  value={Summary} 
                  onChange={handleInputChange} 
                  placeholder='Enter Summary of the blog'/>
          <input type="file"
             onChange={ev => setFiles(ev.target.files)} />

          <ReactQuill value={text} name='text' type="text"
          onChange={newValue => setText(newValue)}
                      modules={modules} 
                      formats={formats }/>

          <label className="Category">Category:</label>
          <input className='Categories' 
                 type="text" 
                 name="Category" 
                 value={Category} 
                 onChange={handleInputChange} 
                 placeholder='Technology,Science,Art, etc.'/>
          <button onClick={handleSave}>Publish</button>
        </div>
      </div>

      {/* <div className="div3">
        
      </div> */}
    </div>
  );
};

export default WriteBlog;



