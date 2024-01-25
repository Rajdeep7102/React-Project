// summarizer.js

import {pipeline} from '@xenova/transformers';
const { promisify } = require('util');
const { T5Tokenizer, T5ForConditionalGeneration } = require('@xenova/transformers');

// Load pre-trained T5 model and tokenizer
const tokenizer = new T5Tokenizer.from_pretrained('t5-small');
const model = new T5ForConditionalGeneration.from_pretrained('t5-small');

// Custom Transform stream for summarization
class SummarizeStream extends Transform {
  constructor(options) {
    super(options);
  }

  async _transform(chunk, encoding, callback) {
    const text = chunk.toString('utf-8');
    const inputs = tokenizer.encode('summarize: ' + text, { return_tensors: 'pt' });
    const summaryIds = await model.generate(inputs.input_ids);
    const summary = tokenizer.decode(summaryIds[0], { skip_special_tokens: true });
    this.push(summary);
    callback();
  }
}

// Function to create a summarizer instance
function createSummarizer() {
  const summarizer = promisify(pipeline);

  return {
    summarize: async (text) => {
      const summarizedText = await summarizer(
        new SummarizeStream(),
        Buffer.from(text, 'utf-8')
      );
      return summarizedText.toString('utf-8');
    },
  };
}

module.exports = { createSummarizer };
