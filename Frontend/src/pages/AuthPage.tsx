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

      // console.log(res.data.user);
      setCurrentUser(res.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 hover:underline ml-1"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
