import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import { loginUser } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      console.log("Logging in with", { email, password });
      const res = await loginUser({ email, password });
      console.log(res.data);
      const token = res.data.token;
      localStorage.setItem("token", token);

      // extract payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.roles[0];
      const userId = payload.id;
      if (role === "ADMIN") {
        navigate("/dashboard");
        return;
      }
      if (role === "SUPPLIER") {
        navigate(`/dashboard?user=${userId}`);
        return;
      }
      if (role === "FUNDER") {
        navigate(`/dashboard?user=${userId}`);
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login Failed");
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen min-w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex">

      {/* LEFT SECTION */}
      <div className="flex flex-col justify-center px-16 w-1/2">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <br /> Nexus Platform
        </h1>
        <p className="text-lg opacity-90 mb-6">
          Connect with suppliers, funders, and investors in one unified platform.
        </p>
        <p>🔐 Secure & Reliable ⚡ Fast Integration</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex justify-center items-center w-1/2 p-6">
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full max-w-md p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-semibold mb-1">Sign In</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Welcome back! Please sign in.</p>

          <InputField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button
            onClick={submit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700"
          >
            Sign In
          </button>

          <p className="text-center mt-6 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">Sign up</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
