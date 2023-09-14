import OpenAI from 'openai';
const { MessagingResponse } = require('twilio').twiml;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simplified in-memory message storage
const messageHistory = {};

async function chatGPTResponse(userMessag, fromNumber) {
  try {
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000; // milliseconds

    // Initialize if not already done
    if (!messageHistory[fromNumber]) {
      messageHistory[fromNumber] = [];
    }

    // Add the new message to the history
    messageHistory[fromNumber].push({
      message: userMessage,
      time: currentTime,
      role: 'user',
    });

    // Filter out messages older than an hour
    messageHistory[fromNumber] = messageHistory[fromNumber].filter(
      msg => currentTime - msg.time <= oneHour
    );

    let context = 'You are ChatGPT, a helpful assistant. Please keep your responses short and to the point, ideally under 160 characters, as they will be sent via SMS.';
    const messages = [
      { role: 'system', content: context },
      ...messageHistory[fromNumber].map(msg => ({ role: msg.role, content: msg.message }))
    ];

    // Get GPT-3 response
    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
      max_tokens: 160,
    });

    const gptResponse = completion.choices[0].message.content;

    // Add GPT-3's response to the history
    messageHistory[fromNumber].push({
      message: gptResponse,
      time: Date.now(),
      role: 'assistant',
    });

    return gptResponse;

  } catch (error) {
    console.error('Error in chatGPTResponse:', error);
    return 'An error occurred.';
  }
}

const sms = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const userMessage = req.body.Body;
    const fromNumber = req.body.From;
    const gptResponse = await chatGPTResponse(userMessage, fromNumber);
    
    const twiml = new MessagingResponse();
    twiml.message(`${gptResponse}`);

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('Error in sms:', error);
    res.status(500).send('An error occurred.');
  }
};

export default sms;
