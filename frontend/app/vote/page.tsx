"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function VotePage() {
  const [voted, setVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [loading, setLoading] = useState(false);

  const candidates = [
    { id: 1, name: "Team Iron Man", color: "bg-red-600" },
    { id: 2, name: "Team Captain America", color: "bg-blue-600" },
    { id: 3, name: "Team Thor", color: "bg-yellow-600" },
  ];

  const castVote = async (candidateName: string) => {
    setLoading(true);
    try {
      // Send vote to Python
      const response = await axios.post("http://127.0.0.1:5000/cast-vote", {
        candidate: candidateName,
        email: "demo-user" // In a real app, we would pass the actual logged-in email
      });

      if (response.data.success) {
        setSelectedCandidate(candidateName);
        setVoted(true);
      }
    } catch (error) {
      alert("Voting Failed! Server error.");
    }
    setLoading(false);
  };

  if (voted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center animate-fade-in">
        <h1 className="text-6xl font-bold text-green-500 mb-6">✅ VOTE CONFIRMED</h1>
        <p className="text-3xl mb-8">You voted for: <span className="font-bold text-blue-400">{selectedCandidate}</span></p>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center shadow-[0_0_30px_rgba(0,255,0,0.2)]">
          <p className="text-gray-400 mb-2">Blockchain Transaction ID:</p>
          <code className="text-green-400 font-mono">0x{Math.random().toString(16).substr(2, 30)}...</code>
        </div>
        
        <Link href="/" className="mt-12 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-4 tracking-widest text-blue-500">OFFICIAL BALLOT</h1>
      <p className="text-center text-gray-400 mb-12">Select your candidate securely.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-2xl border border-gray-700 hover:border-blue-500">
            
            {/* Candidate Icon/Image Area */}
            <div className={`h-40 ${candidate.color} flex items-center justify-center`}>
              <span className="text-6xl filter drop-shadow-lg">👤</span>
            </div>
            
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6">{candidate.name}</h2>
              <button
                onClick={() => castVote(candidate.name)}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    loading ? "bg-gray-600" : "bg-white text-black hover:bg-blue-500 hover:text-white"
                }`}
              >
                {loading ? "PROCESSING..." : "VOTE NOW"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}