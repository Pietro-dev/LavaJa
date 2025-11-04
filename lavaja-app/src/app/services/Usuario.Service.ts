import { httpClient } from 'app/http'
import { Usuario } from 'app/models/usuarios'
import { AxiosResponse } from 'axios'

const resourceURL: string = "/api/usuarios"

export const useUsuarioService = () => {
    const salvar = async (usuario: Usuario) : Promise<Usuario> => {
        const response: AxiosResponse<Usuario> = await httpClient.post<Usuario>(resourceURL, usuario)
        return response.data
    }

    const atualizar = async (usuario: Usuario) : Promise<void> => {
            const url:string = `${resourceURL}/${usuario.id}`
            await httpClient.put<Usuario>(url, usuario)
        }
    
        const carregarUsuario = async (id:string) : Promise<Usuario> => {
            const url: string = `${resourceURL}/${id}`
            const response: AxiosResponse<Usuario> = await httpClient.get(url)
            return response.data
        }
    
        const deletar = async (id:string) : Promise<void> => {
            const url: string = `${resourceURL}/${id}`
            await httpClient.delete(url)
        }
    
        return {
            salvar,
            atualizar,
            carregarUsuario,
            deletar
        }
}