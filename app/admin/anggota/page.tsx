"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Users,
  X,
} from "lucide-react";
import { getAnggota, createAnggota, updateAnggota, deleteAnggota } from "@/app/actions/anggota";
import ImageUpload from "@/components/admin/ImageUpload";

interface AnggotaItem {
  id: string;
  name: string;
  role: string;
  category: string;
  avatar: string;
  order: number;
  createdAt: Date;
}

const CATEGORIES = [
  "BPH",
  "Pengurus Inti",
  "Divisi Keislaman",
  "Divisi Humas",
  "Divisi Sosial",
  "Divisi Seni",
];

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

export default function AdminAnggotaPage() {
  const [members, setMembers] = useState<AnggotaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<AnggotaItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    category: "BPH",
    avatar: "",
    order: "",
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAnggota();
      if (res.success && res.data) {
        setMembers(res.data as AnggotaItem[]);
      } else {
        setError("Gagal memuat data anggota.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleStartEdit = (member: AnggotaItem) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      avatar: member.avatar,
      order: member.order.toString(),
    });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setFormData({ name: "", role: "", category: "BPH", avatar: "", order: "" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    const res = await deleteAnggota(id);
    if (!res.success) {
      loadData();
      alert("Gagal menghapus anggota.");
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingMember) {
        const res = await updateAnggota(editingMember.id, {
          name: formData.name,
          role: formData.role,
          category: formData.category,
          avatar: formData.avatar || defaultAvatar,
          order: formData.order ? parseInt(formData.order) : editingMember.order,
        });

        if (res.success && res.data) {
          setMembers((prev) =>
            prev.map((m) => (m.id === editingMember.id ? (res.data as AnggotaItem) : m))
          );
          handleCancelEdit();
        } else {
          alert("Gagal memperbarui data anggota.");
        }
      } else {
        const res = await createAnggota({
          name: formData.name,
          role: formData.role,
          category: formData.category,
          avatar: formData.avatar || defaultAvatar,
          order: formData.order ? parseInt(formData.order) : members.length + 1,
        });

        if (res.success && res.data) {
          setMembers((prev) => [...prev, res.data as AnggotaItem]);
          setFormData({ name: "", role: "", category: "BPH", avatar: "", order: "" });
        } else {
          alert("Gagal menambahkan anggota.");
        }
      }
    } catch {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  // Group by category
  const grouped = CATEGORIES.reduce<Record<string, AnggotaItem[]>>((acc, cat) => {
    const group = members.filter((m) => m.category === cat);
    if (group.length > 0) acc[cat] = group;
    return acc;
  }, {});

  const otherCats = [...new Set(members.map((m) => m.category))].filter(
    (c) => !CATEGORIES.includes(c)
  );
  otherCats.forEach((cat) => {
    grouped[cat] = members.filter((m) => m.category === cat);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-border/80 shadow-2xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text">Data Anggota</h2>
          <p className="text-xs sm:text-sm text-text/70 mt-0.5">
            Kelola daftar anggota dan struktur kepengurusan RIMBA.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-border/60 text-text/70 hover:text-primary hover:border-primary/40 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-5 bg-surface border border-border/80 rounded-3xl p-6 shadow-2xs h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              {editingMember ? (
                <Pencil className="w-4 h-4 text-blue-600" />
              ) : (
                <Plus className="w-4 h-4 text-primary" />
              )}
              <span>{editingMember ? "Edit Data Anggota" : "Tambah Anggota Baru"}</span>
            </h3>
            {editingMember && (
              <button
                onClick={handleCancelEdit}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200"
              >
                <X className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-text mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Nama lengkap anggota"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Jabatan / Peran *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ketua Umum, Bendahara, Anggota"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div>
              <label className="block font-bold text-text mb-1">Divisi / Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Component */}
            <ImageUpload
              value={formData.avatar}
              onChange={(url) => setFormData({ ...formData, avatar: url })}
              folder="anggota"
              label="Foto Profil / Avatar Anggota"
            />

            <div>
              <label className="block font-bold text-text mb-1">Urutan Tampil</label>
              <input
                type="number"
                min="1"
                placeholder="Contoh: 1, 2, 3..."
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:outline-none focus:border-primary text-text"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              {editingMember && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-1/3 py-2.5 font-bold text-text/70 bg-background hover:bg-border/30 border border-border rounded-xl transition-all text-xs"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className={`py-2.5 font-bold text-white rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 disabled:opacity-60 ${
                  editingMember
                    ? "w-2/3 bg-blue-600 hover:bg-blue-700"
                    : "w-full bg-primary hover:bg-primary-dark"
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingMember ? (
                  <Pencil className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSaving
                  ? "Menyimpan..."
                  : editingMember
                  ? "Simpan Perubahan"
                  : "Tambah Anggota"}
              </button>
            </div>
          </form>
        </div>

        {/* Member Database */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-text/60 bg-surface border border-border/80 rounded-3xl">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Memuat data anggota...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-text/50 bg-surface border border-border/80 rounded-3xl">
              <Users className="w-12 h-12 opacity-30" />
              <p className="text-sm font-semibold">Belum ada anggota. Tambah anggota pertama!</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, groupMembers]) => (
              <div
                key={category}
                className="bg-surface border border-border/80 rounded-3xl overflow-hidden shadow-2xs"
              >
                <div className="px-6 py-4 bg-background border-b border-border/60 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text">{category}</h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    {groupMembers.length} anggota
                  </span>
                </div>
                <div className="divide-y divide-border/60">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-background/60 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 relative bg-background">
                        <Image
                          src={member.avatar || defaultAvatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-text text-sm truncate">{member.name}</div>
                        <div className="text-xs text-text/60 truncate">{member.role}</div>
                      </div>
                      <div className="text-[11px] font-bold text-text/40">#{member.order}</div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(member)}
                          className="p-2 rounded-xl text-text/70 hover:text-blue-600 hover:bg-blue-50 border border-border/60 transition-colors"
                          title="Edit Informasi Anggota"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 rounded-xl text-text/70 hover:text-red-600 hover:bg-red-50 border border-border/60 transition-colors"
                          title="Hapus Anggota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
