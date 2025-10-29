'use client'

import { Layout } from 'components'
import { LavaRapidoForm } from './form'
import { LavaRapido } from 'app/models/lava-rapidos'
import { use, useEffect, useState } from 'react'
import { useLavaRapidoService } from 'app/services'
import { Alert } from 'components/common/message'

import { useSearchParams } from 'next/navigation'

export const CadastroLavaRapido: React.FC = () => {

    const [lavaRapido, setLavaRapido] = useState<LavaRapido>({})
    const [messages, setMessages] = useState<Array<Alert>>([])
    const service = useLavaRapidoService()
    const searchParams = useSearchParams()
    const queryId = searchParams.get('id')

    useEffect(() => {
        if(queryId){
            service.carregarLavaRapido(queryId).then(setLavaRapido)
        }
    }, [queryId])

    const handleSubmit = (lavaRapido: LavaRapido) => {
        if(lavaRapido.id){
            service.atualizar(lavaRapido).then(response => {
                setMessages([
                    { texto:"Lava-rápido atualizado com sucesso!", tipo:"success", titulo:"Sucesso!" }
                ])
            })
        }else {
            service.salvar(lavaRapido).then(lavaRapidoSalvo => {
                setLavaRapido(lavaRapidoSalvo)
                setMessages([
                    { texto:"Lava-rápido salvo com sucesso!", tipo:"success", titulo:"Sucesso!" }
                ])
            })
        }
    }

    return (
        <Layout titulo='Lava Rápidos' mensagens={messages}>
            <LavaRapidoForm lavaRapido={lavaRapido} onSubmit={handleSubmit}/>
        </Layout>
    )
}