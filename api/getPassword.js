import { getPasswordsByUser } from '../util/db.js';

export default async function handler(req, res) {
  const { user, site } = req.query;

  if (!user) {
    return res.status(400).json({ error: 'Missing user parameter' });
  }

  try {
    const all = await getPasswordsByUser(user);
    const filtered = site ? all.filter(p => p.site === site) : all;
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
