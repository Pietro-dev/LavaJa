'use client'

import { Layout, Loader } from "components"
import { Alert } from "components/common/message"
import Link from "next/link"
import { useEffect, useState } from "react"
import { TabelaAgendamento } from "./tabela"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { AxiosResponse } from "axios"
import { Agendamento } from "app/models/agendamentos"
import { httpClient } from "app/http"
import { useAgendamentoService } from "app/services"

export const ListagemAgendamentos: React.FC = () => {

    const service = useAgendamentoService()
    const [messages, setMessages] = useState<Array<Alert>>([])
    const router = useRouter()
    const { data:result, error } = useSWR<AxiosResponse<Agendamento[]>>('/api/agendamentos', (url:string) => httpClient.get(url) ) 
    const [lista, setLista] = useState<Agendamento[]>()

    useEffect(()=>{
        setLista(result?.data)
    }, [result])

    const editar = (agendamento: Agendamento) => {
        const url = `/cadastros/agendamentos?id=${agendamento.id}`
        router.push(url)
    }

    const deletar = (agendamento:Agendamento) => {
        if (!agendamento.id) return

        service.deletar(agendamento.id).then(response => {
            setMessages([
                { texto:"Lava-rápido excluído com sucesso!", tipo:"success", titulo:"Sucesso!" }
            ])
            const listaAlterada = lista?.filter(s => s.id !== agendamento.id)
            setLista(listaAlterada)
        })
    }

    if(!result){
        return(
            <Loader show={!result}/>
        )
    }
    
    return (
        <Layout titulo="Agendamentos Cadastrados" mensagens={messages}>
            <Link href="cadastros/agendamentos">
                <button className="button is-primary is-dark">Novo</button>
                <br />
                <br />
            </Link>
            <TabelaAgendamento onEdit={editar} onDelete={deletar} agendamentos={lista || []}/>
        </Layout>
    )
}