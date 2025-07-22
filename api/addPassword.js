import { savePassword } from '../util/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { site, password } = req.body;
  if (!site || !password) {
    return res.status(400).json({ error: 'Missing site or password' });
  }

  await savePassword(site, password);
  res.status(200).json({ message: 'Password saved' });
}