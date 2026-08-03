"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  UserCheck,
  MessageSquare,
  Users,
  Wallet,
  Settings,
  ExternalLink,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck,
  User,
} from "lucide-react";

export type RoleType = "BPH" | "HUMAS" | "BENDAHARA";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: RoleType[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const ALL_MENU_GROUPS: MenuGroup[] = [
  {
    title: "UTAMA",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["BPH", "HUMAS", "BENDAHARA"] },
    ],
  },
  {
    title: "KONTEN",
    items: [
      { name: "Berita", href: "/admin/berita", icon: Newspaper, roles: ["BPH", "HUMAS"] },
      { name: "Agenda", href: "/admin/agenda", icon: Calendar, roles: ["BPH", "HUMAS"] },
      { name: "Galeri", href: "/admin/galeri", icon: ImageIcon, roles: ["BPH", "HUMAS"] },
    ],
  },
  {
    title: "INTERAKSI",
    items: [
      { name: "Pendaftaran", href: "/admin/pendaftaran", icon: UserCheck, roles: ["BPH", "HUMAS"] },
      { name: "Pesan Masuk", href: "/admin/pesan", icon: MessageSquare, roles: ["BPH", "HUMAS"] },
    ],
  },
  {
    title: "ORGANISASI",
    items: [
      { name: "Anggota", href: "/admin/anggota", icon: Users, roles: ["BPH"] },
      { name: "Keuangan", href: "/admin/keuangan", icon: Wallet, roles: ["BPH", "BENDAHARA"] },
    ],
  },
  {
    title: "SISTEM",
    items: [
      { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings, roles: ["BPH"] },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<RoleType>("HUMAS");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("rimba_admin_role") as RoleType;
      if (savedRole && ["BPH", "HUMAS", "BENDAHARA"].includes(savedRole)) {
        setActiveRole(savedRole);
      }
    }
  }, []);

  // Filter menu groups based on activeRole logged in
  const filteredMenuGroups = ALL_MENU_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(activeRole)),
  })).filter((group) => group.items.length > 0);

  // Determine breadcrumb title
  const getBreadcrumbName = () => {
    if (pathname === "/admin") return "ADMIN DASHBOARD";
    if (pathname.includes("/berita")) return "ADMIN BERITA";
    if (pathname.includes("/agenda")) return "ADMIN AGENDA";
    if (pathname.includes("/galeri")) return "ADMIN GALERI";
    if (pathname.includes("/pendaftaran")) return "ADMIN PENDAFTARAN";
    if (pathname.includes("/pesan")) return "ADMIN PESAN MASUK";
    if (pathname.includes("/anggota")) return "ADMIN ANGGOTA";
    if (pathname.includes("/keuangan")) return "ADMIN KEUANGAN";
    if (pathname.includes("/pengaturan")) return "ADMIN PENGATURAN";
    return "ADMIN PANEL";
  };

  const getRoleLabel = () => {
    if (activeRole === "BPH") return "Super Admin (BPH)";
    if (activeRole === "HUMAS") return "Humas Admin";
    return "Bendahara Admin";
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-surface border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/RIMBA.png" alt="RIMBA Logo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-black text-text text-lg">RIMBA Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-text hover:bg-background border border-border"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-72 bg-surface border-r border-border/80 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } h-screen overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="p-6 border-b border-border/60">
            <Link href="/admin" className="flex items-center gap-3.5 group">
              <div className="relative h-10 w-auto flex items-center justify-center">
                <Image
                  src="/RIMBA.png"
                  alt="RIMBA Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-text leading-tight group-hover:text-primary transition-colors">
                  RIMBA Admin
                </span>
                <span className="text-[11px] font-bold text-primary">
                  {isClient ? getRoleLabel() : "Pengurus Admin"}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Groups */}
          <div className="p-4 space-y-6">
            {filteredMenuGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold text-text/40 tracking-wider uppercase">
                  {group.title}
                </span>
                <div className="space-y-1 pt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-text/75 hover:text-primary hover:bg-primary/10"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-primary"}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer Buttons */}
        <div className="p-4 border-t border-border/60 space-y-2">
          {/* External Site Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-text/80 bg-background hover:bg-border/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-primary" />
              <span>Lihat Situs</span>
            </span>
          </Link>

          {/* Logout Button */}
          <Link
            href="/login"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors w-full"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-surface border-b border-border/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          {/* Breadcrumb & Title */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {getBreadcrumbName()}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-text leading-snug">
              Dashboard RIMBA
            </h1>
          </div>

          {/* Search & Static Logged-In User Profile */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text/40" />
              <input
                type="text"
                placeholder="Cari menu atau data..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-background border border-border/80 focus:outline-none focus:border-primary text-text"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-full bg-background border border-border/80 hover:bg-primary/10 text-text/70 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </button>

            {/* Logged In Role Display Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-border/80">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                {activeRole === "HUMAS" ? <User className="w-4 h-4 text-emerald-600" /> : <ShieldCheck className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text/60">Logged in as:</span>
                <span className="text-xs font-black text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                  {isClient ? getRoleLabel() : "Pengurus"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
