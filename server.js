import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import supabase from './util/supabaseClient.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Save or update password
app.post('/api/setPassword', async (req, res) => {
  const { id, site, password, user, username } = req.body;
  if (!site || !password || !user) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const record = { site, password, user, username };

  try {
    if (id) {
      const { error } = await supabase.from('passwords').update(record).eq('id', id);
      if (error) throw error;
      res.status(200).json({ message: 'Password updated' });
    } else {
      const { error } = await supabase.from('passwords').insert([record]);
      if (error) throw error;
      res.status(200).json({ message: 'Password saved' });
    }
  } catch (err) {
    console.error('Save/Update error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get passwords by user, and optionally filter by site
app.get('/api/getPassword', async (req, res) => {
  const { site, user } = req.query;
  if (!user) return res.status(400).json({ error: 'Missing user' });

  let query = supabase.from('passwords').select('*').eq('user', user);

  if (site) {
    query = query.eq('site', site);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase fetch error:", error);
    return res.status(500).json({ error: 'Failed to fetch passwords' });
  }

  res.json(data);
});

// Delete password
app.post('/api/deletePassword', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  const { error } = await supabase.from('passwords').delete().eq('id', id);
  if (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete' });
  }

  res.status(200).json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
