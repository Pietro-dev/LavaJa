'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ServicosList from '../../../../../components/lava-rapidos-clientes/listagemServicos'

export default function ServicosPage() {
  const params = useParams()
  const id = params.id as string
  const [usuarioId, setUsuarioId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUsuarioId = () => {
      let id = localStorage.getItem('usuarioId')
      
      if (!id) {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          try {
            const user = JSON.parse(userStr)
            id = user.id || user.usuarioId || null
          } catch (error) {
            console.error('Erro ao parsear user:', error)
          }
        }
      }
      
      return id
    }

    const usuarioId = getUsuarioId()
    
    console.log('🔍 DEBUG ServicosPage - localStorage:', {
      usuarioId: localStorage.getItem('usuarioId'),
      userType: localStorage.getItem('userType'),
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user')
    })

    if (usuarioId) {
      setUsuarioId(usuarioId)
    } else {
      console.error('❌ UsuarioId não encontrado no localStorage')
    }
    
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <span className="icon is-large">
            <i className="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ServicosList 
        lavaRapidoId={id} 
        usuarioId={usuarioId || undefined}
      />
    </div>
  )
}