// import OpenAI from 'openai';
const { MessagingResponse } = require('twilio').twiml;

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function chatGPTResponse() {
  
//   let context = ''

//   const completion = await openai.chat.completions.create({
//     messages: [
//       { role: 'system', content: `${context}` }, 
//       { role: 'user', content: 'Say this is a test' },
//       { role: 'assistant', content: 'im sorry i cannot do that' }
//     ],
//     model: 'gpt-3.5-turbo',
//   });

//   return (completion.choices[0].message.content);
// };

const sms = async (req, res) => {
  // const twiml = new MessagingResponse();
  // twiml.message('testing twilio');
  // res.type('text/xml').send(twiml.toString());

  console.log('hello there')

  const twiml = new MessagingResponse();
  twiml.message('testing twilio');

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(twiml.toString());
}

export default sms;