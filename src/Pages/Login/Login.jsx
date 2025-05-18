import { useState } from "react";
import { auth } from "../../Firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  updateProfile
} from "firebase/auth";

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
 
  const signUp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Update profile with name
      if (name) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
      
      console.log("User signed up:", userCredential.user);
      window.location.href = "/home";
    } catch (error) {
      console.log("Signup error", error.message);
      setError(error.message.includes("auth/email-already-in-use") 
        ? "This email is already registered. Please try logging in instead." 
        : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    
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
    } catch (error) {
      console.log("Login error", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      window.location.href = "/home";
    } catch (error) {
      console.log("Google sign-in error", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth, provider);
      console.log("Apple sign-in successful:", result.user);
      window.location.href = "/home";
    } catch (error) {
      console.log("Apple sign-in error", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {isLoginMode 
            ? "Sign in to your account to continue" 
            : "Fill out the form to create your account"}
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4 mb-8">
          <button 
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3 px-4 bg-white text-gray-800 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
          
          <button 
            onClick={signInWithApple}
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3 px-4 bg-black text-white rounded-lg shadow-sm hover:bg-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.066 1.013 1.455 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
            </svg>
            Continue with Apple
          </button>
        </div>
        
        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <div className="px-4 text-sm text-gray-500">
            Or {isLoginMode ? "sign in with email" : "sign up with email"}
          </div>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        <form className="space-y-6">
          {!isLoginMode && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 font-medium">Password</label>
              {isLoginMode && (
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              )}
            </div>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {!isLoginMode && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long.
              </p>
            )}
          </div>
          
          {!isLoginMode && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          <button 
            onClick={isLoginMode ? login : signUp}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading 
              ? (isLoginMode ? 'Signing in...' : 'Creating account...') 
              : (isLoginMode ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            {isLoginMode 
              ? "Don't have an account?" 
              : "Already have an account?"}
            <button 
              onClick={toggleAuthMode}
              className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLoginMode ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        
        <p className="text-center text-gray-600 mt-6 text-sm">
          By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;