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
    const [messages, setMessages] = useState<Array<Alert>>([])
    const router = useRouter()
    
    // 🔥 ESTADOS PARA CONTROLE DE USUÁRIO
    const [isLavaRapido, setIsLavaRapido] = useState<boolean>(false)
    const [lavaRapidoId, setLavaRapidoId] = useState<string | null>(null)
    
    const getUserInfo = (): { isLavaRapido: boolean; lavaRapidoId: string | null } => {
        if (typeof window !== 'undefined') {
            const userType = localStorage.getItem('userType')
            const id = localStorage.getItem('lavaRapidoId')
            
            console.log('🔍 ListagemServicos - Debug:', {
                userType,
                lavaRapidoId: id,
                usuarioId: localStorage.getItem('usuarioId')
            })
            
            return {
                isLavaRapido: userType === 'LAVA_RAPIDO',
                lavaRapidoId: userType === 'LAVA_RAPIDO' ? id : null
            }
        }
        return { isLavaRapido: false, lavaRapidoId: null }
    }

    // 🔥 SWR CONDICIONAL - endpoint diferente para lava rápido
    const userInfo = getUserInfo()
    const endpoint = userInfo.isLavaRapido && userInfo.lavaRapidoId 
        ? `/api/servicos/${userInfo.lavaRapidoId}/servicos` 
        : '/api/servicos'
    
    const { data: result, error } = useSWR<AxiosResponse<Servico[]>>(
        endpoint, 
        (url: string) => httpClient.get(url)
    )
    
    const [lista, setLista] = useState<Servico[]>([])

    useEffect(() => {
        const info = getUserInfo()
        setIsLavaRapido(info.isLavaRapido)
        setLavaRapidoId(info.lavaRapidoId)
    }, [])

    useEffect(() => {
        setLista(result?.data || [])
    }, [result])

    const editar = (servico: Servico) => {
        let url = `/cadastros/servicos?id=${servico.id}`
        
        // 🔥 SE FOR LAVA RÁPIDO, ADICIONA O ID NA URL
        if (isLavaRapido && lavaRapidoId) {
            url += `&lavaRapidoId=${lavaRapidoId}`
        }
        
        router.push(url)
    }

    const deletar = (servico: Servico) => {
        if (!servico.id) return

        if (!confirm('Tem certeza que deseja excluir este serviço?')) {
            return
        }

        service.deletar(servico.id).then(response => {
            setMessages([
                { texto: "Serviço excluído com sucesso!", tipo: "success", titulo: "Sucesso!" }
            ])
            const listaAlterada = lista.filter(s => s.id !== servico.id)
            setLista(listaAlterada)
        }).catch(error => {
            setMessages([
                { texto: "Erro ao excluir serviço", tipo: "danger", titulo: "Erro!" }
            ])
        })
    }

    // 🔥 TÍTULO CONDICIONAL
    const getTitulo = () => {
        return isLavaRapido ? 'Meus Serviços' : 'Serviços Cadastrados'
    }

    const getSubtitulo = () => {
        return isLavaRapido ? 'Gerencie os serviços do seu estabelecimento' : undefined
    }

    if (error) {
        return (
            <Layout titulo={getTitulo()} mensagens={messages}>
                <div className="notification is-danger">
                    <p>❌ Erro ao carregar serviços</p>
                    <button 
                        className="button is-light mt-3"
                        onClick={() => window.location.reload()}
                    >
                        Tentar Novamente
                    </button>
                </div>
            </Layout>
        )
    }

    if (!result) {
        return <Loader show={true} />
    }

    return (
        <Layout titulo={getTitulo()} subtitulo={getSubtitulo()} mensagens={messages}>
            {/* 🔥 BOTÃO SEMPRE VISÍVEL, MAS COM COMPORTAMENTO DIFERENTE */}
            <Link href={isLavaRapido ? `/cadastros/servicos?lavaRapidoId=${lavaRapidoId}` : "/cadastros/servicos"}>
                <button className="button is-primary is-dark">
                    {isLavaRapido ? 'Novo Serviço' : 'Novo'}
                </button>
            </Link>
            
            <br />
            <br />
            
            <TabelaServicos onEdit={editar} onDelete={deletar} servicos={lista} />
        </Layout>
    )
}