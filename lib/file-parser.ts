export const getTextFromFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (const byte of uint8Array) {
    binary += String.fromCharCode(byte);
  }
  const content_base64 = btoa(binary);

  const resp = await fetch('http://localhost:8080/extract', {
    method: 'POST',
    body: JSON.stringify({
      filename: file.name,
      content_base64,
    }),
  });

  if (!resp.ok) {
    return { success: false, text: 'Не удалось извлечь текст из файла' };
  }

  const data = (await resp.json()) as { success: boolean; text: string };

  return data;
};
