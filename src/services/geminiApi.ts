import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  GoogleAIFileManager,
  UploadFileResponse,
} from '@google/generative-ai/server';

const { GEMINI_API_KEY } = process.env;

if (!GEMINI_API_KEY) {
  throw new Error(
    'Error: `GEMINI_API_KEY` environment variable is not defined'
  );
}

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  // Choose a Gemini model.
  model: 'gemini-1.5-pro',
});

export async function uploadImageFile(
  filePathWithExtension: string,
  mimeType: string,
  displayName: string
) {
  // Upload the file and specify a display name.
  const uploadResponse = await fileManager.uploadFile(filePathWithExtension, {
    mimeType,
    displayName,
  });

  // View the response.
  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );

  return uploadResponse;
}

export async function promptWithUploadedImage(
  uploadFileResponse: UploadFileResponse,
  promptText: string
) {
  // Generate content using text and the URI reference for the uploaded file.
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadFileResponse.file.mimeType,
        fileUri: uploadFileResponse.file.uri,
      },
    },
    { text: promptText },
  ]);

  // Output the generated text to the console
  console.log(result.response.text());
}
