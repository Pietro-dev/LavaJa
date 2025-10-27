import { LavaRapido } from 'app/models/lava-rapidos'
import { useFormik } from 'formik'

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
        initialValues: {...lavaRapido, ...formScheme},
        onSubmit,
    })

    return(
        <form onSubmit={formik.handleSubmit}>
            <input
                value={formik.values.razaoSocial} 
                onChange={formik.handleChange}
                id='razaoSocial'
                name='razaoSocial'/>
            <button type='submit'>Enviar</button>
        </form>
    )
}