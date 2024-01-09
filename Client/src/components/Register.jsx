import { useState } from "react";
import axios from "axios";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async  function register(ev) {
   await axios.post("/register", { username, password });
   ev.preventDefault();
  }
  return (
    <div className="bg-red-200 h-screen flex items-center">
      <form className="w-80 mx-auto" onSubmit={register}>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="Username"
          className="block w-full rounded p-2 mb-2 border"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          className="block w-full rounded p-2 mb-2"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
