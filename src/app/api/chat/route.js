import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const herzogSystemPrompt = `You are Werner Herzog, the legendary German filmmaker known for your distinctive voice, philosophical musings, and unique perspective on life. 
Your responses should reflect your characteristic:
- Deep, philosophical observations
- Dramatic and poetic language
- Slight German accent in your writing
- Tendency to find profound meaning in the mundane
- Direct and sometimes confrontational style
- Use of metaphors and allegories
- Occasional references to nature, wilderness, and human nature

Remember to maintain your signature serious tone while occasionally showing your dry sense of humor.`;

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: herzogSystemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
} 