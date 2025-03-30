import { useCallback, useState, useRef } from "react";
import { Button, Progress } from "@heroui/react";
import { FaDownload, FaTrash, FaFile, FaCloudUploadAlt } from "react-icons/fa";

interface FileUploadProps {
  existingFiles?: string[];
  isNew?: boolean;
  onFileChange: (files: File[]) => void;
  onExistingFileRemove: (fileUrl: string) => void;
  onNewFileRemove: (file: File) => void;
}

interface FileProgress {
  file: File;
  progress: number;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export function FileUpload({
  existingFiles = [],
  isNew = false,
  onFileChange,
  onExistingFileRemove,
  onNewFileRemove,
}: FileUploadProps) {
  const [newFiles, setNewFiles] = useState<FileProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (files: File[]) => {
      const fileProgresses = files.map((file) => ({
        file,
        progress: 0,
      }));
      setNewFiles((prev) => [...prev, ...fileProgresses]);
      onFileChange(files);

      // Simulate upload progress
      fileProgresses.forEach((fp) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 100) {
            setNewFiles((prev) =>
              prev.map((item) =>
                item.file === fp.file ? { ...item, progress } : item
              )
            );
          } else {
            clearInterval(interval);
          }
        }, 200);
      });
    },
    [onFileChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFileChange(files);
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const getFileNameFromUrl = (url: string) => {
    try {
      const segments = url.split("/");
      return segments[segments.length - 1];
    } catch (error) {
      console.error("Error getting file name from url:", error);
      return "Unknown File";
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = getFileNameFromUrl(url);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-brand-green-dark bg-brand-green-light/10"
            : "border-gray-300 hover:border-brand-green-dark/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            handleFileChange(files);
          }}
        />
        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Supported file types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
        </p>
      </div>

      <div className="space-y-2">
        {/* Existing Files (URLs) - Only show in edit mode */}
        {!isNew && existingFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Existing Files</p>
            {existingFiles.map((fileUrl, index) => (
              <div
                key={`existing-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FaFile className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate">
                    {getFileNameFromUrl(fileUrl)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => handleDownload(fileUrl)}
                  >
                    <FaDownload className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => onExistingFileRemove(fileUrl)}
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Files */}
        {newFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">New Files</p>
            {newFiles.map(({ file, progress }) => (
              <div
                key={file.name}
                className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FaFile className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">
                      {file.name} ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => {
                      setNewFiles((prev) =>
                        prev.filter((item) => item.file !== file)
                      );
                      onNewFileRemove(file);
                    }}
                  >
                    <FaTrash className="h-4 w-4" />
                  </Button>
                </div>
                <Progress
                  aria-label="Upload progress"
                  value={progress}
                  className="max-w-md"
                  size="sm"
                  color="success"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
