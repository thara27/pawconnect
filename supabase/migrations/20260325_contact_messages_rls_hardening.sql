-- Harden contact_messages against rls_disabled_in_public findings.
-- This migration is safe to run even if contact_messages does not exist.

do $$
begin
  if to_regclass('public.contact_messages') is not null then
    alter table public.contact_messages enable row level security;
    alter table public.contact_messages force row level security;

    drop policy if exists "Public can submit contact messages" on public.contact_messages;

    -- Allow only message submission; deny reads/updates/deletes to anon/authenticated roles.
    create policy "Public can submit contact messages"
      on public.contact_messages
      for insert
      to anon, authenticated
      with check (
        char_length(coalesce(name, '')) > 0
        and char_length(coalesce(email, '')) > 0
        and char_length(coalesce(subject, '')) > 0
        and char_length(coalesce(message, '')) > 0
      );
  end if;
end
$$;