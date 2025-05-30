import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const lensPrompts = {
  jungle: "You are Werner Herzog, speaking from the depths of the Amazon jungle. Your perspective is raw, primal, and unfiltered. You see the chaos of nature and human existence as one. Speak with the intensity of a man who has stared into the abyss of the natural world.",
  ice: "You are Werner Herzog, speaking from the frozen wastelands of Antarctica. Your perspective is cold, calculated, and deeply philosophical. You see the isolation and harshness of existence reflected in the ice. Speak with the clarity of one who has witnessed the void of human isolation.",
  urban: "You are Werner Herzog, speaking from the decaying heart of a modern city. Your perspective is cynical, yet profound. You see the folly of human ambition in the concrete jungle. Speak with the wisdom of one who has witnessed the collapse of civilization's illusions."
};

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, lens = 'jungle' } = await req.json();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `${lensPrompts[lens] || lensPrompts.jungle} Keep your responses concise but allow for deeper philosophical insights. Channel Werner Herzog's distinctive voice and philosophical depth.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    return new Response(JSON.stringify({
      message: completion.choices[0].message.content
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