import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Frontend-only login for now
    localStorage.setItem(
      "mediai_user",
      JSON.stringify({
        email: email,
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to your MediAI account
        </p>

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8">

          {/* Email */}

          <div className="mb-5">

            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Password */}

          <div className="mb-6">

            <label className="block font-semibold mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* Login button */}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        {/* Register */}

        <p className="text-center mt-6">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Home */}

        <p className="text-center mt-4">

          <Link
            to="/"
            className="text-gray-500 hover:text-blue-600"
          >
            ← Back to Home
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;