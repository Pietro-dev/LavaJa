"use client"

import { Layout } from 'components'
import { use, useEffect, useState } from 'react'
import { useUsuarioService } from 'app/services'
import { Alert } from 'components/common/message'
import { FormCadastroUsuarios } from "./form"
import { useSearchParams } from 'next/navigation'
import { Usuario } from 'app/models/usuarios'

export const CadastroUsuarios: React.FC = () => {

    const [usuario, setUsuario] = useState<Usuario>({})
    const [messages, setMessages] = useState<Array<Alert>>([])
    const service = useUsuarioService()
    const searchParams = useSearchParams()
    const queryId = searchParams.get('id')

    useEffect(() => {
        if(queryId){
            service.carregarUsuario(queryId).then(setUsuario)
        }
    }, [queryId])

    const handleSubmit = (usuario: Usuario) => {
        if(usuario.id){
            service.atualizar(usuario).then(response => {
                setMessages([
                    {texto: "Usuário atualizado com sucesso!", tipo: "success", titulo: "Sucesso!"}
                ])
            })
        }else {
            service.salvar(usuario).then(usuarioSalvo => {
                setUsuario(usuarioSalvo)
                setMessages([
                    { texto:"Usuário salvo com sucesso!", tipo:"success", titulo:"Sucesso!" }
                ])
            })
        }
    }

    return (
        <Layout titulo='Usuários' mensagens={messages}>
            <FormCadastroUsuarios usuario={usuario} onSubmit={handleSubmit}/>
        </Layout>
    )
}