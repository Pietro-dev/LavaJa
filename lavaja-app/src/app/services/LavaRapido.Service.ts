import { httpClient } from 'app/http'
import { LavaRapido } from 'app/models/lava-rapidos'
import { AxiosResponse } from 'axios'

const resourceURL: string = "/api/lava-rapidos"

export const useLavaRapidoService = ()=>{

    const salvar = async (lavaRapido: LavaRapido) : Promise<LavaRapido> => {
        const response: AxiosResponse<LavaRapido> = await httpClient.post<LavaRapido>("/auth/cadastro/lava-rapidos", lavaRapido)
        return response.data
    }

    const atualizar = async (lavaRapido: LavaRapido) : Promise<void> => {
        const url:string = `${resourceURL}/${lavaRapido.id}`
        await httpClient.put<LavaRapido>(url, lavaRapido)
    }

    const carregarLavaRapido = async (id:string) : Promise<LavaRapido> => {
        const url: string = `${resourceURL}/${id}`
        const response: AxiosResponse<LavaRapido> = await httpClient.get(url)
        return response.data
    }

    const deletar = async (id:string) : Promise<void> => {
        const url: string = `${resourceURL}/${id}`
        await httpClient.delete(url)
    }

    return {
        salvar,
        atualizar,
        carregarLavaRapido,
        deletar
    }
}