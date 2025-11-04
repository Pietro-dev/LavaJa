'use client'

import { Input, Layout, Loader } from "components"
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
import { useFormik } from "formik"
import { DataTable } from 'primereact/datatable'
import { Column } from "primereact/column"

interface ConsultaLavaRapidosForm {
    razaoSocial?: string
    cnpj?: string
}

export const ListagemLavaRapidos: React.FC = () => {

    // const [ lavaRapidos, setLavaRapidos ] = useState<LavaRapido[]>([
    //     {
    //         id: "1",
    //         razaoSocial: "Lava Rapido"
    //     }
    // ])

    // const handleSubmit = (filtro: ConsultaLavaRapidosForm) => {
    //     console.log(filtro)
    // }

    // const formik = useFormik<ConsultaLavaRapidosForm> ({
    //     onSubmit: handleSubmit,
    //     initialValues: { razaoSocial: "", cnpj: ""}
    // })

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

            {/* <form onSubmit={formik.handleSubmit}> 
                <div className="columns">
                    <Input onChange={formik.handleChange} columnClasses="is-half" id="razaoSocial" name="razaoSocial" value={formik.values.razaoSocial} label="Razão Social"></Input>
                    <Input onChange={formik.handleChange} columnClasses="is-half" id="cnpj" name="cnpj" value={formik.values.cnpj} label="CNPJ"></Input>
                </div>
                <div className="field is-grouped">
                    <div className="control is-link">
                        <button className="button is-primary is-dark" type="submit">Consultar</button>
                    </div>
                </div>
            </form> */}
            {/* <br />
            <br /> */}

            {/* <div className="columns">
                <div className="is-full">
                    <DataTable value={lavaRapidos}>
                        <Column field="id" header="Código"></Column>
                        <Column field="razaoSocial" header="Razão Social"></Column>
                        <Column field="cnpj" header="CNPJ"></Column>
                        <Column field="endereco" header="Endereço"></Column>
                        <Column field="telefone" header="Telefone"></Column>
                        <Column field="email" header="E-mail"></Column>
                    </DataTable>
                </div>
            </div> */}

            <Link href="/cadastros/lava-rapidos">
                <button className="button is-primary is-dark">Novo</button>
                <br />
                <br />
            </Link>
            <TabelaLavaRapido onEdit={editar} onDelete={deletar} lavaRapidos={lista || []}/>
        </Layout>
    )
}