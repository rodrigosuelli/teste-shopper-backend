import { writeFileSync } from 'fs';

/**
 * Saves a base64 encoded string as a file on disk.
 *
 * @param filePathToSave - Relative path to the project root with file extension, Example: `./temp/myfilename.jpg`.
 * @param base64String - The base64 encoded string representing file data.
 * @throws Will throw an error if the file cannot be written.
 */
export default function saveBase64FileToDisk(
  filePathToSave: string,
  base64String: string
): void {
  try {
    // Decode the base64 string
    const buffer = Buffer.from(base64String, 'base64');

    // Write the buffer to the specified file path
    writeFileSync(filePathToSave, buffer);

    console.log(`File saved successfully at: ${filePathToSave}`);
  } catch (error: unknown) {
    let errorMessage = `Failed to save the file at ${filePathToSave}.`;

    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }

    console.log(errorMessage);
    throw error; // Re-throw the original error to maintain the stack trace
  }
}
