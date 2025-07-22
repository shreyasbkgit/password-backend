import supabase from './supabaseClient.js';

// Save password with optional username
export async function savePassword(site, password, username = null) {
  const { error } = await supabase
    .from('passwords')
    .insert([{ site, password, username }]);

  if (error) {
    console.error('Error saving password:', error);
    throw error;
  }
}

// Get all stored passwords (with username)
export async function getAllPasswords() {
  const { data, error } = await supabase
    .from('passwords')
    .select('site, password, username');

  if (error) {
    console.error('Error fetching passwords:', error);
    throw error;
  }

  return data;
}
