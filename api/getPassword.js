import supabase from '../../util/supabaseClient.js';

export default async function handler(req, res) {
  const { user, site } = req.query;

  if (!user) return res.status(400).json({ error: 'Missing user parameter' });

  let query = supabase.from('passwords').select('*').eq('user', user);

  if (site) {
    query = query.eq('site', site);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching passwords:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  res.status(200).json(data);
}
