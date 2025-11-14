import { LavaRapido } from 'app/models/lava-rapidos'
import { useFormik } from 'formik'
import { Input, InputCnpj, InputTelefone } from 'components'
import * as Yup from 'yup'
import Link from 'next/link'

interface LavaRapidoFormProps {
    lavaRapido: LavaRapido
    onSubmit: (lavaRapido: LavaRapido | LavaRapidoCadastro) => void
}

// Interface para cadastro (com senha, sem id e dataCadastro)
interface LavaRapidoCadastro extends Omit<LavaRapido, 'id' | 'dataCadastro'> {
    senha: string
}

// Interface para edição (sem senha, com id e dataCadastro)
interface LavaRapidoEdicao extends Omit<LavaRapido, 'senha'> {
    senha?: never
}

const formScheme: LavaRapidoCadastro = {
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    senha: ''
}

const msgObrigatorio = "Campo obrigatório"

// Schema de validação para CADASTRO
const validationSchemaCadastro = Yup.object().shape({
    razaoSocial: Yup.string().trim().required(msgObrigatorio),
    cnpj: Yup.string().trim().required(msgObrigatorio).length(18, 'O CNPJ está incompleto'),
    endereco: Yup.string().trim().required(msgObrigatorio),
    telefone: Yup.string().trim().required(msgObrigatorio),
    email: Yup.string().trim().required(msgObrigatorio).email("E-mail inválido!"),
    senha: Yup.string().trim().required(msgObrigatorio).min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

// Schema de validação para EDIÇÃO (sem senha)
const validationSchemaEdicao = Yup.object().shape({
    razaoSocial: Yup.string().trim().required(msgObrigatorio),
    cnpj: Yup.string().trim().required(msgObrigatorio).length(18, 'O CNPJ está incompleto'),
    endereco: Yup.string().trim().required(msgObrigatorio),
    telefone: Yup.string().trim().required(msgObrigatorio),
    email: Yup.string().trim().required(msgObrigatorio).email("E-mail inválido!"),
})

export const LavaRapidoForm: React.FC<LavaRapidoFormProps> = ({
    lavaRapido,
    onSubmit
}) => {

    // Função para tratar o envio baseado no contexto (cadastro/edição)
    const handleSubmit = (values: LavaRapidoCadastro & { id?: string; dataCadastro?: string }) => {
        console.log('📤 Dados do formulário:', values)
        
        if (values.id) {
            // 🔄 EDIÇÃO: Remove senha, mantém id e dataCadastro
            const { senha, ...dadosEdicao } = values
            onSubmit(dadosEdicao as LavaRapidoEdicao)
        } else {
            // 🆕 CADASTRO: Remove id e dataCadastro, mantém senha
            const { id, dataCadastro, ...dadosCadastro } = values
            onSubmit(dadosCadastro as LavaRapidoCadastro)
        }
    }

    const formik = useFormik<LavaRapidoCadastro & { id?: string; dataCadastro?: string }>({
        initialValues: { 
            ...formScheme, 
            ...lavaRapido,
            // Garante que a senha não seja preenchida em edição
            senha: lavaRapido.id ? '' : formScheme.senha
        },
        onSubmit: handleSubmit,
        enableReinitialize: true,
        validationSchema: lavaRapido.id ? validationSchemaEdicao : validationSchemaCadastro
    })

    console.log('🔍 Erros do Formik:', formik.errors)
    console.log('📝 Valores do Formik:', formik.values)

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
                    id='razaoSocial' 
                    name='razaoSocial' 
                    label='Razão Social:' 
                    onChange={formik.handleChange} 
                    value={formik.values.razaoSocial}
                    autoComplete='off'
                    error={formik.errors.razaoSocial}
                />
            </div> 
            
            <div className="field is-horizontal"> 
                <InputCnpj
                    className='input is-half'
                    id='cnpj' 
                    name='cnpj' 
                    label='CNPJ:' 
                    onChange={formik.handleChange} 
                    value={formik.values.cnpj}
                    autoComplete='off'
                    error={formik.errors.cnpj}
                />
                <InputTelefone 
                    className='input is-half'
                    id='telefone' 
                    name='telefone' 
                    label='Telefone:' 
                    onChange={formik.handleChange} 
                    value={formik.values.telefone}
                    autoComplete='off'
                    error={formik.errors.telefone}
                />
            </div>  
            
            <div className="field">
                <Input 
                    className='input is-full'
                    id='endereco' 
                    name='endereco' 
                    label='Endereço:' 
                    onChange={formik.handleChange} 
                    value={formik.values.endereco}
                    autoComplete='off'
                    error={formik.errors.endereco}
                />
            </div>
            
            <div className="field is-horizontal">
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
                
                {/* 🔥 CAMPO SENHA CONDICIONAL */}
                {!formik.values.id && (
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
                    />
                )}
            </div>
            
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
                    <Link href="/consultas/lava-rapidos">
                        <button type="button" className="button">
                            Voltar
                        </button>
                    </Link>
                </div>
            </div>
        </form>
    )
}