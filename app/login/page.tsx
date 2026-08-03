"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { loginUser } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string>("HUMAS");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await loginUser(email, password);
      setIsLoading(false);

      if (res.success && res.user) {
        const role = res.user.role;
        setUserRole(role);
        if (typeof window !== "undefined") {
          localStorage.setItem("rimba_admin_role", role);
        }
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 800);
      } else {
        setErrorMessage(res.error || "Login gagal. Silakan periksa email dan kata sandi Anda.");
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Terjadi kesalahan koneksi database.");
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header Identity */}
        <div className="text-center flex flex-col items-center">
          <div className="relative h-16 w-auto mb-4 flex items-center justify-center">
            <Image
              src="/RIMBA.png"
              alt="RIMBA Logo"
              width={64}
              height={64}
              quality={100}
              className="h-16 w-auto object-contain filter drop-shadow-sm"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-extrabold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Portal Admin & Pengurus</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
            Masuk ke Dashboard RIMBA
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-text/75 max-w-sm leading-relaxed">
            Masukkan email dan kata sandi akun Anda untuk mengakses fitur pengurus.
          </p>
        </div>

        {/* Login Form Container Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-surface border border-border/80 py-8 px-6 sm:px-10 shadow-xl rounded-3xl relative">
            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-text">Login Berhasil!</h3>
                <p className="text-xs sm:text-sm text-text/75 leading-relaxed">
                  Selamat datang! Anda masuk sebagai akun{" "}
                  <strong className="text-primary font-black">{userRole}</strong>.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-2xl shadow-md transition-all"
                  >
                    <span>Masuk ke Dashboard Sekarang</span>
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Username / Email */}
                <div>
                  <label className="block text-xs font-bold text-text mb-1.5">
                    Email / Username Admin *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/50">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="humas@rimba.or.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-text">
                      Kata Sandi *
                    </label>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Silakan hubungi Sekretariat / Admin Utama untuk reset kata sandi Anda.");
                      }}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Lupa sandi?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text/50">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-background border border-border/80 focus:outline-none focus:border-primary text-text transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text/50 hover:text-text cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-primary border-border focus:ring-primary accent-primary cursor-pointer"
                    />
                    <span className="text-xs text-text/80 font-medium">Ingat saya di perangkat ini</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-accent" />
                      <span>Masuk Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Copyright Text */}
          <p className="text-center text-[11px] text-text/50 mt-6">
            &copy; 2026 Remaja Islam Masjid Albarkah (RIMBA). All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
