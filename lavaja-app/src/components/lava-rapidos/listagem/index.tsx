'use client'

import { Layout, Loader } from "components"
import { TabelaLavaRapido } from "./tabela"
import { useLavaRapidoService } from "app/services"
import { useEffect, useState } from "react"
import { Alert } from "components/common/message"
import { useRouter } from "next/navigation"
import { httpClient } from "app/http"
import { LavaRapido } from "app/models/lava-rapidos"
import { AxiosResponse } from "axios"
import useSWR from "swr"
import Link from "next/link"

interface ConsultaLavaRapidosForm {
    razaoSocial?: string
    cnpj?: string
}

export const ListagemLavaRapidos: React.FC = () => {

    const service = useLavaRapidoService()
    const [messages, setMessages] = useState<Array<Alert>>([])
    const router = useRouter()
    const { data:result, error } = useSWR<AxiosResponse<LavaRapido[]>>('/api/lava-rapidos', (url:string) => httpClient.get(url) ) 
    const [lista, setLista] = useState<LavaRapido[]>()

    useEffect(()=>{
        setLista(result?.data)
    }, [result])

    const editar = (lavaRapido:LavaRapido) => {
            const url = `/cadastros/lava-rapidos?id=${lavaRapido.id}`
            router.push(url)
    }

    const deletar = (lavaRapido:LavaRapido) => {
        if (!lavaRapido.id) return

        service.deletar(lavaRapido.id).then(response => {
        setMessages([
            { texto:"Lava-rápido excluído com sucesso!", tipo:"success", titulo:"Sucesso!" }
        ])
        const listaAlterada = lista?.filter(s => s.id !== lavaRapido.id)
        setLista(listaAlterada)
    })
    }

    if(!result){
        return(
            <Loader show={!result}/>
        )
    }

    return(
        <Layout titulo='Lava-rápidos cadastrados' mensagens={messages}>
            <Link href="/cadastros/lava-rapidos">
                <button className="button is-primary is-dark">Novo</button>
                <br />
                <br />
            </Link>
            <TabelaLavaRapido onEdit={editar} onDelete={deletar} lavaRapidos={lista || []}/>
        </Layout>
    )
}