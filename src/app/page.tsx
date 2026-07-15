// This forces Next.js to render this page dynamically on the server for every request,
// ensuring it reads your live Kubernetes environment variables instead of using static build-time fallbacks.
export const dynamic = "force-dynamic";

export default function Home() {
  const appEnv = process.env.APP_ENV || "Development (No Env Set)";
  const dbHost = process.env.DATABASE_HOST || "localhost";
  const apiSecret = process.env.SUPER_SECRET_KEY ? "🔑 Connected & Secured" : "❌ Key Missing";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-md p-6 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
        <h1 className="text-2xl font-bold mb-4 text-sky-400 border-b border-slate-700 pb-2">
          DevOps Next.js Demo
        </h1>
        
        <p className="text-sm text-slate-400 mb-6">
          This application simulates a production frontend reading dynamic server configurations.
        </p>

        <div className="space-y-4">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Current Environment</span>
            <span className="font-semibold text-lg text-emerald-400">{appEnv}</span>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Database Connection Target</span>
            <code className="bg-slate-950 px-2 py-1 rounded text-sm text-amber-300 font-mono block mt-1">
              {dbHost}
            </code>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">API Credential Status</span>
            <span className="font-medium text-sm mt-1 block">{apiSecret}</span>
          </div>
        </div>
      </div>
    </main>
  );
}