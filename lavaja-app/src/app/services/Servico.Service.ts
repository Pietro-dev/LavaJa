import { httpClient } from 'app/http'
import { Servico } from 'app/models/servicos'
import { AxiosResponse } from 'axios'

const resourceURL: string = "/api/servicos"

export const useServicoService = ()=>{

    const salvar = async (servico: Servico) : Promise<Servico> => {
        const response: AxiosResponse<Servico> = await httpClient.post<Servico>(resourceURL, servico)
        return response.data
    }

    const atualizar = async (servico: Servico) : Promise<void> => {
        const url:string = `${resourceURL}/${servico.id}`
        await httpClient.put<Servico>(url, servico)
    }

    const carregarServico = async (id:string) : Promise<Servico> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<Servico> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id:string) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    return {
        salvar,
        atualizar,
        carregarServico,
        deletar
    }
}