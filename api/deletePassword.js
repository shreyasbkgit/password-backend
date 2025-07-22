import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "Missing ID" });

  const { error } = await supabase.from("vault").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ success: true });
}
