'use client'

import { useEffect, useState } from 'react'
import httpClient from 'app/http'
import { useServicoService } from 'app/services'
import AgendamentoClienteForm from '../agendamentos/agendamentos-clientes/index'
import { Layout } from 'components/layout'

interface Servico {
  id?: string
  servico?: string
  descricao?: string
  valor?: number | null
  duracao?: number | null
  lavaRapidoId?: string
}

interface LavaRapido {
  id?: string
  razaoSocial?: string
  nomeFantasia?: string
}

interface ServicosListProps {
  lavaRapidoId: string
  usuarioId?: string
  showTitle?: boolean
}

export default function ServicosList({ lavaRapidoId, usuarioId, showTitle = true }: ServicosListProps) {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [lavaRapido, setLavaRapido] = useState<LavaRapido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null)
  const [showAgendamento, setShowAgendamento] = useState(false)

  const servicoService = useServicoService()

  const getUsuarioIdFromStorage = (): string | null => {
    try {
      const id = localStorage.getItem('usuarioId') || localStorage.getItem('userId')
      if (id) return id

      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.id || user.usuarioId || null
      }
      return null
    } catch (e) {
      console.error('❌ Erro ao obter usuário do storage:', e)
      return null
    }
  }

  useEffect(() => {
    if (lavaRapidoId) fetchDados()
  }, [lavaRapidoId])

  const fetchDados = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')
      console.log('🔍 Iniciando carregamento de serviços...')
      console.log('🪪 Token disponível?', !!token)
      console.log('🏢 Lava Rápido ID:', lavaRapidoId)

      if (!token) {
        setError('Usuário não autenticado.')
        return
      }

      const servicosData = await servicoService.getByLavaRapido(lavaRapidoId)
      console.log('📦 Serviços carregados:', servicosData)
      setServicos(servicosData)

      const lavaRapidoRes = await httpClient.get<LavaRapido>(`/api/lava-rapidos/${lavaRapidoId}`)
      console.log('🏭 Lava-rápido carregado:', lavaRapidoRes.data)
      setLavaRapido(lavaRapidoRes.data)
    } catch (err: any) {
      console.error('❌ Erro ao carregar dados:', err)
      setError('Não foi possível carregar os serviços.')
    } finally {
      setLoading(false)
    }
  }

  const handleAgendamento = (servico: Servico) => {
    const userType = localStorage.getItem('userType')
    console.log('🧩 Tipo de usuário:', userType)

    if (userType !== 'CLIENTE') {
      alert('Apenas clientes podem fazer agendamentos. Faça login como cliente.')
      window.location.href = '/login'
      return
    }

    const effectiveUsuarioId = usuarioId || getUsuarioIdFromStorage()
    console.log('👤 Usuario ID detectado:', effectiveUsuarioId)

    if (!effectiveUsuarioId) {
      alert('Usuário não identificado. Faça login novamente.')
      window.location.href = '/login'
      return
    }

    setServicoSelecionado(servico)
    setShowAgendamento(true)
  }

  // ✅ CORREÇÃO: Apenas lida com o sucesso do agendamento
  const handleAgendamentoSuccess = () => {
    console.log('✅ Agendamento criado com sucesso!')
    alert('Agendamento realizado com sucesso!')
    setShowAgendamento(false)
    setServicoSelecionado(null)
    // Opcional: recarregar dados se necessário
    // fetchDados()
  }

  // ✅ CORREÇÃO: Lida com erros do agendamento
  const handleAgendamentoError = (errorMessage: string) => {
    console.error('❌ Erro no agendamento:', errorMessage)
    alert(`Erro ao realizar agendamento: ${errorMessage}`)
  }

  if (loading)
    return (
      <div className="section has-text-centered">
        <p>Carregando serviços...</p>
      </div>
    )

  if (error)
    return (
      <div className="section has-text-centered">
        <div className="notification is-danger">
          {error}
          <div className="buttons is-centered mt-3">
            <button className="button is-light" onClick={fetchDados}>
              Tentar novamente
            </button>
            <button
              className="button is-primary"
              onClick={() => (window.location.href = '/login')}
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    )

  return (
    <Layout
      titulo={`Serviços ${
        lavaRapido ? `- ${lavaRapido.razaoSocial || lavaRapido.nomeFantasia}` : ''
      }`}
      subtitulo={lavaRapido ? 'Confira nossos serviços disponíveis' : ''}
    >
      <div className="section">
        <div className="container">
          <div className="columns is-multiline">
            {servicos.map((servico) => (
              <div key={servico.id} className="column is-one-third">
                <div className="card">
                  <div className="card-content">
                    <h3 className="title is-4">{servico.servico ?? 'Serviço sem nome'}</h3>
                    <p className="subtitle is-6 mb-3">
                      {servico.descricao ?? 'Sem descrição disponível'}
                    </p>

                    <div className="is-flex is-justify-content-space-between mb-4">
                      <span className="title is-5 has-text-success">
                        R$ {(servico.valor ?? 0).toFixed(2)}
                      </span>
                      <span className="tag is-info">{servico.duracao ?? 0} min</span>
                    </div>

                    <button
                      className="button is-primary is-fullwidth"
                      onClick={() => handleAgendamento(servico)}
                    >
                      Agendar Serviço
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {servicos.length === 0 && (
              <div className="has-text-centered py-6">
                <div className="notification is-warning is-light">
                  Nenhum serviço disponível para este lava-rápido.
                </div>
              </div>
            )}
          </div>

          {/* Modal do agendamento */}
          {showAgendamento && servicoSelecionado && (
            <div className="mt-5">
              <AgendamentoClienteForm
                servicoId={Number(servicoSelecionado.id)}
                usuarioId={Number(usuarioId || getUsuarioIdFromStorage())}
                lavaRapidoId={Number(lavaRapidoId)}
                onSuccess={handleAgendamentoSuccess} // ✅ Apenas callback de sucesso
                onError={handleAgendamentoError}     // ✅ Callback de erro
                onCancel={() => {
                  setShowAgendamento(false)
                  setServicoSelecionado(null)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}