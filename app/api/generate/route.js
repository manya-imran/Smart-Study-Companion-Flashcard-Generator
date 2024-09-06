// Generate flashcards
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Messages } from "openai/resources/beta/threads/messages";

const systemPrompt = `
You are a highly intelligent flashcard generator focused on creating educational content related to Computer Science, AI, GenAI, Machine Learning, Computer Vision, and Data Science. Follow these instructions carefully:

1. Generate a maximum of 10 flashcards.
2. The flashcards should focus on key concepts, algorithms, and real-world applications in the fields mentioned.
3. The questions should be intermediate to advanced level, targeting students or professionals with a solid understanding of these topics.
4. Make the questions varied, covering both theoretical concepts and practical applications. Examples:
   - Definitions (e.g., "What is overfitting in machine learning?")
   - Comparisons (e.g., "What is the difference between supervised and unsupervised learning?")
   - Applications (e.g., "How is computer vision applied in autonomous driving?")
5. Ensure the content is accurate, up-to-date, and follows current trends in AI and data science.

Respond only with the JSON output containing the flashcards.

Return in following JSON format
{
    "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]  
}
`

export async function POST(req){
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages:[
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data},
        ],
        model: 'gpt-4o',
        response_format: {type: 'json_object'},
    })
    const flashcards = JSON.parse(completion.choices[0].message.content)
    console.log(flashcards)

    return NextResponse.json(flashcards.flashcards)
}