"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

     const data = await res.json();

if (data.status === "success") {
  localStorage.setItem("role", data.role);
  document.cookie =
  `role=${data.role}; path=/`
  localStorage.setItem("user_id", data.user.id);
  localStorage.setItem("user_name", data.user.name);
  localStorage.setItem("user_email", data.user.email);

  router.push("/");
} else {
  alert("Login gagal");
}
    } catch (err) {
      alert("Terjadi error server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary mb-3">
            <Wallet className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            CashFlow Login
          </h2>
          <p className="text-sm text-muted-foreground">
            Masuk ke sistem manajemen
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}