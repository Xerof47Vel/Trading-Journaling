import React from 'react';

const Login = () => {
    const [email,setEmail]=React.useState('');
    const [password,setPassword]=React.useState('');

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("email",email);
        if(!email || !password){
            alert("Please enter email and password")
        }
        else if (email==="zhouvel7@gmail.com")
        {
            return window.location.href="/home"
        }
    }
    return (
        <div>
            <h1 className="text-2xl font-bold text-center mt-10">Login Page</h1>
            <form className="max-w-md mx-auto mt-5">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        on
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                       
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    onClick={handleSubmit}
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;