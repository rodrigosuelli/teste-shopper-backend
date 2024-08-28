export default function parseDataURI(dataURI: string) {
  // Split the Data URI at the comma to separate metadata and base64 data
  const [meta, base64String] = dataURI.split(',');

  // Extract the MIME type from the meta portion (e.g., "data:image/png;base64")
  const mimeType = meta.split(':')[1].split(';')[0];

  return { mimeType, base64String };
}
