import OpenAI from 'openai';
const { MessagingResponse } = require('twilio').twiml;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chatGPTResponse(userMessage) {
  try {
    let context = '';

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: `${context}` },
        { role: 'user', content: userMessage },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error in chatGPTResponse:', error);
    return 'An error occurred.';
  }
}

const sms = async (req, res) => {
  try {
    const userMessage = req.body.Body;
    const gptResponse = await chatGPTResponse(userMessage);
    const twiml = new MessagingResponse();
    twiml.message(`robot: ${gptResponse}`);

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('Error in sms:', error);
    res.status(500).send('An error occurred.');
  }
};

export default sms;
