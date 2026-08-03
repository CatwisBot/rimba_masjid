"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";

const NAV_ITEMS = [
  { name: "Beranda", href: "/" },
  { name: "Agenda", href: "/agenda" },
  { name: "Berita", href: "/berita" },
  { name: "Galeri", href: "/galeri" },
  { name: "Tentang", href: "/tentang" },
  { name: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur-md shadow-md shadow-primary/5 border-b border-border py-2.5"
          : "bg-surface border-b border-border/80 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer select-none">
            <div className="relative h-11 md:h-12 w-auto flex items-center justify-center">
              <Image
                src="/RIMBA.png"
                alt="RIMBA Logo"
                width={48}
                height={48}
                quality={100}
                className="h-11 md:h-12 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300 filter drop-shadow-xs"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-primary group-hover:text-primary-dark transition-colors duration-200">
                RIMBA
              </span>
              <span className="text-[10px] font-bold tracking-widest text-text/70 uppercase group-hover:text-primary transition-colors duration-200">
                Remaja Islam Masjid Albarkah
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-background/80 p-1.5 rounded-full border border-border/80 shadow-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 font-bold"
                      : "text-text/80 hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <a
              href="https://wa.me/6281513983136"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 gap-2"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-200" />
            </a>
          </div>

          {/* Mobile Hamburger — Animated Morphing Icon */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-300 focus:outline-none ${
                isOpen
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-background border-border text-text hover:border-primary/40 hover:text-primary"
              }`}
              aria-expanded={isOpen}
              aria-label="Toggle Navigation Menu"
            >
              <div className="w-5 h-3.5 flex flex-col justify-between">
                {/* Top bar */}
                <span
                  className={`block h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                    isOpen ? "rotate-45 translate-y-1.5" : "rotate-0 translate-y-0"
                  }`}
                />
                {/* Middle bar */}
                <span
                  className={`block h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100 w-[75%]"
                  }`}
                />
                {/* Bottom bar */}
                <span
                  className={`block h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                    isOpen ? "-rotate-45 -translate-y-1.5" : "rotate-0 translate-y-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer — Ultra-Smooth CSS Grid Animation */}
      <div
        className={`md:hidden grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 border-b border-border bg-surface shadow-xl"
            : "grid-rows-[0fr] opacity-0 pointer-events-none border-b border-transparent bg-surface"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pt-4 pb-6 flex flex-col items-center">
            {/* Nav Links — compact, centered */}
            <nav className="flex flex-col items-center gap-2 w-full max-w-60">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-text hover:text-primary hover:bg-background border border-border/60"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-white shrink-0" />}
                  </Link>
                );
              })}
            </nav>

            {/* CTA — compact, centered */}
            <div className="pt-3 mt-3 border-t border-border/80 w-full max-w-60 flex justify-center">
              <a
                href="https://wa.me/6281513983136"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-2.5 text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark rounded-full shadow-md shadow-primary/20 hover:shadow-primary/30 hover:brightness-105 transition-all duration-200"
              >
                <span>Hubungi Kami</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
