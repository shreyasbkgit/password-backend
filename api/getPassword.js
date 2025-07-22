app.get('/api/getPassword', async (req, res) => {
  const { user, site } = req.query;

  if (!user) {
    return res.status(400).json({ error: 'Missing user parameter' });
  }

  try {
    let query = supabase.from('passwords').select('*').eq('user', user);

    if (site && site.trim() !== '') {
      query = query.eq('site', site.trim());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching passwords:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
});
