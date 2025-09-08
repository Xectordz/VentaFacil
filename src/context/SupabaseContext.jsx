import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
// Reemplaza estos valores con los de tu proyecto Supabase
const supabaseUrl = 'https://bhlnbcbbwblbkwvkfvey.supabase.co'
const supabaseKey = 'sb_publishable_GzSdojX0jw8sjEJ_kiytJw_t6kVAedM'

export const supabase = createClient(supabaseUrl, supabaseKey)

const SupabaseContext = createContext()

// Exportar el contexto para que pueda ser usado directamente
export { SupabaseContext }

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase debe usarse dentro de SupabaseProvider')
  }
  return context
}

export const SupabaseProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión actual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Función para login automático como admin (para desarrollo)
  const ensureAuthenticated = async () => {
    if (user) return user

    // Login automático con credenciales de desarrollo
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'admin123'
    })

    if (error && error.message.includes('Invalid login credentials')) {
      // Si no existe, crear usuario admin automáticamente
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'admin123'
      })
      
      if (signUpError) {
        console.error('Error creating admin user:', signUpError)
        return null
      }
      
      return signUpData.user
    }

    if (error) {
      console.error('Error logging in:', error)
      return null
    }

    return data.user
  }

  return (
    <SupabaseContext.Provider value={{ 
      supabase, 
      user, 
      session, 
      loading,
      ensureAuthenticated 
    }}>
      {children}
    </SupabaseContext.Provider>
  )
}
