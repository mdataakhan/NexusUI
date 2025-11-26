import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import RoleSelector from "../../components/RoleSelector";
import { registerUser } from "../../api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SUPPLIER");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await registerUser({
        name,
        email,
        password,
        roles: [role]
      });

      alert("Account created successfully!");
      navigate("/"); // redirect to login
    } catch {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen min-w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex">

      {/* LEFT SECTION - Signup Form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-8">
        <div className="bg-white text-gray-900 w-full max-w-md p-10 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">
            Join Nexus by creating your free account.
          </p>

          <InputField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-gray-700 mt-4 mb-2 font-medium">Select Role</p>

          <RoleSelector selected={role} onSelect={setRole} />

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link className="text-blue-600 font-medium" to="/">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SECTION - Welcome Banner */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2">
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Start Your <br /> Nexus Journey
        </h1>

        <p className="text-lg opacity-90 mb-8 max-w-md">
          Create your account and become part of the most trusted supplier–funder–investor ecosystem.
        </p>

        <div className="flex gap-6 text-sm opacity-90">
          <span>🚀 Quick Signup</span>
          <span>🔐 Secure Platform</span>
        </div>
      </div>
    </div>
  );
}
