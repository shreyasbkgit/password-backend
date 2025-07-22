import supabase from './supabaseClient.js';

// Save or update password entry
export async function savePassword({ id, site, password, username, user }) {
  if (id) {
    // Update existing record
    const { error } = await supabase
      .from('passwords')
      .update({ site, username, password })
      .eq('id', id);

    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  } else {
    // Insert new record
    const { error } = await supabase
      .from('passwords')
      .insert([{ site, username, password, user }]);

    if (error) {
      console.error('Error saving password:', error);
      throw error;
    }
  }
}

// Fetch all passwords for a specific user
export async function getPasswordsByUser(user) {
  const { data, error } = await supabase
    .from('passwords')
    .select('*')
    .eq('user', user);

  if (error) {
    console.error('Error fetching passwords:', error);
    throw error;
  }

  return data;
}

// Delete password entry by ID
export async function deletePassword(id) {
  const { error } = await supabase
    .from('passwords')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting password:', error);
    throw error;
  }
}
