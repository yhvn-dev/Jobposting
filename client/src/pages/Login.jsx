// client/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, verifyLoginCode, resendVerification } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // verification modal state
  const [showModal, setShowModal] = useState(false);
  const [loginToken, setLoginToken] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setInfoMessage("");

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await window.grecaptcha.execute(
        "6LdUaQUsAAAAAFJ9t5eJXxEz7om9-eE-IArAD84K",
        { action: "login" }
      );

      const response = await login(
        formData.email,
        formData.password,
        recaptchaToken
      );

      if (response.verificationRequired) {
        // show modal and keep loginToken
        setLoginToken(response.loginToken);
        setShowModal(true);
        setInfoMessage("A verification code was sent to your email.");
      } else {
        // If server returns token directly (fallback), save and redirect
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const response = await verifyLoginCode(loginToken, codeInput);
      // on success get token + user
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setShowModal(false);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid code. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!loginToken) return;
    setResendLoading(true);
    setError("");
    setInfoMessage("");

    try {
      await resendVerification(loginToken);
      setInfoMessage("Verification code resent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {infoMessage && (
          <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded mb-4">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => {}}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
            <h3 className="text-xl font-semibold mb-4">Email Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code we sent to your email.
            </p>

            <form onSubmit={handleVerify}>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                maxLength={6}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500 text-center tracking-widest text-lg"
                placeholder="123456"
              />

              <div className="flex items-center justify-between gap-2">
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  {verifying ? "Verifying..." : "Verify"}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded hover:bg-gray-300 disabled:opacity-60"
                >
                  {resendLoading ? "Sending..." : "Resend"}
                </button>
              </div>
            </form>

            <div className="mt-3 text-sm text-gray-500">
              <button
                type="button"
                onClick={() => {
                  // allow user to cancel verification -> clear token + modal
                  setShowModal(false);
                  setLoginToken("");
                  setCodeInput("");
                }}
                className="underline text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
