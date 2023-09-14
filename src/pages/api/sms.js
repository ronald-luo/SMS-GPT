import OpenAI from 'openai';
import { MessagingResponse } from "twilio/lib/twiml";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chatGPTResponse() {
  
  let context = ''

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: `${context}` }, 
      { role: 'user', content: 'Say this is a test' },
      { role: 'assistant', content: 'im sorry i cannot do that' }
    ],
    model: 'gpt-3.5-turbo',
  });

  return (completion.choices[0].message.content);
};

const sms = async (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message(chatGPTResponse());

  res.type('text/xml').send(twiml.toString());
}

export default sms;

// Your AccountSID and Auth Token from console.twilio.com
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//     body: 'Hello from twilio-node',
//     to: '+12345678901', // Text your number
//     from: '+12345678901', // From a valid Twilio number
//   })
//   .then((message) => console.log(message.sid));