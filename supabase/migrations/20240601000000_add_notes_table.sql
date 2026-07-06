CREATE TABLE IF NOT EXISTS public.notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 60),
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT notes_user_id_key UNIQUE (user_id)
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select" ON public.notes
  FOR SELECT USING (true);

CREATE POLICY "notes_insert" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_update" ON public.notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notes_delete" ON public.notes
  FOR DELETE USING (auth.uid() = user_id);
