import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wkkmauwhdbdgpujrbjhg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra21hdXdoZGJkZ3B1anJiamhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODk3OTAsImV4cCI6MjA5Mzk2NTc5MH0.KTH1-MkTLq7MM3oXLWZRuF9rXQNwZ1gZ_TmWUDxrpqg"
);
