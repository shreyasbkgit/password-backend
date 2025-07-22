import { deletePassword } from '../util/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing ID' });
  }

  try {
    await deletePassword(id);
    res.status(200).json({ message: 'Password deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
