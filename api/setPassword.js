import { savePassword } from '../util/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, site, username, password, email } = req.body;

  if (!site || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields: site, password, email' });
  }

  const user = email.includes('@') ? email.split('@')[0] : email;

  try {
    await savePassword({ id, site, username, password, user });
    res.status(200).json({ message: id ? 'Password updated' : 'Password saved' });
  } catch (error) {
    console.error("Supabase error:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
