import { supabase } from './supabase';
import type { Database } from './supabase';

// User functions
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) throw error;
  return data;
}

export async function authenticateUser(email: string, password: string) {
  try {
    // Get user by email
    const user = await getUserByEmail(email);
    
    // In a real application, you would hash the password and compare with password_hash
    // For now, we'll do a simple comparison (this should be replaced with proper password hashing)
    if (user && user.password_hash === password) {
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    return { success: false, error: 'User not found' };
  }
}

export async function createUser(user: {
  name: string;
  email: string;
  password_hash: string;
  role?: 'volunteer' | 'manager';
}) {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUser(id: string, updates: Partial<Database['users']['Row']>) {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Pet functions
export async function getPets(species?: 'dog' | 'cat') {
  let query = supabase.from('pets').select('*');
  if (species) {
    query = query.eq('species', species);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getDogsForWalking() {
  const { data, error } = await supabase
    .from('pets')
    .select('pet_id, name, training_level')
    .eq('species', 'dog');
  if (error) throw error;
  return data;
}

export async function createPet(pet: {
  name: string;
  species: 'dog' | 'cat';
  training_level: string;
  is_fosterable?: boolean;
  photo_url?: string;
  notes?: string;
  age_category?: string;
  size?: string;
  gender?: string;
  good_with_kids?: boolean;
  good_with_dogs?: boolean;
  good_with_cats?: boolean;
}) {
  const { data, error } = await supabase
    .from('pets')
    .insert([pet])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePet(id: string, updates: Partial<Database['pets']['Row']>) {
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('pet_id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePet(id: string) {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('pet_id', id);
  if (error) throw error;
}

// Dog walk functions
export async function getDogWalks(userId?: string) {
  let query = supabase
    .from('dog_walks')
    .select(`
      *,
      pets (name, training_level),
      users (name)
    `)
    .order('walk_date', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createDogWalk(walk: {
  user_id: string;
  dog_id: string;
  walk_date: string;
  time_start: string;
  duration: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('dog_walks')
    .insert([walk])
    .select(`
      *,
      pets (name, training_level),
      users (name)
    `)
    .single();
  if (error) throw error;
  return data;
}

// Task functions
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      users (name)
    `)
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTask(task: {
  title: string;
  description?: string;
  priority: number;
  notes?: string;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Database['tasks']['Row']>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('task_id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('task_id', id);
  if (error) throw error;
}

// Message functions
export async function getMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      users (name)
    `)
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createMessage(message: {
  content: string;
  posted_by: string;
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select(`
      *,
      users (name)
    `)
    .single();
  if (error) throw error;
  return data;
}

// Comment functions
export async function getComments(messageId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      users (name)
    `)
    .eq('message_id', messageId)
    .order('timestamp', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createComment(comment: {
  message_id: string;
  content: string;
  posted_by: string;
}) {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select(`
      *,
      users (name)
    `)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('comment_id', commentId);
  if (error) throw error;
  return { success: true };
}

// Volunteer time functions
export async function signIn(userId: string) {
  const { data, error } = await supabase
    .from('volunteer_time')
    .insert([{
      user_id: userId,
      sign_in_time: new Date().toISOString()
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function signOut(logId: string) {
  const { data, error } = await supabase
    .from('volunteer_time')
    .update({ sign_out_time: new Date().toISOString() })
    .eq('log_id', logId)
    .select()
    .single();
  if (error) throw error;
  return data;
}