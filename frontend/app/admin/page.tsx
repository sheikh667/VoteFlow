"use client";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Link from "next/link";

export default function AdminPage() {
  const webcamRef = useRef<Webcam>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Idle");
  const [message, setMessage] = useState("Enter email and scan face to register");

  const registerUser = useCallback(async () => {
    if (!webcamRef.current || !email) {
        setMessage("Please enter an email first!");
        return;
    }

    setStatus("Scanning");
    setMessage("Processing biometric data...");

    const imageSrc = webcamRef.current.getScreenshot();

    try {
      // Send Face + Email to Python
      const response = await axios.post("http://127.0.0.1:5000/register", {
        email: email,
        image: imageSrc,
      });

      if (response.data.success) {
        setStatus("Success");
        setMessage("REGISTRATION COMPLETE. You can now vote.");
      } else {
        setStatus("Error");
        setMessage("Registration Failed: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error");
      setMessage("Server Error. Is Python running?");
    }
  }, [webcamRef, email]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-5 left-5 text-gray-400 hover:text-white">
        ← Back Home
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-green-500">ADMIN: VOTER REGISTRATION</h1>

      {/* Input Field for Name/Email */}
      <input
        type="email"
        placeholder="Enter Voter Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-6 p-3 w-80 rounded text-black font-bold text-center"
      />

      <div className="relative border-4 border-green-700 rounded-xl overflow-hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-[640px] h-[480px] object-cover"
        />
      </div>

      <div className={`mt-6 p-4 rounded-lg text-lg font-semibold border ${
        status === "Success" ? "bg-green-800 border-green-400" : "bg-gray-800 border-gray-600"
      }`}>
        {message}
      </div>

      <button
        onClick={registerUser}
        disabled={status === "Scanning"}
        className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all"
      >
        {status === "Scanning" ? "Registering..." : "REGISTER NEW VOTER"}
      </button>

      {/* --- NEW BUTTON: Link to Results --- */}
      <div className="mt-12 pt-8 border-t border-gray-800 w-full max-w-2xl text-center">
        <p className="text-gray-500 mb-4 text-sm">ELECTION MONITORING</p>
        <Link 
            href="/results"
            className="inline-block px-8 py-3 border border-red-600 text-red-500 font-bold rounded-full hover:bg-red-900/30 transition-all"
        >
            📊 VIEW LIVE RESULTS (LOCKED)
        </Link>
      </div>

    </div>
  );
}