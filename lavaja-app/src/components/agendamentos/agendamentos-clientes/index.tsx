// components/agendamentos-clientes/index.tsx
'use client'

import React, { useEffect, useState } from 'react'
import httpClient from 'app/http'

export interface AgendamentoClienteFormProps {
  servicoId: number
  usuarioId?: number
  lavaRapidoId: number
  onSuccess?: () => void
  onError?: (errorMessage: string) => void
  onCancel: () => void
}

export default function AgendamentoClienteForm({
  servicoId,
  usuarioId,
  onSuccess,
  onError,
  onCancel
}: AgendamentoClienteFormProps) {
  const [inicioLocal, setInicioLocal] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [effectiveUsuarioId, setEffectiveUsuarioId] = useState<number | undefined>(usuarioId)

  // Busca o ID do usuário no localStorage se não veio por props
  useEffect(() => {
    if (!usuarioId && typeof window !== 'undefined') {
      const storedUsuarioId = localStorage.getItem('usuarioId')
      const storedUserId = localStorage.getItem('userId')
      
      if (storedUsuarioId) {
        const id = Number(storedUsuarioId)
        if (!isNaN(id)) setEffectiveUsuarioId(id)
      } else if (storedUserId) {
        const id = Number(storedUserId)
        if (!isNaN(id)) setEffectiveUsuarioId(id)
      }
    } else {
      setEffectiveUsuarioId(usuarioId)
    }
  }, [usuarioId])

  // Formata para o formato DD/MM/YYYY HH:mm
  const formatarDataParaBackend = (datetimeLocal: string): string => {
    const [datePart, timePart] = datetimeLocal.split('T')
    const [year, month, day] = datePart.split('-')
    const [hour, minute] = timePart.split(':')
    return `${day}/${month}/${year} ${hour}:${minute}`
  }

  // Validações básicas
  const validarFormulario = (): boolean => {
    if (!effectiveUsuarioId) {
      setError('Usuário não identificado. Faça login novamente.')
      return false
    }

    if (!inicioLocal) {
      setError('Selecione data e hora para o agendamento.')
      return false
    }

    return true
  }

  const getMinDateTime = (): string => {
  const now = new Date()
  // Ajusta para o fuso horário local e formata para o formato datetime-local
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validarFormulario()) return

    // Verificar autenticação
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Sessão expirada. Faça login novamente.')
      return
    }

    const payload = {
      servicoId,
      usuarioId: effectiveUsuarioId!,
      inicio: formatarDataParaBackend(inicioLocal)
    }

    setLoading(true)

    try {
      console.log('📤 Criando agendamento...', payload)
      
      // Faz a requisição principal de criação do agendamento
      const response = await httpClient.post('/api/agendamentos', payload)
      
      console.log('✅ Agendamento criado com sucesso:', response.data)

      // ✅ Chama callback de sucesso
      if (onSuccess) {
        onSuccess()
      }

      // Fecha o modal
      onCancel()
      
    } catch (err: any) {
      console.error('❌ Erro ao criar agendamento:', err)
      
      const errorMessage = err.response?.data?.message || 'Erro ao criar agendamento. Tente novamente.'
      
      // ✅ Chama callback de erro OU mostra erro localmente
      if (onError) {
        onError(errorMessage)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal is-active" role="dialog" aria-modal="true" aria-label="Agendar Serviço">
      <div className="modal-background" onClick={loading ? undefined : onCancel}></div>

      <div className="modal-card" style={{ maxWidth: 640 }}>
        <header className="modal-card-head">
          <p className="modal-card-title">Agendar Serviço</p>
          <button 
            className="delete" 
            aria-label="Fechar" 
            onClick={onCancel}
            disabled={loading}
          ></button>
        </header>

        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Data e hora</label>
              <div className="control">
                <input
                  type="datetime-local"
                  className="input"
                  value={inicioLocal}
                  onChange={(e) => setInicioLocal(e.target.value)}
                  disabled={loading}
                  aria-label="Data e hora do agendamento"
                  min={getMinDateTime()}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="notification is-danger is-light">
                <strong>Erro:</strong> {error}
              </div>
            )}

            <div className="field is-grouped is-grouped-right mt-4">
              <div className="control">
                <button
                  type="button"
                  className="button"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>

              <div className="control">
                <button
                  type="submit"
                  className={`button is-primary ${loading ? 'is-loading' : ''}`}
                  disabled={loading || !effectiveUsuarioId}
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}