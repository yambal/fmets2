"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitLetter(formData: FormData) {
  const body = formData.get("body") as string;

  if (!body || body.trim().length === 0) {
    return { error: "おたよりの内容を入力してください。" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "認証されていません。ログインしてください。" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .single();

  if (!profile?.nickname) {
    return { error: "ニックネームを設定してから投稿してください。" };
  }

  const { data: lastLetter } = await supabase
    .from("letters")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (lastLetter) {
    const lastPostedAt = new Date(lastLetter.created_at).getTime();
    const now = Date.now();
    const sixHours = 6 * 60 * 60 * 1000;
    const remaining = sixHours - (now - lastPostedAt);
    if (remaining > 0) {
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.ceil((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return { error: `次の投稿まであと${hours}時間${minutes}分お待ちください。` };
    }
  }

  const { error } = await supabase.from("letters").insert({
    user_id: user.id,
    nickname: profile?.nickname ?? "",
    body: body.trim(),
  });

  if (error) {
    return { error: "投稿に失敗しました。もう一度お試しください。" };
  }

  revalidatePath("/dashboard/letters");
  return { success: true };
}

export async function deleteLetter(letterId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "認証されていません。" };
  }

  const { data: letter } = await supabase
    .from("letters")
    .select("processed")
    .eq("id", letterId)
    .eq("user_id", user.id)
    .single();

  if (letter?.processed) {
    return { error: "処理済のおたよりは削除できません。" };
  }

  const { error } = await supabase
    .from("letters")
    .delete()
    .eq("id", letterId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "削除に失敗しました。" };
  }

  revalidatePath("/dashboard/letters");
  return { success: true };
}
