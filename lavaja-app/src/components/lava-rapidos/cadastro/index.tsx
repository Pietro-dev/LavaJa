'use client'

import { Layout } from 'components'
import { LavaRapidoForm } from './form'
import { LavaRapido } from 'app/models/lava-rapidos'
import { useState } from 'react'

export const CadastroLavaRapido: React.FC = () => {

    const [lavaRapido, setLavaRapido] = useState<LavaRapido>({})

    const handleSubmit = (lavaRapido: LavaRapido) => {
        console.log(lavaRapido)
    }

    return (
        <Layout titulo='Lava Rápidos'>
            <LavaRapidoForm lavaRapido={lavaRapido} onSubmit={handleSubmit}/>
        </Layout>
    )
}