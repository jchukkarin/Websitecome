'use client';

import { useRef } from 'react';

export default function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fileInputRef.current?.files?.length) {
      alert("Please select a file first.");
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Make a POST request to your API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        // Optional: clear the input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during upload.');
    }
  };

  return (
    <form onSubmit={uploadFile} className="flex flex-col gap-4">
      <label className="block">
        <span className="text-gray-700">Upload a file</span>
        <input
          type="file"
          name="file"
          ref={fileInputRef}
          className="mt-1 block w-full"
          required
        />
      </label>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Upload
      </button>
    </form>
  );
}
