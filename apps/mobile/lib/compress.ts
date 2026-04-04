import * as ImageManipulator from 'expo-image-manipulator';

const MAX_SIZE_KB = 500;

export async function compressImage(uri: string, quality = 0.6): Promise<string> {
  // First pass: compress with target quality
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }], // max 1200px wide
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
  );

  return result.uri;
}
