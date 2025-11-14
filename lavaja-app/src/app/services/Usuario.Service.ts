import { httpClient } from 'app/http'
import { Usuario } from 'app/models/usuarios'
import { AxiosResponse } from 'axios'

const resourceURL: string = "/api/usuarios"

interface UsuarioUpdateRequest {
    nome: string;
    email: string;
}

export const useUsuarioService = () => {
    const salvar = async (usuario: Usuario) : Promise<Usuario> => {
        const response: AxiosResponse<Usuario> = await httpClient.post<Usuario>("auth/cadastro", usuario)
        return response.data
    }

    const atualizar = async (usuario: Usuario) : Promise<void> => {
        const url:string = `${resourceURL}/${usuario.id}`
        await httpClient.put<Usuario>(url, usuario)
    }

    const atualizarAdm = async (usuario: UsuarioUpdateRequest & {id:string}) : Promise<void> => {
        const url:string = `${resourceURL}/admin/${usuario.id}`
        const dadosUpdate = {
            nome: usuario.nome,
            email: usuario.email
        }
        await httpClient.put<Usuario>(url, dadosUpdate)
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
        atualizarAdm,
        deletar
    }
}