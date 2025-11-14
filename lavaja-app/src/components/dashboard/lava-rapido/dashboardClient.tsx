// components/dashboard/dashboard-client.tsx
"use client"

import { useState, useEffect } from 'react'
import { Dashboard } from './dashboard'
import { useDashboardService } from 'app/services'
import { DashboardData } from 'app/models/dashboard'

export const DashboardClient: React.FC = () => {
  const [lavaRapidoId, setLavaRapidoId] = useState<string>('')
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    clientes: 0,
    agendamentos: 0,
    servicos: 0,
    agendamentosPorDia: []
  })
  const [loading, setLoading] = useState<boolean>(false)

  const service = useDashboardService()

  // 🔥 BUSCA APENAS O ID DO LAVA RÁPIDO LOGADO
  const getLavaRapidoId = (): string => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('lavaRapidoId')
      console.log('🔍 Lava Rápido ID encontrado:', id)
      return id || ''
    }
    return ''
  }

  const fetchData = async (id: string) => {
    if (!id) {
      console.log('❌ Nenhum ID de lava rápido encontrado')
      return
    }
    
    setLoading(true)
    try {
      console.log('📊 Buscando dados para Lava Rápido ID:', id)
      const data: DashboardData = await service.get(Number(id))
      
      setDashboardData({
        clientes: data.clientes || 0,
        agendamentos: data.agendamentos || 0,
        servicos: data.servicos || 0,
        agendamentosPorDia: data.agendamentosPorDia || []
      })
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  // 🔥 BUSCA AUTOMÁTICA AO CARREGAR
  useEffect(() => {
    const id = getLavaRapidoId()
    if (id) {
      setLavaRapidoId(id)
      fetchData(id)
    }
  }, [])

  const handleBuscarClick = () => {
    const id = getLavaRapidoId()
    if (id) {
      fetchData(id)
    }
  }

  return (
    <Dashboard 
      clientes={dashboardData.clientes}
      agendamentos={dashboardData.agendamentos}
      servicos={dashboardData.servicos}
      lavaRapidoId={lavaRapidoId}
      onBuscarClick={handleBuscarClick}
      loading={loading}
      agendamentosPorDia={dashboardData.agendamentosPorDia}
    />
  )
}