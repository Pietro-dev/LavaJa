export interface Servico {
    id?: string,
    servico?: string,
    descricao?: string,
    valor?: number | null,
    duracao?: number | null,
    dataCadastro?: string,
    lavaRapidoId?: string
}

const servico: Servico = {  }