'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type GenerateOkData = {
  result: {
    alternatives: { message: { text: string } }[];
  };
};

type GenerateResponse = {
  success: boolean;
  text: string;
  // For success=false, data can be string|null; for success=true, we expect GenerateOkData
  data: unknown;
};

export const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  'text/rtf',
] as const;

export const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.rtf', '.txt'] as const;

const buildAcceptString = (
  extensions: readonly string[],
  mimeTypes: readonly string[]
) => {
  return [...extensions, ...mimeTypes].join(',');
};

const isFileTypeAccepted = (
  file: File,
  extensions: readonly string[],
  mimeTypes: readonly string[]
) => {
  const byMime = file.type
    ? (mimeTypes as readonly string[]).includes(file.type)
    : false;
  if (byMime) {
    return true;
  }
  const filename = file.name.toLowerCase();
  return extensions.some((ext) => filename.endsWith(ext));
};

type UseAIFileImportOptions<TParsed> = {
  generate: (formData: FormData) => Promise<GenerateResponse>;
  mapMessageToData: (messageText: string) => TParsed;
  onSuccess: (data: TParsed) => void;
  unsupportedTypeMessage?: string;
  generalErrorMessage?: string;
  extensions?: readonly string[];
  mimeTypes?: readonly string[];
};

export const useAIFileImport = <TParsed>(
  options: UseAIFileImportOptions<TParsed>
) => {
  const {
    generate,
    mapMessageToData,
    onSuccess,
    unsupportedTypeMessage = 'Неподдерживаемый тип файла. Допустимо: PDF, DOCX, RTF, TXT',
    generalErrorMessage = 'Не удалось обработать файл',
    extensions = ACCEPTED_EXTENSIONS,
    mimeTypes = ACCEPTED_MIME_TYPES,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const acceptString = useMemo(
    () => buildAcceptString(extensions, mimeTypes),
    [extensions, mimeTypes]
  );

  const processFile = useCallback(
    async (file: File) => {
      if (!isFileTypeAccepted(file, extensions, mimeTypes)) {
        toast.error(unsupportedTypeMessage, { position: 'top-center' });
        return;
      }
      setIsLoading(true);
      try {
        const fd = new FormData();
        fd.set('file', file);
        const result = await generate(fd);

        if (!result.success) {
          toast.error(result.text, { position: 'top-center' });
          return;
        }

        const okData = result.data as GenerateOkData;
        const messageText =
          okData?.result?.alternatives?.[0]?.message?.text ?? '';

        try {
          const parsed = mapMessageToData(messageText);
          onSuccess(parsed);
        } catch {
          toast.error(generalErrorMessage, {
            position: 'top-center',
          });
        }
      } catch {
        toast.error(generalErrorMessage, { position: 'top-center' });
      } finally {
        setIsLoading(false);
      }
    },
    [
      extensions,
      generalErrorMessage,
      generate,
      mapMessageToData,
      mimeTypes,
      onSuccess,
      unsupportedTypeMessage,
    ]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      await processFile(file);
      e.target.value = '';
    },
    [processFile]
  );

  const handleOpenFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileDrop = useCallback(
    (file: File) => {
      // Intentionally not awaited to keep UI responsive; errors handled inside
      processFile(file);
    },
    [processFile]
  );

  return {
    isLoading,
    fileInputRef,
    acceptString,
    handleFileChange,
    handleOpenFileDialog,
    handleFileDrop,
  };
};
