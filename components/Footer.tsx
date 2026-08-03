"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

const QUICK_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Agenda", href: "/agenda" },
  { name: "Berita", href: "/berita" },
  { name: "Galeri", href: "/galeri" },
  { name: "Struktur", href: "/struktur" },
  { name: "Kontak", href: "/kontak" },
];

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
  { name: "WhatsApp", href: "https://wa.me/6281513983136", icon: MessageCircle },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="relative bg-primary-dark text-white pt-16 pb-8 overflow-hidden border-t border-primary-dark/80">
      {/* Background Decorative Islamic Accent Pattern & Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info Column */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group w-fit">
              <div className="relative h-12 w-auto flex items-center justify-center">
                <Image
                  src="/RIMBA.png"
                  alt="RIMBA Logo"
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-accent transition-colors">
                  RIMBA
                </span>
                <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">
                  Remaja Islam Masjid Albarkah
                </span>
              </div>
            </Link>

            <p className="text-sm text-white/80 leading-relaxed max-w-sm pt-1">
              Wadah pembinaan, kolaborasi, dan pengembangan potensi remaja Islam Masjid Albarkah untuk membangun generasi muda yang aktif, berakhlak, dan berdampak.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-primary-dark border border-white/10 flex items-center justify-center transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h3 className="text-base font-bold text-accent tracking-wide uppercase">
              Tautan Cepat
            </h3>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all duration-200"
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location Column */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            <h3 className="text-base font-bold text-accent tracking-wide uppercase">
              Sekretariat & Kontak
            </h3>

            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>
                  Komplek Masjid Al-Barkah
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:rimba@albarkah.org" className="hover:text-white transition-colors">
                  rimba@albarkah.org
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="https://wa.me/6281513983136" className="hover:text-white transition-colors">
                  +62 815-1398-3136
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>© {new Date().getFullYear()} RIMBA - Remaja Islam Masjid Albarkah. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Dikelola oleh Remaja Islam Masjid Albarkah</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
