// app/clientes/agendamentos/historico/page.tsx
'use client'

import { Layout } from 'components/layout'
import { HistoricoAgendamentos } from '../../../components/agendamentos/agendamentos-clientes/historicoAgendamentos'

export default function HistoricoAgendamentosPage() {
  return (
    <Layout 
      titulo="Meus Agendamentos"
      subtitulo="Acompanhe seus agendamentos passados e futuros"
    >
      <HistoricoAgendamentos />
    </Layout>
  )
}