"use client";
import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <--- NEW IMPORT

export default function LoginPage() {
  const router = useRouter(); // <--- Initialize Router
  const webcamRef = useRef<Webcam>(null);
  const [status, setStatus] = useState("Idle"); 
  const [message, setMessage] = useState("Align your face within the frame");

  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current) return;

    setStatus("Scanning");
    setMessage("Scanning biometric data...");

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setStatus("Error");
      setMessage("Camera failed. Please refresh.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/verify-face", {
        image: imageSrc,
      });

      if (response.data.verified) {
        setStatus("Success");
        setMessage(`Welcome, ${response.data.email}! Redirecting...`);
        
        // <--- THE MAGIC REDIRECT LINE
        setTimeout(() => {
            router.push('/vote');
        }, 1500); // Wait 1.5 seconds so you can see the success message
        
      } else {
        setStatus("Error");
        setMessage("Access Denied. Face not recognized.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error");
      setMessage("Server connection failed.");
    }
  }, [webcamRef, router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-5 left-5 text-blue-400 hover:text-blue-300">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-blue-500 tracking-widest">
        BIOMETRIC LOGIN
      </h1>

      <div className="relative border-4 border-blue-900 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,255,0.3)]">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-[640px] h-[480px] object-cover"
        />
        <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/30 rounded-xl">
          <div className="w-full h-1 bg-blue-500/50 absolute top-0 animate-scan"></div>
        </div>
      </div>

      <div className={`mt-6 p-4 rounded-lg text-lg font-semibold border ${
        status === "Success" ? "bg-green-900/50 border-green-500 text-green-200" :
        status === "Error" ? "bg-red-900/50 border-red-500 text-red-200" :
        "bg-gray-900 border-gray-700 text-blue-200"
      }`}>
        {message}
      </div>

      <button
        onClick={captureAndVerify}
        disabled={status === "Scanning" || status === "Success"}
        className={`mt-8 px-8 py-3 rounded-full font-bold text-lg transition-all ${
          status === "Scanning" 
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
        }`}
      >
        {status === "Scanning" ? "Verifying..." : "SCAN FACE"}
      </button>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}