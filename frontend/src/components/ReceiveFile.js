import { useEffect, useState } from "react";
import { getSocket } from "../utils/socket";

export default function ReceiveFile() {
  const [receivedFiles, setReceivedFiles] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceive = ({ sender, fileName, fileBuffer }) => {
      const blob = new Blob([fileBuffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);

      setReceivedFiles((prev) => [
        { sender, fileName, url, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);

      // Optional: Show a notification
      alert(`📥 New file from ${sender}: ${fileName}`);
    };

    socket.on("receive-file", handleReceive);

    return () => {
      socket.off("receive-file", handleReceive);
    };
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-teal-400">Received Files</h2>
      {receivedFiles.length === 0 ? (
        <p className="text-gray-400">No files received yet.</p>
      ) : (
        <ul className="space-y-3">
          {receivedFiles.map((file, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 rounded-md flex items-center justify-between shadow-md"
            >
              <div>
                <p className="font-medium text-white truncate w-48 sm:w-64">
                  {file.fileName}
                </p>
                <p className="text-sm text-gray-400">
                  From: {file.sender} - {file.time}
                </p>
              </div>
              <a
                href={file.url}
                download={file.fileName}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-transform transform hover:scale-105"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
