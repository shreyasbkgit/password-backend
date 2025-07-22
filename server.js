import express from 'express';
import bodyParser from 'body-parser';
import { savePassword, getAllPasswords } from './util/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/addPassword', async (req, res) => {
  const { site, password } = req.body;
  if (!site || !password) return res.status(400).json({ error: 'Missing parameters' });
  await savePassword(site, password);
  res.json({ message: 'Password saved' });
});

app.get('/api/getPassword', async (req, res) => {
  const { site } = req.query;
  const all = await getAllPasswords();
  const filtered = all.filter(p => p.site === site);
  res.json(filtered);
});

app.listen(PORT, () => console.log('Server running on', PORT));