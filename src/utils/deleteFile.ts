import { unlinkSync } from 'fs';

/**
 * Deletes a file at the given path.
 *
 * @param filePath - Relative path to the project root with file extension, e.g., `temp/myfilename.jpg`.
 */
export default function deleteFile(filePath: string): void {
  try {
    unlinkSync(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`Failed to delete file at ${filePath}: ${error.message}`);
    } else {
      console.log(`Unknown error occurred while deleting file at ${filePath}`);
    }
  }
}
