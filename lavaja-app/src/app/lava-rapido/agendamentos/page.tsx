'use client'

import { Layout } from 'components/layout'
import { GerenciarAgendamentos } from '../../../components/agendamentos/agendamentos-lavaRapidos/historicoAgendamentos'

export default function HistoricoAgendamentosPage() {
  return (
    <Layout 
      titulo="Meus Agendamentos"
      subtitulo="Acompanhe seus agendamentos passados e futuros"
    >
      <GerenciarAgendamentos />
    </Layout>
  )
}