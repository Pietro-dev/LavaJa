"use client"

import { Input } from "components/common"
import { Alert } from "components/common/message"
import { Layout } from "components/layout"
import Link from "next/link"
import { Messages } from "primereact/messages"
import { useState } from "react"

interface FormErrors{
    nome?: string
    email?: string
    senha?: string
}

export const CadastroUsuarios: React.FC = () => {

    const [messages, setMessages] = useState<Array<Alert>>([])
    const [id, setId] = useState<string>('')
    const [dataCadastro, setDataCadastro] = useState<string>('')
    const [nome, setNome] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [senha, setSenha] = useState<string>('')
    const [errors, setErrors] = useState<FormErrors>({})


    // useEffect(() => {})

    // const submit = () => {
    //     const novoUsuario: Usuario = {

    //     }
    // }

    return(
        <Layout titulo="Cadastro de Usuários" mensagens={messages}>
            {id && 
                <div className="field is-horizontal">
                    <Input value={id} label="Código:" id="codigo" columnClasses="is-half" disabled></Input>
                    <Input value={dataCadastro} label="Data de Cadastro:" id="dataCadastro" columnClasses="is-half" disabled></Input>
                </div>
            }
            <div className="field">
                <Input
                    onChange={e => setNome(e.target.value)}
                    value={nome}
                    label="Nome: "
                    id="nome"
                    columnClasses="is-half"
                    type="text"
                    placeholder="Insira seu nome completo"
                    error={errors.nome}
                />
                <Input
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    label="E-mail: "
                    id="email"
                    columnClasses="is-half"
                    type="text"
                    placeholder="Insira seu melhor e-mail"
                    error={errors.nome}
                />
                <Input
                    onChange={e => setSenha(e.target.value)}
                    value={senha}
                    label="Senha: "
                    id="senha"
                    columnClasses="is-half"
                    type="text"
                    placeholder="Crie uma senha"
                    error={errors.senha}
                />
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button className="button is-primary is-dark" >
                        {id ? "Atualizar" : "Salvar"}
                    </button>
                </div>
                <div className="control">
                    <Link href="/consultas/servicos">
                        <button className="button">Voltar</button>
                    </Link>
                </div>
            </div>
        </Layout>
    )

}