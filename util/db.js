import supabase from './supabaseClient.js';


export async function savePassword({ id, site, username, password, user }) {
  const payload = { site, username, password, user };

  if (id) {
    const { error } = await supabase
      .from("passwords")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("passwords")
      .insert([payload]);
    if (error) throw error;
  }
}

export async function getAllPasswords() {
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
