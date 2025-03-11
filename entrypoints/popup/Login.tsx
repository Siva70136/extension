import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth/web-extension";
import { auth } from "./fireBaseConfig";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(true);
  const [username, setUsername] = useState("");
  const [password2, setPassword2] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  //console.log(auth);
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, "123456")
      .then(async (userCredential) => {
        // Signed in
        console.log("Signed in");
        const user: any = userCredential.user;
        await storage.setItem("local:token", user?.accessToken);
        navigate("/home");
        //console.log(user);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  const handleUser = async (event: any) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, username, password2)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);
        setShow(true);
      })
      .catch((error) => {
        console.error("Error creating user:", error.code, error.message);
      });
  };

  return (
    <div className="flex  flex-col justify-center w-64">
      <div className="flex justify-center gap-x-3 mb-3">
        <div>
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={() => setShow(true)}
          >
            Sign in
          </button>
        </div>
        <div>
          <button
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={() => setShow(false)}
          >
            Sign Up
          </button>
        </div>
      </div>
      {show ? (
        <div className="flex flex-col gap-y-4 ">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded focus:outline-none border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded focus:outline-none border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={handleLogin}
          >
            Sign in
          </button>
        </div>
      ) : (
        <form className="flex flex-col gap-y-4">
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-2 rounded focus:outline-none border"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded focus:outline-none border"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded focus:outline-none border"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
            onClick={(e) => handleUser(e)}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
