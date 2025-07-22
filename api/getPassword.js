import { getAllPasswords } from '../util/db.js';

export default async function handler(req, res) {
  const { site } = req.query;

  if (!site) {
    return res.status(400).json({ error: 'Missing site parameter' });
  }

  const all = await getAllPasswords();
  const filtered = all.filter(p => p.site === site);
  res.status(200).json(filtered);
}