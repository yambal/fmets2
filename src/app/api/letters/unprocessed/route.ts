import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("letters")
      .select("*")
      .eq("processed", false)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "ok", letters: data });
  } catch (e) {
    return NextResponse.json(
      { status: "error", message: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
