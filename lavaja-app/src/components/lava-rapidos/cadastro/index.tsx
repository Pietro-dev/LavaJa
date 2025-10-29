'use client'

import { Layout } from 'components'
import { LavaRapidoForm } from './form'
import { LavaRapido } from 'app/models/lava-rapidos'
import { use, useState } from 'react'
import { useLavaRapidoService } from 'app/services'

export const CadastroLavaRapido: React.FC = () => {

    const [lavaRapido, setLavaRapido] = useState<LavaRapido>({})
    const service = useLavaRapidoService()

    const handleSubmit = (lavaRapido: LavaRapido) => {
        console.log(lavaRapido)
        if(lavaRapido.id){
            service.atualizar(lavaRapido).then(response => {
                console.log('Atualizado')
            })
        }else {
            service.salvar(lavaRapido).then(lavaRapidoSalvo => {
                setLavaRapido(lavaRapidoSalvo)
                console.log(lavaRapidoSalvo)
            })
        }
    }

    return (
        <Layout titulo='Lava Rápidos'>
            <LavaRapidoForm lavaRapido={lavaRapido} onSubmit={handleSubmit}/>
        </Layout>
    )
}