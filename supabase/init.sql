-- ============================================
-- FM ETS2 JP - Supabase 初期化SQL
-- ============================================
-- このファイルを Supabase SQL Editor で実行すると
-- 必要なテーブル・ポリシーがすべて作成されます。
-- ============================================

-- --------------------------------------------
-- profiles テーブル
-- ユーザーのニックネームを管理
-- --------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 新規ユーザー登録時に profiles レコードを自動作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- --------------------------------------------
-- letters テーブル
-- おたより投稿を管理
-- --------------------------------------------
CREATE TABLE public.letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all letters"
  ON public.letters FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own letters"
  ON public.letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own letters"
  ON public.letters FOR DELETE
  USING (auth.uid() = user_id);

-- user_id での検索を高速化
CREATE INDEX idx_letters_user_id ON public.letters(user_id);
