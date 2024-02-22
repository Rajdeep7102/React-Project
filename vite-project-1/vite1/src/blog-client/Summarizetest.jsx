import React, { useState, useEffect  } from 'react';
// import {pipeline} from '@xenova/transformers';

const Summarizetest = () => {

  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');

  const summarizeText = async () => {
    try {
      const response = await axios.post('http://localhost:5000/summarize', {
        text: inputText,
      });
      
      setOutput(response.data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
    }
  };

  return (
    <div>
      <h1>Text Summarizer</h1>
      <textarea
        placeholder="Enter text to summarize..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <button onClick={summarizeText}>Summarize</button>
      {output && (
        <div>
          <h2>Summary:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
};

export default Summarizetest