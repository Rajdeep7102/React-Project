import React, { useState } from 'react';
import {pipeline} from '@xenova/transformers';




// [{ summary_text: ' The Eiffel Tower is about the same height as an 81-storey building and the tallest structure in Paris. It is the second tallest free-standing structure in France after the Millau Viaduct.' }]
// Load pre-trained T5 model and tokenizer
const Summarizetest = async () => {

  const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
const text = "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct."
const output = await generator(text, {
  max_new_tokens: 100,
});


  // const [inputText, setInputText] = useState('');
  // const [summarizedText, setSummarizedText] = useState('');

  // // Function for text summarization
  // const summarizeText = () => {
  //   // Tokenize and convert to tensor
  //   const inputs = tokenizer("summarize: " + inputText, { return_tensors: "pt", max_length: 5000, truncation: true });

  //   // Generate summary
  //   const summaryIds = model.generate(inputs["input_ids"], { max_length: 150, length_penalty: 2.0, num_beams: 4, early_stopping: true });

  //   // Decode and update the state with the summarized text
  //   const summary = tokenizer.decode(summaryIds[0], { skip_special_tokens: true });
  //   setSummarizedText(summary);


  //   const [inputText, setInputText] = useState('');
  // const [summary, setSummary] = useState('');

  // const handleInputChange = (event) => {
  //   setInputText(event.target.value);
  // };

  // const handleSummarize = async () => {
  //   try {
  //     // Load the BART model for summarization
  //     const summarizationModel = await pipeline({
  //       model: 'facebook/bart-large-cnn',
  //       task: 'summarization',
  //     });

  //     // Summarize the input text
  //     const summarizedText = await summarizationModel({
  //       text: inputText,
  //     });

  //     setSummary(summarizedText[0].summary);
  //   } catch (error) {
  //     console.error('Error summarizing text:', error);
  //     setSummary('Error summarizing text');
  //   }
  // };
  return (
    <div>
      <h1>Text Summarizer</h1>
      <textarea
        placeholder="Enter text to summarize..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <button onClick={SummarizeText}>Summarize</button>
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