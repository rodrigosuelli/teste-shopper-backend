import { GoogleGenerativeAI } from '@google/generative-ai';

const { GEMINI_API_KEY } = process.env;

if (!GEMINI_API_KEY) {
  throw new Error(
    'Error: `GEMINI_API_KEY` environment variable is not defined'
  );
}

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: 'gemini-1.5-flash',
});

export async function promptWithBase64Image(
  mimeType: string,
  base64String: string,
  promptText: string
) {
  // Generate content using text and the URI reference for the uploaded file.
  const result = await model.generateContent([
    { text: promptText },
    {
      inlineData: {
        data: base64String,
        mimeType,
      },
    },
  ]);

  // Output the generated text to the console
  console.log(result.response.text());

  return result;
}
