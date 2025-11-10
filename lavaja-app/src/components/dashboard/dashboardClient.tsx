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
    servicos: 0,
    agendamentosPorDia: []
  })
  const [loading, setLoading] = useState<boolean>(false)

  const service = useDashboardService()

  const fetchData = async (id: string) => {
    if (!id) return
    
    setLoading(true)
    try {
      const data: DashboardData = await service.get(id)
      
      setDashboardData({
        clientes: data.clientes || 0,
        agendamentos: data.agendamentos || 0,
        servicos: data.servicos || 0,
        agendamentosPorDia: data.agendamentosPorDia || []
      })
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(lavaRapidoId)
  }, [])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newId = event.target.value
    setLavaRapidoId(newId)
  }

  const handleBuscarClick = () => {
    fetchData(lavaRapidoId)
  }

  return (
    <Dashboard 
      clientes={dashboardData.clientes}
      agendamentos={dashboardData.agendamentos}
      servicos={dashboardData.servicos}
      lavaRapidoId={lavaRapidoId}
      onLavaRapidoIdChange={handleInputChange}
      onBuscarClick={handleBuscarClick}
      loading={loading}
      agendamentosPorDia={dashboardData.agendamentosPorDia}
    />
  )
}