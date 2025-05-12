import { useState } from "react";

import { auth } from "../../Firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const signUp = async (event) => {
    event.preventDefault();
    console.log("Sign up clicked", email, password);
    console.log(auth);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
     
    } catch (error) {
      console.log("Signup error", error.message);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      console.log("User logged in:", userCredential.user);
      console.log("Token:", token);
       window.location.href = "/home";
      return;
    } catch (error) {
      console.log("Login error", error.message);
    }
  };

 

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
       
        <form >
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
         <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={signUp}>Sign Up</button>
      <button className="bg-green-500 text-white px-4 py-2 mt-2 ml-2" onClick={login}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
