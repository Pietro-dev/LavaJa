'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import httpClient from 'app/http'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

export interface Agendamento {
  id: number
  inicio: string
  fim: string
  duracaoMinutos: number
  valor: number
  status: 'AGENDADO' | 'CONFIRMADO' | 'CANCELADO' | 'FINALIZADO'
  dataCriacao: string
  servicoNome: string
  lavaRapidoNome: string
  usuarioNome: string
  usuarioId: number
  servicoId: number
  lavaRapidoId: number
}

interface HistoricoAgendamentosProps {
  usuarioId?: number
  showTitulo?: boolean
  className?: string
}

export function HistoricoAgendamentos({ 
  usuarioId, 
  showTitulo = true,
  className = ''
}: HistoricoAgendamentosProps) {
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função auxiliar para obter o ID do usuário logado
  const getLoggedInUserId = (): number | null => {
    const userType = localStorage.getItem('userType')
    
    // Só clientes podem ver agendamentos
    if (userType !== 'CLIENTE') {
      return null
    }
    
    // Tenta pegar o ID do localStorage e converter para número
    const usuarioIdStr = localStorage.getItem('usuarioId')
    if (usuarioIdStr) {
      const usuarioId = parseInt(usuarioIdStr, 10)
      return isNaN(usuarioId) ? null : usuarioId
    }
    
    return null
  }

  useEffect(() => {
    // console.log('🔍 DEBUG HistoricoAgendamentos - localStorage:', {
    //   userType: localStorage.getItem('userType'),
    //   usuarioId: localStorage.getItem('usuarioId'),
    //   token: localStorage.getItem('token'),
    //   temUser: !!localStorage.getItem('user')
    // })

    const loadAgendamentos = async () => {
      try {
        setLoading(true)
        
        let effectiveUsuarioId: number | undefined = usuarioId
        
        if (!effectiveUsuarioId) {
          effectiveUsuarioId = getLoggedInUserId() || undefined
          
          if (!effectiveUsuarioId) {
            console.log('❌ Usuário não autenticado como cliente')
            console.log('📊 Debug localStorage:', {
              userType: localStorage.getItem('userType'),
              usuarioId: localStorage.getItem('usuarioId'),
              token: localStorage.getItem('token') ? '✅' : '❌'
            })
            router.push('/login')
            return
          }
        }

        console.log('✅ Usuário autenticado, ID:', effectiveUsuarioId)
        console.log('🔍 Buscando agendamentos para usuário:', effectiveUsuarioId)
        console.log('🔍 Token no localStorage:', localStorage.getItem('token') ? '✅' : '❌')
        console.log('🔍 UserType:', localStorage.getItem('userType'))

        // Busca do endpoint
        const response = await httpClient.get<Agendamento[]>(`/api/agendamentos/usuario/${effectiveUsuarioId}`)
        console.log('✅ Agendamentos carregados:', response.data.length)
        setAgendamentos(response.data)

      } catch (error: any) {
        console.error('❌ Erro ao carregar agendamentos:', error)
        
        // Log mais detalhado do erro
        if (error.response) {
          console.error('📊 Status:', error.response.status)
          console.error('📦 Data:', error.response.data)
        }
        
        setError('Não foi possível carregar o histórico de agendamentos')
      } finally {
        setLoading(false)
      }
    }

    loadAgendamentos()
  }, [usuarioId, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'is-success'
      case 'AGENDADO': return 'is-warning'
      case 'CANCELADO': return 'is-danger'
      case 'FINALIZADO': return 'is-info'
      default: return 'is-light'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'Confirmado'
      case 'AGENDADO': return 'Agendado'
      case 'CANCELADO': return 'Cancelado'
      case 'FINALIZADO': return 'Finalizado'
      default: return status
    }
  }

  const cancelarAgendamento = async (agendamento: Agendamento) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return
    }

    try {
      console.log('Tentando cancelar agendamento:', agendamento.id)
      
      const payload = {
        servicoId: agendamento.servicoId,
        usuarioId: agendamento.usuarioId,
        status: 'CANCELADO',
        inicio: agendamento.inicio 
      }
      
      console.log('Payload enviado:', payload)
      
      const response = await httpClient.put(`/api/agendamentos/${agendamento.id}`, payload)
      console.log('Resposta da API:', response.data)
      
      // Atualizar lista localmente
      setAgendamentos(prev => 
        prev.map(ag => 
          ag.id === agendamento.id 
            ? { ...ag, status: 'CANCELADO' }
            : ag
        )
      )
      
      alert('Agendamento cancelado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao cancelar agendamento:', error)
      
      if (error.response) {
        console.error('Resposta do erro:', error.response.data)
        console.error('Status do erro:', error.response.status)
      }
      
      alert('Erro ao cancelar agendamento. Tente novamente.')
    }
  }

  const agendamentosFuturos = agendamentos.filter(ag => 
    dayjs(ag.inicio, 'DD/MM/YYYY HH:mm').isAfter(dayjs())
  ).sort((a, b) => dayjs(a.inicio, 'DD/MM/YYYY HH:mm').valueOf() - dayjs(b.inicio, 'DD/MM/YYYY HH:mm').valueOf())

  const agendamentosPassados = agendamentos.filter(ag => 
    dayjs(ag.inicio, 'DD/MM/YYYY HH:mm').isBefore(dayjs())
  ).sort((a, b) => dayjs(b.inicio, 'DD/MM/YYYY HH:mm').valueOf() - dayjs(a.inicio, 'DD/MM/YYYY HH:mm').valueOf())

  if (loading) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <span className="icon is-large">
            <i className="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p>Carregando histórico...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <div className="notification is-danger">
            <p>{error}</p>
            <button 
              className="button is-light mt-3"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Agendamentos Futuros */}
      {agendamentosFuturos.length > 0 && (
        <div className="mb-6">
          <h2 className="title is-4 mb-4">Próximos Agendamentos</h2>
          <div className="columns is-multiline">
            {agendamentosFuturos.map(agendamento => (
              <div key={agendamento.id} className="column is-half">
                <div className="card">
                  <div className="card-content">
                    <div className="media">
                      <div className="media-content">
                        <p className="title is-5">{agendamento.servicoNome}</p>
                        <p className="subtitle is-6">{agendamento.lavaRapidoNome}</p>
                      </div>
                      <div className="media-right">
                        <span className={`tag ${getStatusColor(agendamento.status)}`}>
                          {getStatusText(agendamento.status)}
                        </span>
                      </div>
                    </div>

                    <div className="content">
                      <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                        <div>
                          <p className="has-text-weight-bold">
                            <span className="icon">
                              <i className="fas fa-calendar"></i>
                            </span>
                            {dayjs(agendamento.inicio, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY')}
                          </p>
                          <p className="has-text-grey">
                            <span className="icon">
                              <i className="fas fa-clock"></i>
                            </span>
                            {dayjs(agendamento.inicio, 'DD/MM/YYYY HH:mm').format('HH:mm')} - {dayjs(agendamento.fim, 'DD/MM/YYYY HH:mm').format('HH:mm')}
                          </p>
                        </div>
                        <p className="title is-4 has-text-success">
                          R$ {agendamento.valor.toFixed(2)}
                        </p>
                      </div>

                      <div className="is-flex is-justify-content-space-between is-align-items-center">
                        <p className="has-text-grey">
                          <span className="icon">
                            <i className="fas fa-stopwatch"></i>
                          </span>
                          {agendamento.duracaoMinutos} minutos
                        </p>
                      </div>

                      {agendamento.status === 'AGENDADO' && (
                        <div className="buttons is-right mt-3">
                          <button
                            className="button is-danger is-small is-dark"
                            onClick={() => cancelarAgendamento(agendamento)}
                          >
                            <span>Cancelar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agendamentos Passados */}
      {agendamentosPassados.length > 0 && (
        <div>
          <h2 className="title is-4 mb-4">Histórico de Agendamentos</h2>
          <div className="table-container">
            <table className="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Estabelecimento</th>
                  <th>Data e Hora</th>
                  <th>Duração</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosPassados.map(agendamento => (
                  <tr key={agendamento.id}>
                    <td>
                      <strong>{agendamento.servicoNome}</strong>
                    </td>
                    <td>{agendamento.lavaRapidoNome}</td>
                    <td>
                      {dayjs(agendamento.inicio, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm')}
                    </td>
                    <td>
                      {agendamento.duracaoMinutos} min
                    </td>
                    <td>
                      <span className={`tag ${getStatusColor(agendamento.status)}`}>
                        {getStatusText(agendamento.status)}
                      </span>
                    </td>
                    <td>
                      <span className="has-text-success has-text-weight-bold">
                        R$ {agendamento.valor.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensagem quando não há agendamentos */}
      {agendamentos.length === 0 && (
        <div className="has-text-centered py-6">
          <div className="notification is-light is-info">
            <span className="icon is-large">
              <i className="fas fa-calendar-times fa-2x"></i>
            </span>
            <p className="title is-4 has-text-grey mt-3">Nenhum agendamento encontrado</p>
            <p className="subtitle is-6 has-text-grey">
              Você ainda não possui agendamentos. Que tal agendar um serviço?
            </p>
            <button 
              className="button is-primary mt-3"
              onClick={() => router.push('/clientes/home-clientes')}
            >
              <span>Buscar Lava-Rápidos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}