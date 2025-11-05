'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { LavaRapido } from 'app/models/lava-rapidos'
import { httpClient } from 'app/http'

type Servico = {
  id: number
  servico: string
  duracao?: number
  descricao?: string
  valor?: number
}

export const AgendamentoForm: React.FC = () => {
  const [lavaRapidos, setLavaRapidos] = useState<LavaRapido[] | null>(null)
  const [servicos, setServicos] = useState<Servico[] | null>(null)
  const [lavaId, setLavaId] = useState<number | ''>('')
  const [servicoId, setServicoId] = useState<number | ''>('')

  useEffect(() => {
    let cancelled = false
    httpClient.get('/api/lava-rapidos')
      .then(res => { if (!cancelled) setLavaRapidos(res.data) })
      .catch(err => { if (!cancelled) console.error(err) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!lavaId) {
      setServicos(null)
      setServicoId('')
      return
    }

    const selecionado = lavaRapidos?.find(l => Number(l.id) === Number(lavaId))
    const nome = selecionado?.razaoSocial?.trim() ?? ''

    if (!nome) {
      setServicos(null)
      setServicoId('')
      return
    }

    let cancelled = false
    setServicos(null)

    ;(async () => {
      try {
        const q = encodeURIComponent(nome)
        const res = await httpClient.get(`/api/servicos?razaoSocial=${q}`)
        if (!cancelled) {
          setServicos(res.data)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Erro ao buscar serviços por razaoSocial:', err)
          setServicos([])
        }
      }
    })()

    return () => { cancelled = true }
  }, [lavaId, lavaRapidos])

  return (
    <form>
      <div className="columns">
        <div className="column is-half">
          <div className="field has-addons">
            <div className="control is-expanded">
              <div className="select is-fullwidth">
                <select
                  name="lavaRapido"
                  value={lavaId}
                  onChange={e => {
                    const v = e.target.value
                    setLavaId(v === '' ? '' : Number(v))
                  }}
                >
                  <option value="">-- selecione --</option>
                  {lavaRapidos?.map(l => (
                    <option key={l.id} value={l.id}>{l.razaoSocial}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="control">
              <button type="button" className="button is-primary" onClick={() => {/* opcional ação */}}>
                Selecionar Lava-Rápido
              </button>
            </div>
          </div>
        </div>

        <div className="column is-half">
          <div className="field has-addons">
            <div className="control is-expanded">
              <div className="select is-fullwidth">
                <select
                  name="servico"
                  value={servicoId}
                  onChange={e => setServicoId(e.target.value === '' ? '' : Number(e.target.value))}
                  disabled={!servicos || servicos.length === 0}
                >
                  <option value="">-- selecione --</option>
                  {servicos?.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.servico} {s.duracao ? `(${s.duracao} min)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="control">
              <button type="button" className="button is-primary" onClick={() => {/* opcional ação */}}>
                Selecionar serviço
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
