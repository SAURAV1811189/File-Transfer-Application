export default function UserList({ users }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-teal-400">Online Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-400">No other users are online.</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 rounded-md flex items-center shadow-md"
            >
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium text-white">{user}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}