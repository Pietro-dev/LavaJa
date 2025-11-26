'use client'

import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'
import { Input } from 'components'
import { LavaRapido } from 'app/models/lava-rapidos'
import { httpClient } from 'app/http'
import { Agendamento } from 'app/models/agendamentos'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

type Servico = {
  id?: number
  servico?: string
  duracao?: number
  descricao?: string
  valor?: number
  lavaRapidoId?: number
  lavaRapido?: { id?: number; razaoSocial?: string }
}

type AgendamentoValues = {
  id?: string
  lavaRapidoId?: string
  servicoId?: string
  usuarioId?: string
  inicio?: string
  servicoNome?: string
  lavaRapidoNome?: string
  dataCriacao?: string
}

interface AgendamentoFormProps {
  agendamento?: Agendamento
  onSubmit: (agendamento: Agendamento) => void
}

const emptyValues: AgendamentoValues = {
  id: '',
  lavaRapidoId: '',
  servicoId: '',
  usuarioId: '',
  inicio: '',
  servicoNome: '',
  lavaRapidoNome: '',
  dataCriacao: ''
}

const schema = Yup.object({
  lavaRapidoId: Yup.string().required('Campo obrigatório'),
  servicoId: Yup.string().required('Campo obrigatório'),
  usuarioId: Yup.mixed()
    .transform((v, o) => (o === '' ? undefined : v))
    .nullable()
    .test('is-number-or-empty', 'ID inválido', v => (v === undefined || v === null) ? true : !Number.isNaN(Number(v))),
  inicio: Yup.string().required('Campo obrigatório').test('is-date', 'Data/hora inválida', v => !!v && dayjs(v).isValid())
})

const backendToInput = (backend?: string | null) => {
  if (!backend) return ''
  const d = dayjs(backend, 'DD/MM/YYYY HH:mm', true)
  return d.isValid() ? d.format('YYYY-MM-DDTHH:mm') : ''
}

const inputToBackend = (input?: string | null) => {
  if (!input) return undefined
  const d = dayjs(input)
  return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : undefined
}

