// hooks/useProducts.js
import { useState, useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'

export const useProducts = () => {
  const { supabase } = useSupabase()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error cargando productos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Agregar producto
  const addProduct = async (productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (error) throw error
      setProducts([...products, data[0]])
      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error agregando producto:', err)
      return { success: false, error: err.message }
    }
  }

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()

      if (error) throw error
      setProducts(products.map(p => p.id === id ? data[0] : p))
      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error actualizando producto:', err)
      return { success: false, error: err.message }
    }
  }

  // Eliminar producto
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProducts(products.filter(p => p.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error eliminando producto:', err)
      return { success: false, error: err.message }
    }
  }

  // Buscar producto por código
  const findProductByCode = async (code) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('code', code)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (err) {
      console.error('Error buscando producto:', err)
      return null
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    findProductByCode,
    refetch: fetchProducts
  }
}
