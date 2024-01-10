import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");
  const { setUsername: setloggedInUsername, setId } = useContext(UserContext);
  async function register(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === "register" ? "/register" : "/login";
    const { data } = await axios.post(url, { username, password });
    setloggedInUsername(username);
    setId(data.id);
    // console.log(username, data.id);
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
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center pt-2">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member?
              <button
                onClick={() => setIsLoginOrRegister("login")}
                className="text-red-500"
              >
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Not a member?
              <button
                onClick={() => setIsLoginOrRegister("register")}
                className="text-red-500"
              >
                Register here
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;
