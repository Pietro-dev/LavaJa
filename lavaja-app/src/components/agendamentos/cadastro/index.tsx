"use client"

import { Layout } from "components/layout"
import { AgendamentoForm } from "./form"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"
import { Alert } from "components/common/message"
import { useAgendamentoService } from "app/services"
import { Agendamento } from "app/models/agendamentos"

export const CadastroAgendamentos: React.FC = () => {

    const [agendamento, setAgendamento] = useState<Agendamento>({})
    const [messages, setMessages] = useState<Array<Alert>>([])
    const service = useAgendamentoService()
    const searchParams = useSearchParams()
    const queryId = searchParams.get('id')

    useEffect(() => {
        if(queryId){
            service.carregarAgendamento(queryId).then(setAgendamento)
        }
    }, [queryId])

    const handleSubmit = (agendamento: Agendamento) => {
        if(agendamento.id){
            service.atualizar(agendamento).then(response => {
                setMessages([
                    { texto:"Agendamento atualizado com sucesso!", tipo:"success", titulo:"Sucesso!" }
                ])
            })
        }else {
            service.salvar(agendamento).then(agendamentoSalvo => {
                setAgendamento(agendamentoSalvo)
                setMessages([
                    { texto:"Agendamento salvo com sucesso!", tipo:"success", titulo:"Sucesso!" }
                ])
            })
        }

    }
    return(
        <Layout titulo="Agendamentos" mensagens={messages}>
            <AgendamentoForm agendamento={agendamento} onSubmit={handleSubmit}/>
        </Layout>
    )
}