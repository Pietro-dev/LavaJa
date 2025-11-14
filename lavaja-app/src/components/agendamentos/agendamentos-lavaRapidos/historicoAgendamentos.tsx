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
  usuarioTelefone?: string
  usuarioId: number
  servicoId: number
  lavaRapidoId: number
}

interface GerenciarAgendamentosProps {
  showTitulo?: boolean
  className?: string
}

export function GerenciarAgendamentos({ 
  showTitulo = true,
  className = ''
}: GerenciarAgendamentosProps) {
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<'TODOS' | 'AGENDADO' | 'CONFIRMADO' | 'FINALIZADO'>('TODOS')

  // Função auxiliar para obter o ID do lava rápido logado
  const getLoggedInLavaRapidoId = (): number | null => {
    const userType = localStorage.getItem('userType')
    
    // Só lava rápidos podem gerenciar agendamentos
    if (userType !== 'LAVA_RAPIDO') {
      return null
    }
    
    // Tenta pegar o ID do localStorage e converter para número
    const lavaRapidoIdStr = localStorage.getItem('lavaRapidoId')
    if (lavaRapidoIdStr) {
      const lavaRapidoId = parseInt(lavaRapidoIdStr, 10)
      return isNaN(lavaRapidoId) ? null : lavaRapidoId
    }
    
    return null
  }

  useEffect(() => {
    // DEBUG: Verifique o que está no localStorage
    console.log('🔍 DEBUG GerenciarAgendamentos - localStorage:', {
      userType: localStorage.getItem('userType'),
      lavaRapidoId: localStorage.getItem('lavaRapidoId'),
      token: localStorage.getItem('token'),
    })

    const loadAgendamentos = async () => {
      try {
        setLoading(true)
        
        // Busca o lavaRapidoId
        const lavaRapidoId = getLoggedInLavaRapidoId()
        
        if (!lavaRapidoId) {
          console.log('❌ Lava rápido não autenticado')
          console.log('📊 Debug localStorage:', {
            userType: localStorage.getItem('userType'),
            lavaRapidoId: localStorage.getItem('lavaRapidoId'),
            token: localStorage.getItem('token') ? '✅' : '❌'
          })
          router.push('/login/lava-rapidos')
          return
        }

        console.log('✅ Lava rápido autenticado, ID:', lavaRapidoId)
        console.log('🔍 Buscando agendamentos para lava rápido:', lavaRapidoId)

        // Busca do endpoint específico para lava rápidos
        const response = await httpClient.get<Agendamento[]>(`/api/agendamentos/lavaRapido/${lavaRapidoId}`)
        console.log('✅ Agendamentos carregados:', response.data.length)
        setAgendamentos(response.data)

      } catch (error: any) {
        console.error('❌ Erro ao carregar agendamentos:', error)
        
        // Log mais detalhado do erro
        if (error.response) {
          console.error('📊 Status:', error.response.status)
          console.error('📦 Data:', error.response.data)
        }
        
        setError('Não foi possível carregar os agendamentos')
      } finally {
        setLoading(false)
      }
    }

    loadAgendamentos()
  }, [router])

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

  // 🔥 FUNÇÃO CORRIGIDA: Converter data para ISO string
  const converterDataParaISO = (dataString: string): string => {
    // dataString vem como "DD/MM/YYYY HH:mm"
    const [data, hora] = dataString.split(' ')
    const [dia, mes, ano] = data.split('/')
    
    // Criar string ISO: "YYYY-MM-DDTHH:mm:00"
    return `${dia}-${mes}-${ano}T${hora}:00`
  }

  const atualizarStatusAgendamento = async (agendamento: Agendamento, novoStatus: 'CONFIRMADO' | 'CANCELADO' | 'FINALIZADO') => {
    const mensagens = {
      'CONFIRMADO': 'Tem certeza que deseja confirmar este agendamento?',
      'CANCELADO': 'Tem certeza que deseja cancelar este agendamento?',
      'FINALIZADO': 'Tem certeza que deseja marcar este agendamento como finalizado?'
    }

    if (!confirm(mensagens[novoStatus])) {
      return
    }

    try {
      console.log(`Tentando atualizar agendamento ${agendamento.id} para status:`, novoStatus)
      
      // Prepara o payload
      const payload = {
        servicoId: agendamento.servicoId,
        usuarioId: agendamento.usuarioId,
        status: novoStatus,
        inicio: agendamento.inicio // 🔥 AGORA ENVIA COMO ISO STRING
      }
      
      console.log('📤 Payload enviado:', payload)
      
      const response = await httpClient.put(`/api/agendamentos/${agendamento.id}`, payload)
      console.log('✅ Resposta da API:', response.data)
      
      // Atualizar lista localmente
      setAgendamentos(prev => 
        prev.map(ag => 
          ag.id === agendamento.id 
            ? { ...ag, status: novoStatus }
            : ag
        )
      )
      
      alert(`Agendamento ${getStatusText(novoStatus).toLowerCase()} com sucesso!`)
    } catch (error: any) {
      console.error('❌ Erro ao atualizar agendamento:', error)
      
      if (error.response) {
        console.error('📊 Resposta do erro:', error.response.data)
        console.error('🔴 Status do erro:', error.response.status)
        console.error('📋 Dados completos do erro:', error.response)
      }
      
      alert('Erro ao atualizar agendamento. Tente novamente.')
    }
  }

  const getBotoesDisponiveis = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return [
          { label: 'Confirmar', status: 'CONFIRMADO', cor: 'is-success' },
          { label: 'Cancelar', status: 'CANCELADO', cor: 'is-danger' }
        ]
      case 'CONFIRMADO':
        return [
          { label: 'Finalizar', status: 'FINALIZADO', cor: 'is-info' },
          { label: 'Cancelar', status: 'CANCELADO', cor: 'is-danger' }
        ]
      case 'FINALIZADO':
      case 'CANCELADO':
        return []
      default:
        return []
    }
  }

  // Filtrar agendamentos por status
  const agendamentosFiltrados = filtroStatus === 'TODOS' 
    ? agendamentos 
    : agendamentos.filter(ag => ag.status === filtroStatus)

  // Ordenar por data (mais recentes primeiro)
  const agendamentosOrdenados = agendamentosFiltrados.sort((a, b) => 
    dayjs(b.inicio, 'DD/MM/YYYY HH:mm').valueOf() - dayjs(a.inicio, 'DD/MM/YYYY HH:mm').valueOf()
  )

  const agendamentosFuturos = agendamentosOrdenados.filter(ag => 
    dayjs(ag.inicio, 'DD/MM/YYYY HH:mm').isAfter(dayjs())
  )

  const agendamentosPassados = agendamentosOrdenados.filter(ag => 
    dayjs(ag.inicio, 'DD/MM/YYYY HH:mm').isBefore(dayjs())
  )

  if (loading) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <span className="icon is-large">
            <i className="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p>Carregando agendamentos...</p>
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
      {showTitulo && (
        <div className="level">
          <div className="level-left">
            <h1 className="title is-3">Gerenciar Agendamentos</h1>
          </div>
          <div className="level-right">
            <div className="field">
              <div className="control">
                <div className="select">
                  <select 
                    value={filtroStatus} 
                    onChange={(e) => setFiltroStatus(e.target.value as any)}
                  >
                    <option value="TODOS">Todos os status</option>
                    <option value="AGENDADO">Agendados</option>
                    <option value="CONFIRMADO">Confirmados</option>
                    <option value="FINALIZADO">Finalizados</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas Rápidas */}
      <div className="columns mb-6">
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-3">{agendamentos.filter(a => a.status === 'AGENDADO').length}</p>
            <p className="heading">Agendados</p>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-3">{agendamentos.filter(a => a.status === 'CONFIRMADO').length}</p>
            <p className="heading">Confirmados</p>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-3">{agendamentos.filter(a => a.status === 'FINALIZADO').length}</p>
            <p className="heading">Finalizados</p>
          </div>
        </div>
        <div className="column">
          <div className="box has-text-centered">
            <p className="title is-3">{agendamentos.length}</p>
            <p className="heading">Total</p>
          </div>
        </div>
      </div>

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
                        <p className="subtitle is-6">
                          <strong>Cliente:</strong> {agendamento.usuarioNome}
                        </p>
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

                      {/* Botões de ação */}
                      <div className="buttons is-right mt-3">
                        {getBotoesDisponiveis(agendamento.status).map(botao => (
                          <button
                            key={botao.status}
                            className={`button is-small ${botao.cor}`}
                            onClick={() => atualizarStatusAgendamento(agendamento, botao.status as any)}
                          >
                            <span>{botao.label}</span>
                          </button>
                        ))}
                      </div>
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
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Serviço</th>
                  {/* <th>Cliente</th> */}
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
              Seu estabelecimento ainda não possui agendamentos.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}