import express from 'express';
import bodyParser from 'body-parser';
import { savePassword, getAllPasswords } from './util/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/addPassword', async (req, res) => {
  const { site, password } = req.body;
  if (!site || !password) return res.status(400).json({ error: 'Missing parameters' });
  try {
    await savePassword(site, password);
    res.json({ message: 'Password saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save password' });
  }
});

app.get('/api/getPassword', async (req, res) => {
  const { site } = req.query;
  try {
    const all = await getAllPasswords();
    const filtered = site ? all.filter(p => p.site === site) : all;
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passwords' });
  }
});

app.listen(PORT, () => console.log('Server running on port', PORT));
