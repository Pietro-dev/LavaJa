import { Input } from "components/common"
import Link from "next/link"
import { Usuario } from "app/models/usuarios"
import * as Yup from 'yup'
import { useFormik } from "formik"

interface UsuarioFormProps{
    usuario: Usuario
    onSubmit: (Usuario: Usuario) => void
}

const formScheme: Usuario = {
    id: '',
    nome: '',
    email: '',
    senha: '',
    dataCadastro: '',
}

const msgObrigatorio = "Campo obrigatório"

const validationSchema = Yup.object().shape({
    nome: Yup.string().trim().required(msgObrigatorio),
    email: Yup.string().trim().required(msgObrigatorio).email("E-mail inválido!"),
    senha: Yup.string().trim().required(msgObrigatorio),
})

export const FormCadastroUsuarios: React.FC<UsuarioFormProps> = ({
    usuario,
    onSubmit
}) => {
    
    const formik = useFormik<Usuario>({
        initialValues: { ...formScheme, ...usuario },
        onSubmit,
        enableReinitialize: true,
        validationSchema: validationSchema
    })

    console.log(formik.errors)

    return(
        <form onSubmit={formik.handleSubmit}>
            {formik.values.id && 
                <div className="field is-horizontal">
                    <Input onChange={formik.handleChange} value={formik.values.id} label="Código:" id="codigo" name="codigo" columnClasses="is-half" disabled></Input>
                    <Input onChange={formik.handleChange} value={formik.values.dataCadastro} label="Data de Cadastro:" id="dataCadastro" name="dataCadastro" columnClasses="is-half" disabled></Input>
                </div>
            }
            <div className="field">
                <Input
                    onChange={formik.handleChange} 
                    value={formik.values.nome}
                    label="Nome: "
                    id="nome"
                    name="nome"
                    columnClasses="is-half"
                    type="text"
                    placeholder="Insira seu nome completo"
                    error={formik.errors.nome}
                />
                <Input
                    onChange={formik.handleChange} 
                    value={formik.values.email}
                    label="E-mail: "
                    id="email"
                    name="email"
                    columnClasses="is-half"
                    type="text"
                    placeholder="Insira seu melhor e-mail"
                    error={formik.errors.email}
                />
                <Input
                    onChange={formik.handleChange} 
                    value={formik.values.senha}
                    label="Senha: "
                    id="senha"
                    name="senha"
                    columnClasses="is-half"
                    type="password"
                    placeholder="Crie uma senha"
                    error={formik.errors.senha}
                />
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button className="button is-primary is-dark">
                        {formik.values.id ? "Atualizar" : "Salvar"}
                    </button>
                </div>
                <div className="control">
                    <Link href="/consultas/servicos">
                        <button className="button">Voltar</button>
                    </Link>
                </div>
            </div>
        </form>
    )

}