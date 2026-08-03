"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react";

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

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
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer select-none">
            {/* Clean Logo Image without border */}
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

            {/* Brand Titles */}
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-primary group-hover:text-primary-dark transition-colors duration-200">
                RIMBA
              </span>
              <span className="text-[10px] font-bold tracking-widest text-text/70 uppercase group-hover:text-primary transition-colors duration-200">
                Remaja Islam Masjid Albarkah
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Text Only Segmented Floating Bar */}
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

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="#kontak"
              className="group/btn relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden gap-2"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-text hover:text-primary bg-background border border-border hover:border-primary/40 transition-all duration-200 focus:outline-none"
              aria-expanded={isOpen}
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-text hover:text-primary hover:bg-background border border-border/50"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                </Link>
              );
            })}
          </nav>
          
          <div className="pt-2 border-t border-border">
            <Link
              href="#kontak"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-5 py-3 text-sm font-bold text-white bg-linear-to-r from-primary to-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all gap-2"
            >
              <span>Hubungi Kami</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
