"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function ResultsPage() {
  // --- SECURITY STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  // --- ELECTION DATA STATE ---
  const [votes, setVotes] = useState({
    "Team Iron Man": 0,
    "Team Captain America": 0,
    "Team Thor": 0
  });
  const [totalVotes, setTotalVotes] = useState(0);

  // Function to handle login
  const handleLogin = () => {
    if (passwordInput === "admin123") { // <--- CHANGE PASSWORD HERE
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("❌ ACCESS DENIED: Incorrect Password");
    }
  };

  // Function to fetch data (Only runs if authenticated)
  const fetchResults = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/");
      setVotes(response.data);
      const total = Object.values(response.data).reduce((a: any, b: any) => a + b, 0) as number;
      setTotalVotes(total);
    } catch (error) {
      console.error("Error fetching results...");
    }
  };

  // Auto-Refresh Loop (Starts only after login)
  useEffect(() => {
    if (isAuthenticated) {
      fetchResults(); 
      const interval = setInterval(fetchResults, 2000); 
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const getColor = (team: string) => {
    if (team.includes("Iron")) return "bg-red-600";
    if (team.includes("Captain")) return "bg-blue-600";
    return "bg-yellow-500";
  };

  // --- 🔒 LOCKED VIEW (LOGIN SCREEN) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-2">TOP SECRET</h1>
          <p className="text-gray-400 mb-8">Admin Access Required</p>

          <input 
            type="password"
            placeholder="Enter Admin Password"
            className="w-full p-4 mb-4 bg-black border border-gray-700 rounded-lg text-white text-center text-xl focus:border-red-500 outline-none transition"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          {error && <p className="text-red-500 font-bold mb-4 animate-pulse">{error}</p>}

          <button 
            onClick={handleLogin}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
          >
            UNLOCK DASHBOARD
          </button>
          
          <Link href="/" className="block mt-6 text-gray-500 text-sm hover:underline">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // --- 🔓 UNLOCKED VIEW (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            LIVE ELECTION RESULTS
          </h1>
          <div className="text-right">
             <span className="block text-sm text-gray-500">TOTAL VOTES CAST</span>
             <span className="text-4xl font-bold text-green-500 animate-pulse">{totalVotes}</span>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(votes).map(([candidate, count]) => {
            const percentage = totalVotes === 0 ? 0 : ((count as number) / totalVotes) * 100;
            return (
              <div key={candidate} className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
                <div className="flex justify-between mb-2">
                  <h2 className="text-2xl font-bold">{candidate}</h2>
                  <span className="text-2xl font-mono text-gray-300">{count} Votes</span>
                </div>
                <div className="w-full bg-gray-700 h-8 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full ${getColor(candidate)} transition-all duration-1000 ease-out flex items-center justify-end px-2`}
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-xs font-bold text-black opacity-75">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
           <button 
             onClick={() => setIsAuthenticated(false)} 
             className="px-6 py-2 border border-gray-600 text-gray-400 rounded-full hover:bg-gray-800 hover:text-white transition"
           >
             🔒 Lock Dashboard
           </button>
        </div>
        
      </div>
    </div>
  );
}