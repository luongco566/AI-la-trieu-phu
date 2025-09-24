
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question } from '../types';
import { MOCK_QUESTIONS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: "A unique identifier for the question (e.g., UUID)." },
        question: { type: Type.STRING, description: "The text of the question." },
        choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of exactly four string options."
        },
        correctIndex: { type: Type.INTEGER, description: "The 0-based index of the correct answer in the 'choices' array." },
        explanation: { type: Type.STRING, description: "A brief explanation for the correct answer." },
        difficulty: { type: Type.STRING, description: "The difficulty level: 'easy', 'medium', or 'hard'." },
        domain: { type: Type.STRING, description: "The subject or topic of the question." },
    },
    required: ["id", "question", "choices", "correctIndex", "explanation", "difficulty", "domain"],
};

const fullSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: questionSchema
        }
    },
    required: ["questions"]
}

export async function generateQuestions(
    topic: string,
    count: number,
    difficulty: Difficulty
): Promise<Question[]> {
    if (!API_KEY) {
        console.log("No API Key, returning mock questions.");
        return Promise.resolve(MOCK_QUESTIONS.slice(0, count));
    }

    const systemPrompt = `You are an expert game master for the "Who Wants to Be a Millionaire" TV show. Your task is to generate high-quality, engaging, and accurate questions.
    
    RULES:
    1.  STRICTLY return a JSON object that matches the provided schema. Do not include any text, markdown, or commentary outside of the JSON structure.
    2.  All questions must be in Vietnamese ('vi-VN').
    3.  Generate exactly ${count} questions.
    4.  The difficulty should ramp up. The first third should be '${difficulty === 'mixed' ? 'easy' : difficulty}', the middle third '${difficulty === 'mixed' ? 'medium' : difficulty}', and the final third '${difficulty === 'mixed' ? 'hard' : difficulty}'.
    5.  Each question must have one single, unambiguously correct answer and three plausible but incorrect distractors.
    6.  Avoid "All of the above" or "None of the above" options.
    7.  The content must be appropriate for a general audience (school/university level) and free of sensitive, biased, or controversial topics.
    8.  For the 'id' field, generate a unique random string for each question.
    9.  The 'explanation' should be concise and informative.
    `;

    const userPrompt = `Generate a set of ${count} questions about the topic: "${topic}" with a ${difficulty} difficulty curve.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: "user", parts: [{ text: userPrompt }] },
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: fullSchema,
                temperature: 1,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (parsedData.questions && Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
            return parsedData.questions.filter((q: any) => 
                q.question && Array.isArray(q.choices) && q.choices.length === 4 && q.correctIndex >= 0 && q.correctIndex <= 3
            ).map(q => ({...q, status: 'verified'})); // Add verified status
        } else {
            throw new Error("Invalid data structure from API");
        }
    } catch (error) {
        console.error("Error generating questions with Gemini API:", error);
        console.log("Falling back to mock questions.");
        return MOCK_QUESTIONS.slice(0, count).map(q => ({...q, status: 'verified'}));
    }
}

export async function getExtendedExplanation(question: Question): Promise<string> {
    if (!API_KEY) return "API key not available. Cannot fetch explanation.";

    const systemPrompt = `You are a helpful encyclopedia. Explain the answer to the following question in Vietnamese.
    - Explain why the correct answer is right.
    - Briefly explain why the other options are plausible but incorrect (distractor analysis).
    - Keep the total explanation between 120 and 180 words.
    - Format the response with clear paragraphs and use bullet points for key facts.`;
    
    const userPrompt = `Question: "${question.question}"
    Choices: A) ${question.choices[0]}, B) ${question.choices[1]}, C) ${question.choices[2]}, D) ${question.choices[3]}
    Correct Answer: ${question.choices[question.correctIndex]}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: { systemInstruction: systemPrompt }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting extended explanation:", error);
        return "Đã xảy ra lỗi khi tạo giải thích chi tiết.";
    }
}

export async function paraphraseQuestion(question: Question): Promise<Partial<Question> | null> {
    if (!API_KEY) return null;

    const schema = {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            choices: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER }
        },
        required: ["question", "choices", "correctIndex"]
    };

    const systemPrompt = `You are a creative quiz writer. Your task is to rephrase a given question and its answer choices while preserving the original meaning, logic, and the single correct answer.
    - The new question must be different but lead to the same correct answer.
    - The original correct answer must be present in the new choices.
    - Generate three new, plausible but incorrect distractors.
    - All text must be in Vietnamese.
    - STRICTLY return a JSON object matching the schema. No extra text.`;

    const userPrompt = `Original Question: "${question.question}"
    Original Choices: ${JSON.stringify(question.choices)}
    Original Correct Answer: "${question.choices[question.correctIndex]}"`;

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error paraphrasing question:", error);
        return null;
    }
}
