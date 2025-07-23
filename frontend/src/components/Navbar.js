import { useNavigate } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white p-8 flex justify-between items-center">
      <div>
        <h2 className="text-lg  font-semibold">File Transfer</h2>
        {user && (
          <p className="text-sm text-gray-300">{user.name} ({user.email})</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
