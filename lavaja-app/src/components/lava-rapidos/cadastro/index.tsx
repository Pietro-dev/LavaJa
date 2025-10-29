'use client'

import { Layout } from 'components'
import { LavaRapidoForm } from './form'
import { LavaRapido } from 'app/models/lava-rapidos'
import { use, useState } from 'react'
import { useLavaRapidoService } from 'app/services'
import { Alert } from 'components/common/message'

export const CadastroLavaRapido: React.FC = () => {

    const [lavaRapido, setLavaRapido] = useState<LavaRapido>({})
    const [messages, setMessages] = useState<Array<Alert>>([])
    const service = useLavaRapidoService()

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