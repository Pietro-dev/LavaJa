'use client'

import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { DashboardClient, LoginForm } from '../components'

const Home: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🏠 Página inicial - Status:', { isAuthenticated, loading })
    
    if (!loading && !isAuthenticated) {
      console.log('🔀 Redirecionando para login...')
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  console.log('🏠 Renderizando com:', { isAuthenticated, loading })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? 'Verificando autenticação...' : 'Redirecionando para login...'}
          </p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Algo deu errado...</p>
    </div>
  )
}

export default Home