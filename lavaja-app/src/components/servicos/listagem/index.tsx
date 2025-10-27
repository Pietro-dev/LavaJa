'use client'

import { Layout, Loader } from 'components'
import Link from 'next/link'
import { TabelaServicos } from './tabela'
import { Servico } from 'app/models/servicos'
import useSWR from 'swr'
import { httpClient } from 'app/http'
import { AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import { useServicoService } from 'app/services'
import { useEffect, useState } from 'react'
import { Alert } from 'components/common/message'

export const ListagemServicos: React.FC = () => {
    const service = useServicoService()
    const [ messages, setMessages] = useState<Array<Alert>>([])
    const router = useRouter()
    const { data:result, error } = useSWR<AxiosResponse<Servico[]>>('/api/servicos', (url:string) => httpClient.get(url) ) 
    const [ lista, setLista ] = useState<Servico[]>()

    useEffect(()=>{
        setLista(result?.data)
    }, [result])

    const editar = (servico:Servico) => {
        const url = `/cadastros/servicos?id=${servico.id}`
        router.push(url)
    }
    const deletar = (servico:Servico) => {
        if (!servico.id)return

    service.deletar(servico.id).then(response => {
        setMessages([
            { texto:"Produto excluído com sucesso!", tipo:"success", titulo:"Sucesso!" }
        ])
        const listaAlterada = lista?.filter(s => s.id !== servico.id)
        setLista(listaAlterada)
    })
    }
    
    if(!result){
        return(
            <Loader show={!result}/>
        )
    }
    
    return(
        <Layout titulo='Serviços cadastrados' mensagens={messages}>
            <Link href="/cadastros/servicos">
                <button className="button is-primary is-dark">Novo</button>
                <br />
                <br />
            </Link>
            <TabelaServicos onEdit={editar} onDelete={deletar} servicos={lista || []}/>
        </Layout>
 
    )
}