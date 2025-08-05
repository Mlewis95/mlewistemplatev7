import { supabase } from './supabase'
import type { Database } from './supabase'

type Pet = Database['public']['Tables']['pets']['Row']
type Volunteer = Database['public']['Tables']['volunteers']['Row']
type VolunteerSession = Database['public']['Tables']['volunteer_sessions']['Row']

// Pet-related functions
export async function getPets(type?: 'dog' | 'cat') {
  let query = supabase
    .from('pets')
    .select('*')
    .order('time_at_shelter', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching pets:', error)
    throw error
  }

  return data || []
}

export async function getPetById(id: number) {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching pet:', error)
    throw error
  }

  return data
}

export async function createPet(pet: Database['public']['Tables']['pets']['Insert']) {
  const { data, error } = await supabase
    .from('pets')
    .insert(pet)
    .select()
    .single()

  if (error) {
    console.error('Error creating pet:', error)
    throw error
  }

  return data
}

export async function updatePet(id: number, updates: Database['public']['Tables']['pets']['Update']) {
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating pet:', error)
    throw error
  }

  return data
}

export async function deletePet(id: number) {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting pet:', error)
    throw error
  }
}

// Volunteer-related functions
export async function getVolunteers() {
  const { data, error } = await supabase
    .from('volunteers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching volunteers:', error)
    throw error
  }

  return data || []
}

export async function getVolunteerById(id: number) {
  const { data, error } = await supabase
    .from('volunteers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching volunteer:', error)
    throw error
  }

  return data
}

export async function createVolunteer(volunteer: Database['public']['Tables']['volunteers']['Insert']) {
  const { data, error } = await supabase
    .from('volunteers')
    .insert(volunteer)
    .select()
    .single()

  if (error) {
    console.error('Error creating volunteer:', error)
    throw error
  }

  return data
}

export async function updateVolunteer(id: number, updates: Database['public']['Tables']['volunteers']['Update']) {
  const { data, error } = await supabase
    .from('volunteers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating volunteer:', error)
    throw error
  }

  return data
}

// Volunteer session functions
export async function getVolunteerSessions(volunteerId?: number) {
  let query = supabase
    .from('volunteer_sessions')
    .select('*')
    .order('session_date', { ascending: true })

  if (volunteerId) {
    query = query.eq('volunteer_id', volunteerId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching volunteer sessions:', error)
    throw error
  }

  return data || []
}

export async function createVolunteerSession(session: Database['public']['Tables']['volunteer_sessions']['Insert']) {
  const { data, error } = await supabase
    .from('volunteer_sessions')
    .insert(session)
    .select()
    .single()

  if (error) {
    console.error('Error creating volunteer session:', error)
    throw error
  }

  return data
}

export async function updateVolunteerSession(id: number, updates: Database['public']['Tables']['volunteer_sessions']['Update']) {
  const { data, error } = await supabase
    .from('volunteer_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating volunteer session:', error)
    throw error
  }

  return data
}

export async function deleteVolunteerSession(id: number) {
  const { error } = await supabase
    .from('volunteer_sessions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting volunteer session:', error)
    throw error
  }
} 