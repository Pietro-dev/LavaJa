import { httpClient } from 'app/http'
import { Agendamento } from 'app/models/agendamentos'
import { AxiosResponse } from 'axios'

const resourceURL: string = "api/agendamentos"

export const useAgendamentoService = () => {

    const salvar = async (agendamento: Agendamento) : Promise<Agendamento> => {
            const response: AxiosResponse<Agendamento> = await httpClient.post<Agendamento>(resourceURL, agendamento)
            console.log(response)
            console.log(agendamento)    
            return response.data
        }
    
        const atualizar = async (agendamento: Agendamento) : Promise<void> => {
            const url:string = `${resourceURL}/${agendamento.id}`
            await httpClient.put<Agendamento>(url, agendamento)
        }
    
        const carregarAgendamento = async (id:string) : Promise<Agendamento> => {
            const url: string = `${resourceURL}/${id}`
            const response: AxiosResponse<Agendamento> = await httpClient.get(url)
            return response.data
        }
    
        const deletar = async (id:string) : Promise<void> => {
            const url: string = `${resourceURL}/${id}`
            await httpClient.delete(url)
        }
    
        return {
            salvar,
            atualizar,
            carregarAgendamento,
            deletar
        }
}