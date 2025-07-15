"use server";
import { GoogleGenAI } from "@google/genai";

function prompt_response_validation(response: any, numberOfOptions: number): boolean {
    return (
        typeof response === 'object' &&
        Array.isArray(response.options) &&
        response.options.length === numberOfOptions &&
        typeof response.answer === 'string'
    );
}

export async function ai(
    prompt: string,
    numberOfOptions: number,
    retries = 3
): Promise<{ options: string[]; answer: string } | null> {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
        console.error("Missing API key");
        return null;
    }

    const aiClient = new GoogleGenAI({ apiKey });

    try {
        const response = await aiClient.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `
                You are a creative options generator for multiple choice questions.
                You will be given a question and you will generate very creative options for the question and one of them has to be the answer. If you realize it's a math question, you must write "recheck result for verification" after each of the options.
                You will generate the options in the same language as the question, response with just a text so that I can parse the text to json, has options and answer, two keys, options is an array of strings and answer is a string, nothing more, nothing less and no descriptions at all.
                The response has to be strictly stringified json.
                The question:
                ${prompt}
                the number of options (important):
                ${numberOfOptions}
                Please check twice if the number of options is equal to the number of options you generated.
                `,
        });

        const text = response.text ?? '';
        let parseResponse;

        try {
            parseResponse = JSON.parse(text);
        } catch (error) {
            console.warn("Failed to parse response JSON", error);
            if (retries > 0) return ai(prompt, numberOfOptions, retries - 1);
            return null;
        }

        if (!prompt_response_validation(parseResponse, numberOfOptions)) {
            if (retries > 0) return ai(prompt, numberOfOptions, retries - 1);
            return null;
        }

        return parseResponse;

    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}