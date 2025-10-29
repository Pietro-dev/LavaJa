import { LavaRapido } from 'app/models/lava-rapidos'
import { useFormik } from 'formik'
import { Input, InputCnpj, InputTelefone } from 'components'


interface LavaRapidoFormProps {
    lavaRapido: LavaRapido
    onSubmit: (LavaRapido: LavaRapido) => void
}

const formScheme: LavaRapido = {
    id: '',
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    senha: '',
    dataCadastro: ''
}

export const LavaRapidoForm: React.FC<LavaRapidoFormProps> = ({
    lavaRapido,
    onSubmit
}) => {

    const formik = useFormik<LavaRapido>({
        initialValues: {...formScheme, ...lavaRapido},
        onSubmit,
        enableReinitialize: true
    })

    return(
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
                    disabled>
                </Input>
                <Input 
                    className='input is-half'
                    id='dataCadastro' 
                    name='dataCadastro' 
                    label='Data de cadastro:' 
                    onChange={formik.handleChange} 
                    value={formik.values.dataCadastro}
                    autoComplete='off'
                    disabled>
                </Input>
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
                    autoComplete='off'>
                </Input>
            </div> 
            <div className="field is-horizontal"> 
                <InputCnpj
                    className='input is-half'
                    id='cnpj' 
                    name='cnpj' 
                    label='CNPJ:' 
                    onChange={formik.handleChange} 
                    value={formik.values.cnpj}
                    autoComplete='off'>
                </InputCnpj>
                <InputTelefone 
                    className='input is-half'
                    id='telefone' 
                    name='telefone' 
                    label='Telefone:' 
                    onChange={formik.handleChange} 
                    value={formik.values.telefone}
                    autoComplete='off'>
                </InputTelefone>
            </div>  
            <div className="field">
                <Input 
                    className='input is-full'
                    id='endereco' 
                    name='endereco' 
                    label='Endereço:' 
                    onChange={formik.handleChange} 
                    value={formik.values.endereco}
                    autoComplete='off'>
                </Input>
            </div>
            <div className="field is-horizontal">
                <Input 
                    className='input is-full'
                    id='email' 
                    name='email' 
                    label='E-mail:' 
                    onChange={formik.handleChange} 
                    value={formik.values.email}
                    autoComplete='off'>
                </Input>
                <Input 
                    className='input is-full'
                    id='senha' 
                    name='senha' 
                    label='Senha:' 
                    type='password'
                    onChange={formik.handleChange} 
                    value={formik.values.senha}
                    autoComplete='off'>
                </Input>
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button className="button is-primary is-dark">
                        {formik.values.id ? "Atualizar" : "Salvar"}
                    </button>
                </div>
                {/* <div className="control">
                    <Link href="/consultas/servicos">
                        <button className="button">Voltar</button>
                    </Link>
                </div> */}
            </div>
        </form>
    )
}