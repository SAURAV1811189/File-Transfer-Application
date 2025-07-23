import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FiUpload, FiLogOut, FiUser } from "react-icons/fi";

let socket;

export default function Home({ user, setUser }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    socket = io("http://localhost:5000", {
      auth: { token },
    });

    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
      });

    return () => {
      socket.disconnect();
    };
  }, []);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };

 
  const handleUpload = () => {
    if (!file || !socket) return;

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;
      const chunkSize = 1024 * 100;
      const totalChunks = Math.ceil(fileData.length / chunkSize);
      let currentChunk = 0;

      setUploading(true);

      const sendNextChunk = () => {
        const start = currentChunk * chunkSize;
        const end = start + chunkSize;
        const chunk = fileData.slice(start, end);

        socket.emit("file-chunk", {
          fileName: file.name,
          chunk,
          isLast: currentChunk + 1 === totalChunks,
        });

        currentChunk++;
        const progressPercent = Math.floor((currentChunk / totalChunks) * 100);
        setProgress(progressPercent);

        if (currentChunk < totalChunks) {
          setTimeout(sendNextChunk, 50);
        } else {
          setUploading(false);
        }
      };

      sendNextChunk();
    };

    reader.readAsDataURL(file);
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center gap-2">
            <FiUser className="text-xl text-blue-900" />
            <h1 className="text-xl font-bold text-blue-800">
              Share me, {user?.name}
            </h1>
          </div>
         
        </div>

        {/* Email */}
        <p className="text-sm text-blue-600 text-xl mb-6">
          <span className="font-semibold">Email:</span> {user?.email}
        </p>

        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition"
          />
        </div>

       
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-50"
        >
          <FiUpload />
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        
        {uploading && (
          <div className="mt-4 w-full bg-gray-300 h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

       
        {progress === 100 && !uploading && (
          <p className="mt-4 text-green-600 font-medium">
            ✅ File uploaded successfully!
          </p>
        )}
      </div>
    </div>
  );
}
