import { Usuario } from 'app/models/usuarios'
import { useFormik } from 'formik'
import { Input } from 'components'
import * as Yup from 'yup'
import Link from 'next/link'

interface UsuarioFormProps {
    usuario: Usuario
    onSubmit: (usuario: any) => void
}

interface UsuarioFormValues {
    id: string
    nome: string
    email: string
    senha: string // Apenas para cadastro
    dataCadastro: string
    role: string
}

const formScheme: UsuarioFormValues = {
    id: '',
    nome: '',
    email: '',
    senha: '',
    dataCadastro: '',
    role: ''
}

const msgObrigatorio = "Campo obrigatório"

// Schema de validação para CADASTRO
const validationSchemaCadastro = Yup.object().shape({
    nome: Yup.string().trim().required(msgObrigatorio),
    email: Yup.string().trim().required(msgObrigatorio).email("E-mail inválido!"),
    senha: Yup.string().trim().required(msgObrigatorio).min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

// Schema de validação para EDIÇÃO (sem campos de senha)
const validationSchemaEdicao = Yup.object().shape({
    nome: Yup.string().trim().required(msgObrigatorio),
    email: Yup.string().trim().required(msgObrigatorio).email("E-mail inválido!"),
})

export const FormCadastroUsuarios: React.FC<UsuarioFormProps> = ({
    usuario,
    onSubmit
}) => {

    const handleSubmit = (values: UsuarioFormValues) => {
        console.log('📤 Dados do formulário:', values)
        
        if (values.id) {
            // 🔥 EDIÇÃO: Apenas nome e email (sem senha)
            const dadosEdicao = {
                nome: values.nome,
                email: values.email
            }
            onSubmit(dadosEdicao)
        } else {
            // 🔥 CADASTRO: Com senha
            const dadosCadastro = {
                nome: values.nome,
                email: values.email,
                senha: values.senha,
                role: values.role || 'CLIENTE'
            }
            onSubmit(dadosCadastro)
        }
    }

    const formik = useFormik<UsuarioFormValues>({
        initialValues: { ...formScheme, ...usuario },
        onSubmit: handleSubmit,
        enableReinitialize: true,
        validationSchema: usuario.id ? validationSchemaEdicao : validationSchemaCadastro
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            {formik.values.id &&
                <div className="field is-horizontal"> 
                    <Input 
                        className='input is-half'
                        id='id' 
                        name='id' 
                        label='Código:' 
                        onChange={formik.handleChange} 
                        value={formik.values.id}
                        autoComplete='off'
                        disabled
                    />
                    <Input 
                        className='input is-half'
                        id='dataCadastro' 
                        name='dataCadastro' 
                        label='Data de cadastro:' 
                        onChange={formik.handleChange} 
                        value={formik.values.dataCadastro}
                        autoComplete='off'
                        disabled
                    />
                </div>
            }
            
            <div className="field">
                <Input 
                    className='input is-full'
                    id='nome' 
                    name='nome' 
                    label='Nome Completo:' 
                    onChange={formik.handleChange} 
                    value={formik.values.nome}
                    autoComplete='off'
                    error={formik.errors.nome}
                />
            </div>
            
            <div className="field">
                <Input 
                    className='input is-full'
                    id='email' 
                    name='email' 
                    label='E-mail:' 
                    onChange={formik.handleChange} 
                    value={formik.values.email}
                    autoComplete='off'
                    error={formik.errors.email}
                />
            </div>

            {formik.values.id && formik.values.role && (
                <div className="field">
                    <Input 
                        className='input is-full'
                        id='role' 
                        name='role' 
                        label='Perfil:' 
                        onChange={formik.handleChange} 
                        value={formik.values.role}
                        autoComplete='off'
                        disabled
                    />
                </div>
            )}
            
            {/* 🔥 APENAS NO CADASTRO */}
            {!formik.values.id && (
                <div className="field">
                    <Input 
                        className='input is-full'
                        id='senha' 
                        name='senha' 
                        label='Senha:' 
                        type='password'
                        onChange={formik.handleChange} 
                        value={formik.values.senha}
                        autoComplete='off'
                        error={formik.errors.senha}
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
            )}
            
            <div className="field is-grouped">
                <div className="control">
                    <button 
                        type="submit"
                        className="button is-primary is-dark"
                    >
                        {formik.values.id ? "Atualizar" : "Salvar"}
                    </button>
                </div>
                <div className="control">
                    <Link href="/consultas/usuarios">
                        <button type="button" className="button">
                            Voltar
                        </button>
                    </Link>
                </div>
            </div>
        </form>
    )
}