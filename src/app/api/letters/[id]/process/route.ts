import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("letters")
      .update({ processed: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { status: "error", message: "Letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "ok", letter: data });
  } catch (e) {
    return NextResponse.json(
      { status: "error", message: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
