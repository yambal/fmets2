"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateNickname(formData: FormData) {
  const nickname = formData.get("nickname") as string;

  if (nickname === null || nickname === undefined) {
    return { error: "ニックネームを入力してください。" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "認証されていません。ログインしてください。" };
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname: nickname.trim(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { error: "保存に失敗しました。もう一度お試しください。" };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}
