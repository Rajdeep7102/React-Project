// BlogPage.js
import React from 'react';
import './Writeblog.css'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import {useState,useEffect,useRef} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';


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
// import {pipeline} from '@xenova/transformers'

//function to summarize the content

// const createHandlers = (pipeline) =>{
//   const handleSave = async (text,heading,Category) => {
//     try { 
//       const Author = Cookies.get('loggedInUsername');
//       const Time = new Date();
//       const summarizedContent = await pipeline('summarization',text);

//       const response = await fetch('http://localhost:8000/blogs',{
//         method:'POST',
//         headers :{
//           'Content-Type':'application/json',
//         },
//         body: JSON.stringify({
//           Author,
//           Time,
//           Heading:heading,
//           Content: text,
//           Summary: summarizedContent,
//           Category,
//         }),
//       });
//       if(response.ok){
//         console.log('Blog Data saved successfully');
//       }
//       else{
//         console.error('Failed to save blog data');
//       }
//     }
//     catch(error){
//       console.error('Erro:',error);
//     }
//   }
//   return {handleSave};
// }
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
    try {
      const Author = Cookies.get('loggedInUsername');
      const Time = new Date();
      const summary = Summary.trim() ? Summary : text.slice(0, 150);     // const Summary = new GenerateSummary(text);
      // const summarizedContent = await pipeline('summarization',text)
      
      const response = await fetch('http://localhost:8000/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Author,Time,Heading: heading,Content:text,Summary:summary,Category,File:files[0]}),
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


    

    const [summarizedText,setSummarizedText] = useState('');
    const handleSummarize = async () => {
        try {
          const response = await axios.post('http://localhost:5000/summarize',{
            text: text,
          });
          setSummarizedText(response.data.summary);
        }catch(error){
          console.error('Error summarizing text:',error);
        }
    }
    // handleSummarize();
  };

  return (
    <div className="div1">
      <div className='px-32'>
        <h1 className="text-4xl text-bold">Create a New Blog</h1>
        <div className="">
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

          <ReactQuill value={text} name='text'
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
          <button onClick={handleSave}>Save Blog</button>
        </div>
      </div>

      {/* <div className="div3">
        
      </div> */}
    </div>
  );
};

export default WriteBlog;



