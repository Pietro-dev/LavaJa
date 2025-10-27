export interface Servico {
    id?: string,
    servico?: string,
    descricao?: string,
    valor?: number | null,
    duracao?: number | null,
    dataCadastro?: string
}

const servico: Servico = {  }