import { NextResponse } from "next/server";

const ICECAST_STATUS_URL = "https://fmets2jp.ipv64.de/status";

export async function GET() {
  try {
    const res = await fetch(ICECAST_STATUS_URL);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
