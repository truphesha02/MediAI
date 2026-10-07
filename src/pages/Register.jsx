import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );

      if (response.data.success) {
        setSuccess(
          "Account created successfully! Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Registration failed."
        );
      } else {
        setError(
          "Cannot connect to the MediAI backend. Make sure Flask is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-6">

      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">

        {/* Heading */}

        <h1 className="text-4xl font-bold text-center text-blue-700">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create your MediAI account
        </p>


        {/* Error */}

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}


        {/* Success */}

        {success && (
          <div className="mt-6 bg-green-100 text-green-700 p-3 rounded-lg">
            {success}
          </div>
        )}


        {/* Form */}

        <form
          onSubmit={handleRegister}
          className="mt-8"
        >

          {/* Name */}

          <div className="mb-5">

            <label className="block font-semibold mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* Email */}

          <div className="mb-5">

            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Create your password"
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


          {/* Register */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </form>


        {/* Login */}

        <p className="text-center mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
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

export default Register;