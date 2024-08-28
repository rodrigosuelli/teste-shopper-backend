import { writeFileSync } from 'fs';

/**
 * Saves an image from a data URI on disk, automatically determining the file extension.
 *
 * @param filePathToSave - Relative path to save the image file without the extension, e.g., `./temp/myimage`.
 * @param dataUri - The data URI containing the base64 encoded string representing the image data.
 * @throws Will throw an error if the file cannot be written or if the data URI is not an image.
 */
export default function saveImageFromDataUri(
  filePathToSave: string,
  dataUri: string
): void {
  try {
    // Extract the MIME type from the data URI
    const mimeTypeMatch = dataUri.match(/^data:(image\/.+?);base64,/);
    if (!mimeTypeMatch) {
      throw new Error(
        'Invalid data URI: The MIME type is not recognized as an image.'
      );
    }

    const mimeType = mimeTypeMatch[1];

    // Determine the file extension based on the MIME type
    const extension = mimeType.split('/')[1];

    // Remove the data URI scheme prefix to get the pure base64 string
    const base64Data = dataUri.replace(/^data:image\/.+?;base64,/, '');

    // Decode the base64 string
    const buffer = Buffer.from(base64Data, 'base64');

    // Construct the full file path with the determined extension
    const fullFilePath = `${filePathToSave}.${extension}`;

    // Write the buffer to the specified file path
    writeFileSync(fullFilePath, buffer);

    console.log(`Image saved successfully at: ${fullFilePath}`);
  } catch (error: unknown) {
    let errorMessage = `Failed to save the image at ${filePathToSave}.`;

    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }

    console.log(errorMessage);
    throw error; // Re-throw the original error to maintain the stack trace
  }
}
