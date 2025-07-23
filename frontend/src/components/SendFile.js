import { useState } from "react";
import { getSocket } from "../utils/socket";

export default function SendFile() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("File selected:", selectedFile);
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      setFile(null);
    } else {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSend = () => {
    console.log("handleSend triggered");
    console.log("Recipient:", recipient);
    console.log("File:", file);

    if (!file || !recipient) {
      setError("Please select a file and a recipient.");
      return;
    }

    try {
      const socket = getSocket();

      const reader = new FileReader();
      reader.onload = () => {
        const fileBuffer = reader.result;
        socket.emit("send-file", {
          recipient,
          fileName: file.name,
          fileBuffer,
        });
      };

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setProgress(percent);
        }
      };

      reader.onloadend = () => {
        setProgress(100);
        setTimeout(() => setProgress(0), 2000); 
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-teal-400">Send a File</h2>

      {error && (
        <p className="bg-red-500/20 text-red-400 p-3 mb-4 rounded-md">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Recipient's Name"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <input
          type="file"
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
          onChange={handleFileChange}
        />

        <button
          className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-transform transform hover:scale-105 disabled:bg-gray-500"
          onClick={handleSend}
          disabled={!file || !recipient || progress > 0}
        >
          {progress > 0 ? `Sending... ${progress}%` : "Send File"}
        </button>
      </div>

      {progress > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
          <div
            className="bg-teal-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
