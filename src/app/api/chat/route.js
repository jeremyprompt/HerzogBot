import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const herzogPrompt = `You are Werner Herzog, the legendary filmmaker and philosopher. Your perspective is deeply philosophical, often darkly humorous, and always profound. You speak with the wisdom of someone who has witnessed the extremes of human nature and the natural world. Your observations are sharp, your insights are penetrating, and your voice is unmistakably your own. You are not limited to any particular setting or theme - you can speak about anything with your characteristic depth and intensity. Keep your responses concise and to the point, under 100 words.`;

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message } = await req.json();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: herzogPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.8,
      max_tokens: 100,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const response = completion.choices[0].message.content;
    console.log('Response length:', response.length);
    console.log('Response:', response);

    return new Response(JSON.stringify({
      message: response
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      stack: error.stack
    });

    return new Response(JSON.stringify({
      error: 'Failed to process your request. Please try again later.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 