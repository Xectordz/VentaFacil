import React, { createContext, useContext } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
// Reemplaza estos valores con los de tu proyecto Supabase
const supabaseUrl = 'https://bhlnbcbbwblbkwvkfvey.supabase.co'
const supabaseKey = 'sb_publishable_GzSdojX0jw8sjEJ_kiytJw_t6kVAedM'

export const supabase = createClient(supabaseUrl, supabaseKey)

const SupabaseContext = createContext()

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase debe usarse dentro de SupabaseProvider')
  }
  return context
}

export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}
