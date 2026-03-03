import { useState } from "react";
import apiRequest from "../utils/apiRequest";
import useAuthStore from "../utils/authStore";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const data = isRegister
      ? {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }
      : { email: formData.email, password: formData.password };

    try {
      const res = await apiRequest.post(
        `/user/${isRegister ? "register" : "login"}`,
        data,
      );

      setCurrentUser(res.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center  px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-blue-500">
          {isRegister ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          {isRegister
            ? "Sign up to start booking amazing stays"
            : "Sign in to continue"}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {isRegister && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              placeholder="Enter your username"
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg"
        >
          {isRegister ? "Create Account" : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-600">
        {isRegister
          ? "Already have an account?"
          : "Don't have an account?"}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="ml-2 font-medium text-blue-500 hover:underline"
        >
          {isRegister ? "Sign In" : "Create one"}
        </button>
      </div>
    </div>
  </div>
);
};

export default AuthPage;
