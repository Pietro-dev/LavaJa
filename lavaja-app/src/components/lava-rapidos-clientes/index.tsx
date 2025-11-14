'use client'

import { Layout, Loader } from "components"
import { useLavaRapidoService } from "app/services"
import { useEffect, useState } from "react"
import { Alert } from "components/common/message"
import { useRouter } from "next/navigation"
import { httpClient } from "app/http"
import { LavaRapido } from "app/models/lava-rapidos"
import { AxiosResponse } from "axios"
import useSWR from "swr"

export const ListagemLavaRapidosCliente: React.FC = () => {

    const service = useLavaRapidoService()
    const [messages, setMessages] = useState<Array<Alert>>([])
    const router = useRouter()
    const { data: result } = useSWR<AxiosResponse<LavaRapido[]>>(
        '/api/lava-rapidos',
        (url: string) => httpClient.get(url)
    )
    const [lista, setLista] = useState<LavaRapido[]>()

    useEffect(() => {
        setLista(result?.data)
    }, [result])

    const verServicos = (lavaRapido: LavaRapido) => {
        if (!lavaRapido.id) return
        router.push(`/clientes/lava-rapidos/${lavaRapido.id}/servicos`)
    }

    if (!result) {
        return <Loader show={!result} />
    }

    return (
        <Layout titulo='Lava-rápidos cadastrados' mensagens={messages}>
            {(!lista || lista.length === 0) && (
                <div className="notification is-info">
                    Nenhum lava-rápido encontrado.
                </div>
            )}

            <div className="columns is-multiline">
                {(lista || []).map((lr) => (
                    <div key={lr.id} className="column is-12-mobile is-6-tablet is-4-desktop">
                        <div className="card">
                            <div className="card-content">
                                <p className="title is-5">{lr.razaoSocial}</p>
                                {lr.cnpj && <p className="is-size-7 mb-1"><strong>CNPJ:</strong> {lr.cnpj}</p>}
                                {lr.endereco && <p className="is-size-7 mb-1"><strong>Endereço:</strong> {lr.endereco}</p>}
                                {lr.telefone && <p className="is-size-7 mb-1"><strong>Telefone:</strong> {lr.telefone}</p>}
                                {lr.email && <p className="is-size-7 mb-1"><strong>Email:</strong> {lr.email}</p>}
                                {lr.dataCadastro && <p className="is-size-7 has-text-grey"><strong>Cadastrado em:</strong> {lr.dataCadastro}</p>}
                            </div>

                            <footer className="card-footer">
                                <button
                                    onClick={() => verServicos(lr)}
                                    className="card-footer-item button is-info is-dark"
                                    style={{ border: "none" }}
                                >
                                    Ver serviços
                                </button>
                            </footer>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}
