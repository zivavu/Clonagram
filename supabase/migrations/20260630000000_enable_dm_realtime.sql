-- DM realtime (useRealtimeChat) relies on postgres_changes for the messages,
-- conversations and conversation_participants tables. These were enabled in the
-- production dashboard but never captured as a migration, so fresh environments
-- (e.g. the e2e test project) lacked them. Add them idempotently.
do $$
declare
   t text;
begin
   foreach t in array array['messages', 'conversations', 'conversation_participants']
   loop
      if not exists (
         select 1 from pg_publication_tables
         where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
      ) then
         execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
   end loop;
end $$;