export const AgendamentoForm: React.FC<AgendamentoFormProps> = ({ agendamento, onSubmit }) => {
  const [lavaRapidos, setLavaRapidos] = useState<LavaRapido[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const isEditMode = !!agendamento?.id

  const initialValues: AgendamentoValues = React.useMemo(() => {
    if (!agendamento) return emptyValues
    return {
      id: agendamento.id ? String(agendamento.id) : '',
      lavaRapidoId: agendamento.lavaRapidoId ? String(agendamento.lavaRapidoId) : '',
      servicoId: agendamento.servicoId ? String(agendamento.servicoId) : '',
      usuarioId: agendamento.usuarioId ? String(agendamento.usuarioId) : '',
      inicio: backendToInput(agendamento.inicio ?? ''),
      servicoNome: agendamento.servicoNome ?? '',
      lavaRapidoNome: agendamento.lavaRapidoNome ?? '',
      dataCriacao: agendamento.dataCriacao ?? ''
    }
  }, [agendamento])

  const formik = useFormik<AgendamentoValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: values => {
      const payload: Agendamento = {
        id: values.id ? String(values.id) : undefined,
        dataCriacao: values.dataCriacao ? String(values.dataCriacao) : undefined,
        servicoId: values.servicoId ? Number(values.servicoId) : undefined,
        usuarioId: values.usuarioId ? Number(values.usuarioId) : undefined,
        lavaRapidoId: values.lavaRapidoId ? Number(values.lavaRapidoId) : undefined,
        servicoNome: values.servicoNome ?? undefined,
        lavaRapidoNome: values.lavaRapidoNome ?? undefined,
        inicio: inputToBackend(values.inicio)
      }
      onSubmit(payload)
    }
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    httpClient.get<LavaRapido[]>('/api/lava-rapidos')
      .then(r => { if (!cancelled) setLavaRapidos(r.data) })
      .catch(err => { if (!cancelled) console.error(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const lavaId = formik.values.lavaRapidoId
    if (!lavaId) {
      setServicos([])
      return
    }

    // Encontra o lava-rápido selecionado para obter a razaoSocial
    const lavaRapidoSelecionado = lavaRapidos.find(l => String(l.id) === String(lavaId))
    if (!lavaRapidoSelecionado) {
      setServicos([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        // Usa o endpoint com razaoSocial para filtrar os serviços
        const razaoSocial = encodeURIComponent(lavaRapidoSelecionado.razaoSocial ?? '')
        const res = await httpClient.get<Servico[]>(`/api/servicos?razaoSocial=${razaoSocial}`)
        if (cancelled) return

        const data = res.data || []
        
        // Filtro adicional por segurança para garantir que são serviços do lava-rápido correto
        const filtered = data.filter(s => {
          const sLavaId = s.lavaRapidoId ?? s.lavaRapido?.id
          return sLavaId !== undefined && String(sLavaId) === String(lavaId)
        })

        setServicos(filtered)
      } catch (err) {
        if (!cancelled) {
          console.error('Erro ao carregar serviços:', err)
          setServicos([])
        }
      }
    })()

    return () => { cancelled = true }
  }, [formik.values.lavaRapidoId, lavaRapidos])

  if (loading) return <div>Carregando...</div>

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.values.id && (
        <div className="field is-horizontal">
          <Input id="id" name="id" label="Código:" value={String(formik.values.id)} disabled onChange={() => {}} />
          <Input id="dataCriacao" name="dataCriacao" label="Data de criação:" value={String(formik.values.dataCriacao ?? '')} disabled onChange={() => {}} />
        </div>
      )}

      <div className="columns">
        <div className="column is-one-third">
          {isEditMode ? (
            <Input label="Lava-Rápido" id="lavaRapidoNome" name="lavaRapidoNome" value={formik.values.lavaRapidoNome ?? ''} disabled onChange={() => {}} />
          ) : (
            <>
              <label className="label">Lava-Rápido</label>
              <div className="select is-fullwidth">
                <select
                  id="lavaRapidoId"
                  name="lavaRapidoId"
                  value={formik.values.lavaRapidoId ?? ''}
                  onChange={e => {
                    const v = e.target.value
                    formik.setFieldValue('lavaRapidoId', v)
                    formik.setFieldValue('servicoId', '')
                    setServicos([])
                  }}
                >
                  <option value="">-- selecione --</option>
                  {lavaRapidos.map(l => <option key={l.id} value={String(l.id)}>{l.razaoSocial}</option>)}
                </select>
              </div>
              {formik.touched.lavaRapidoId && formik.errors.lavaRapidoId && <div className="help is-danger">{formik.errors.lavaRapidoId}</div>}
            </>
          )}
        </div>

        <div className="column is-one-third">
          {isEditMode ? (
            <Input label="Serviço" id="servicoNome" name="servicoNome" value={formik.values.servicoNome ?? ''} disabled onChange={() => {}} />
          ) : (
            <>
              <label className="label">Serviço</label>
              <div className="select is-fullwidth">
                <select
                  id="servicoId"
                  name="servicoId"
                  value={formik.values.servicoId ?? ''}
                  onChange={e => formik.setFieldValue('servicoId', e.target.value)}
                  disabled={servicos.length === 0}
                >
                  <option value="">-- selecione --</option>
                  {servicos.map(s => (
                    <option key={s.id} value={String(s.id)}>
                      {s.servico} {s.duracao ? `(${s.duracao} min)` : ''} - R$ {s.valor}
                    </option>
                  ))}
                </select>
              </div>
              {formik.touched.servicoId && formik.errors.servicoId && <div className="help is-danger">{formik.errors.servicoId}</div>}
              {!isEditMode && servicos.length === 0 && formik.values.lavaRapidoId && (
                <div className="help is-warning">Nenhum serviço encontrado para este lava-rápido</div>
              )}
            </>
          )}
        </div>

        <div className="column is-one-third">
          <Input id="usuarioId" name="usuarioId" label="Usuário ID" value={String(formik.values.usuarioId ?? '')} onChange={formik.handleChange} disabled={isEditMode} />
          {formik.touched.usuarioId && formik.errors.usuarioId && <div className="help is-danger">{String(formik.errors.usuarioId)}</div>}
        </div>
      </div>

      <div className="column is-one-third">
        <label className="label">Data e Hora do Agendamento</label>
        <div className="field">
          <div className="control is-expanded">
            <input id="inicio" name="inicio" type="datetime-local" className="input" value={formik.values.inicio ?? ''} onChange={formik.handleChange} />
          </div>
          {formik.touched.inicio && formik.errors.inicio && <div className="help is-danger">{String(formik.errors.inicio)}</div>}
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-primary is-dark" type="submit" disabled={formik.isSubmitting}>
            {formik.values.id ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
        <div className="control">
          <Link href="/consultas/agendamentos"><button type="button" className="button">Voltar</button></Link>
        </div>
      </div>
    </form>
  )
}