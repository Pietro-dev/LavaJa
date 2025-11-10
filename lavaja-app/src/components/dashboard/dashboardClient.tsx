// components/dashboard/dashboard-client.tsx
"use client"

import { useState, useEffect } from 'react'
import { Dashboard } from './dashboard'
import { useDashboardService } from 'app/services'
import { DashboardData } from 'app/models/dashboard'

export const DashboardClient: React.FC = () => {
  const [lavaRapidoId, setLavaRapidoId] = useState<string>('23')
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    clientes: 0,
    agendamentos: 0,
    servicos: 0
  })
  const [loading, setLoading] = useState<boolean>(false)

  const service = useDashboardService()

  // Função para buscar dados
  const fetchData = async (id: string) => {
    if (!id) return
    
    setLoading(true)
    try {
      const data = await service.get(id)
      setDashboardData(data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // Buscar dados automaticamente quando lavaRapidoId mudar
  useEffect(() => {
    fetchData(lavaRapidoId)
  }, []) // Busca inicial

  // Handler para mudança do input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newId = event.target.value
    setLavaRapidoId(newId)
  }

  // Handler para buscar dados manualmente
  const handleBuscarClick = () => {
    fetchData(lavaRapidoId) // Agora usa o valor atual
  }

  return (
    <Dashboard 
      clientes={dashboardData.clientes}
      agendamentos={dashboardData.agendamentos}
      servicos={dashboardData.servicos}
      lavaRapidoId={lavaRapidoId}
      onLavaRapidoIdChange={handleInputChange}
      onBuscarClick={handleBuscarClick}
    />
  )
}