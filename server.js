import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { savePassword, getAllPasswords } from './util/db.js';
import supabase from './util/supabaseClient.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Save password API
app.post('/api/addPassword', async (req, res) => {
  const { site, password, user, username } = req.body;
  if (!site || !password || !user) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  const { error } = await supabase
    .from('passwords')
    .insert([{ site, password, user, username }]);
  if (error) {
    console.error('Error saving password:', error);
    return res.status(500).json({ error: 'Database error' });
  }
  res.json({ message: 'Password saved' });
});

// Get password API (now filters by site AND user)
app.get('/api/getPassword', async (req, res) => {
  const { site, user } = req.query;

  if (!site || !user) return res.status(400).json({ error: 'Missing parameters' });

  const { data, error } = await supabase
    .from('passwords')
    .select('*')
    .eq('site', site)
    .eq('user', user);

  if (error) {
    console.error('Error fetching passwords:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  res.json(data);
});

app.listen(PORT, () => console.log('Server running on port', PORT));
