import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getServerSupabase } from "@/lib/supabase/server";

export async function DELETE() {
  const supabase = await getServerSupabase();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!data.user) return Response.json({ code: "unauthorized" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return Response.json({ code: "not_configured" }, { status: 503 });
  const { error } = await admin.auth.admin.deleteUser(data.user.id);
  if (error) return Response.json({ code: "delete_failed" }, { status: 500 });
  return Response.json({ ok: true });
}
