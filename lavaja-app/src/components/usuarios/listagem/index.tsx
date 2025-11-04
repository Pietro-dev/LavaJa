'use client'

import { Layout, Loader } from "components"
import { TabelaUsuario } from "./tabela"
import { useUsuarioService } from "app/services"
import { useEffect, useState } from "react"
import { Alert } from "components/common/message"
import { useRouter } from "next/navigation"
import { httpClient } from "app/http"
import { Usuario } from "app/models/usuarios"
import { AxiosResponse } from "axios"
import useSWR from "swr"
import Link from "next/link"

export const ListagemUsuarios: React.FC = () => {

    const service = useUsuarioService()
    const [messages, setMessages] = useState<Array<Alert>>([])
    const router = useRouter()
    const { data:result, error } = useSWR<AxiosResponse<Usuario[]>>('/api/usuarios', (url:string) => httpClient.get(url) ) 
    const [lista, setLista] = useState<Usuario[]>()

    useEffect(()=>{
        setLista(result?.data)
    }, [result])

    const editar = (usuario:Usuario) => {
            const url = `/cadastros/usuarios?id=${usuario.id}`
            router.push(url)
    }

    const deletar = (usuario:Usuario) => {
        if (!usuario.id) return

        service.deletar(usuario.id).then(response => {
        setMessages([
            { texto:"Usuários excluído com sucesso!", tipo:"success", titulo:"Sucesso!" }
        ])
        const listaAlterada = lista?.filter(s => s.id !== usuario.id)
        setLista(listaAlterada)
    })
    }

    if(!result){
        return(
            <Loader show={!result}/>
        )
    }

    return(
        <Layout titulo='Usuários cadastrados' mensagens={messages}>
            <Link href="/cadastros/usuarios">
                <button className="button is-primary is-dark">Novo</button>
                <br />
                <br />
            </Link>
            <TabelaUsuario onEdit={editar} onDelete={deletar} usuarios={lista || []}/>
        </Layout>
    )
}