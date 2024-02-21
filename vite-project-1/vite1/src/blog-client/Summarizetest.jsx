






import React, { useState, useEffect  } from 'react';
import {pipeline} from '@xenova/transformers';

const Summarizetest = () => {

  // const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
      const text = "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.";
      const result = await generator(text, {
        max_new_tokens: 100,
      });
      setOutput(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Text Summarizer</h1>
      {/* <textarea
        placeholder="Enter text to summarize..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea> */}
      {/* <button onClick={SummarizeText}>Summarize</button> */}
      {output && (
        <div>
          <h2>Summary:</h2>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
      }

export default Summarizetest