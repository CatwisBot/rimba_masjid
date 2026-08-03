import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const berita = await prisma.berita.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, count: berita.length, data: berita });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
