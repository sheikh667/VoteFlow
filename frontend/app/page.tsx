import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-black text-white p-5">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          VoteFlow AI
        </h1>
        <p className="text-xl text-gray-300">
          The Next-Gen Secure Voting System Powered by <span className="text-blue-400 font-bold">Face Recognition</span>.
        </p>
        
        <div className="flex gap-6 justify-center mt-8">
          <Link
            href="/login"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-blue-500/50"
          >
            Voter Login
          </Link>

          <Link
            href="/admin"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-lg border border-gray-600 transition-all"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </main>
  );
}