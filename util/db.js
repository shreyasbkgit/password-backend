import supabase from './supabaseClient.js';

export async function savePassword(site, password) {
  const { error } = await supabase.from('passwords').insert([{ site, password }]);
  if (error) {
    console.error('Error saving password:', error);
    throw error;
  }
}

export async function getAllPasswords() {
  const { data, error } = await supabase.from('passwords').select('*');
  if (error) {
    console.error('Error fetching passwords:', error);
    throw error;
  }
  return data;
}
