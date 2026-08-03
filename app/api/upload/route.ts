import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const BUCKET = "rimba-uploads";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dikirim." }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPG, PNG, atau WEBP." },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Coba upload ke Supabase Storage jika dikonfigurasi & bucket tersedia
    if (supabase) {
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        let uploadResult = await supabase.storage
          .from(BUCKET)
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (
          uploadResult.error?.message?.toLowerCase().includes("bucket not found") ||
          (uploadResult.error as { statusCode?: string })?.statusCode === "404"
        ) {
          try {
            await supabase.storage.createBucket(BUCKET, { public: true });
            uploadResult = await supabase.storage
              .from(BUCKET)
              .upload(filename, buffer, { contentType: file.type, upsert: false });
          } catch (bucketErr) {
            console.warn("Gagal membuat bucket Supabase:", bucketErr);
          }
        }

        if (!uploadResult.error) {
          const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
          if (publicData?.publicUrl) {
            return NextResponse.json({ url: publicData.publicUrl });
          }
        } else {
          console.warn("Supabase Storage Error, beralih ke Fallback Base64 Data URL:", uploadResult.error.message);
        }
      } catch (storageErr: unknown) {
        console.warn("Supabase upload exception, beralih ke Fallback Base64:", storageErr instanceof Error ? storageErr.message : storageErr);
      }
    }

    // 2. Fallback Data URL: Jika Supabase bucket belum dibuat / anon key tidak cukup izin, gunakan Base64 Data URL
    const base64Url = `data:${file.type};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ url: base64Url });
  } catch (err: unknown) {
    console.error("Upload API error:", err);
    const message = err instanceof Error ? err.message : "Upload gagal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
