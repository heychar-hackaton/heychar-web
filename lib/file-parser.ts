const EXTRACT_BASE_URL = 'http://localhost:8080';
const EXTRACT_ERROR_TEXT = 'Не удалось извлечь текст из файла';

type ExtractItem = { filename: string; success: boolean; text: string };

const encodeFileToPayload = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (const byte of uint8Array) {
    binary += String.fromCharCode(byte);
  }
  const content_base64 = btoa(binary);
  return { filename: file.name, content_base64 };
};

export const getTextFromFile = async (file: File) => {
  const payload = await encodeFileToPayload(file);

  const resp = await fetch(`${EXTRACT_BASE_URL}/extract`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    return { success: false, text: EXTRACT_ERROR_TEXT };
  }

  const data = (await resp.json()) as { success: boolean; text: string };
  return data;
};

export const getTextFromFiles = async (
  files: File[]
): Promise<ExtractItem[]> => {
  if (!files || files.length === 0) {
    return [];
  }

  const payload = await Promise.all(
    files.map((file) => encodeFileToPayload(file))
  );

  const resp = await fetch(`${EXTRACT_BASE_URL}/extract/batch`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    return files.map((file) => ({
      filename: file.name,
      success: false,
      text: EXTRACT_ERROR_TEXT,
    }));
  }

  const data = (await resp.json()) as ExtractItem[];
  return data;
};
