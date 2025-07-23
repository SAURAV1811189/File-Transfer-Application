import React from "react";

export default function Footbar() {
  return (
    <footer className="bg-white shadow-md mt-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()}File Transfer Application.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 text-bold text-blue-600 transition">
            GitHub
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition text-blue-700">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
