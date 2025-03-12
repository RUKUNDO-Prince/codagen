// import express from 'express'
// import * as dotenv from 'dotenv'
// import cors from 'cors'
// import { Configuration, OpenAIApi } from 'openai'

// dotenv.config()

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// const app = express()
// app.use(cors())
// app.use(express.json())

// app.get('/', async (req, res) => {
//   res.status(200).send({
//     message: 'Hello from Codagen!'
//   })
// })

// app.post('/', async (req, res) => {
//   try {
//     const prompt = req.body.prompt;

//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `${prompt}`,
//       temperature: 0, // Higher values means the model will take more risks.
//       max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
//       top_p: 1, // alternative to sampling with temperature, called nucleus sampling
//       frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
//       presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
//     });

//     res.status(200).send({
//       bot: response.data.choices[0].text
//     });

//   } catch (error) {
//     console.error(error)
//     res.status(500).send(error || 'Something went wrong');
//   }
// })

// app.listen(5000, () => console.log('AI server started on http://localhost:5000'))


import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';  // Import the Gemini AI package

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);  // Use the Gemini API key

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });  // Specify the Gemini model

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codagen! Ask me to help with code!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;  // Get the prompt from the request body

    if (!prompt) {
      return res.status(400).send({
        error: 'No prompt provided. Please ask a coding-related question or request.',
      });
    }

    // Preprocess prompt to guide the AI towards coding tasks
    const codingPrompt = `You are an AI that helps with coding. Please respond to the following request with a code snippet or explanation:\n\n${prompt}`;

    // Call the Gemini API to generate content
    const result = await model.generateContent(codingPrompt);

    // Send the generated response from Gemini API
    res.status(200).send({
      bot: result.response.text(),  // Send the response from Gemini AI
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error.message || 'Something went wrong with the AI request.',
    });
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
