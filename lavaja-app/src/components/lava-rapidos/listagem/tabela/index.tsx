import { LavaRapido } from 'app/models/lava-rapidos'
import { useState } from 'react'

interface TabelaLavaRapidosProps {
    lavaRapidos: Array<LavaRapido>
    onEdit: (lavaRapido: LavaRapido) => void
    onDelete: (lavaRapido: LavaRapido) => void
}

interface LavaRapidoRowProps {
    lavaRapido: LavaRapido
    onEdit: (lavaRapido: LavaRapido) => void
    onDelete: (lavaRapido: LavaRapido) => void
}

export const TabelaLavaRapido: React.FC<TabelaLavaRapidosProps> = ({
    lavaRapidos,
    onEdit,
    onDelete
}) => {
    return(
        <div className="table-container">
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Razão Social</th>
                        <th>CNPJ</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>E-mail</th>
                        <th>Data cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {lavaRapidos.map(lavaRapido => <LavaRapidoRow onDelete={onDelete} onEdit={onEdit} key={lavaRapido.id} lavaRapido={lavaRapido}/>)}
                </tbody>
            </table>
        </div>
    )
}

const LavaRapidoRow: React.FC<LavaRapidoRowProps> = ({
    lavaRapido,
    onEdit,
    onDelete
}) => {

    const [deletando, setDeletando] = useState<boolean>(false)

    const onDeleteClick = (lavaRapido:LavaRapido)=>{
        if(deletando){
            onDelete(lavaRapido)
            setDeletando(false)
        }else{
            setDeletando(true)
        }
    }

    const onEditClick = () => {
        onEdit(lavaRapido)
    }

    const cancelarDelete = () => {
        setDeletando(false)
    }

    return (
        <tr>
            <td>{lavaRapido.id}</td>
            <td>{lavaRapido.razaoSocial}</td>
            <td>{lavaRapido.cnpj}</td>
            <td>{lavaRapido.endereco}</td>
            <td>{lavaRapido.telefone}</td>
            <td>{lavaRapido.email}</td>
            <td>{lavaRapido.dataCadastro}</td>
            <td>
                <div className='buttons' style={{flexWrap: 'nowrap'}}>
                    {!deletando &&
                    <button onClick={onEditClick} className='button is-warning is-dark is-rounded is-small'>Editar</button>
                    }
                    <button onClick={e => onDeleteClick(lavaRapido)} className={`button is-${deletando ? "success" : "danger"} is-dark is-rounded is-small`}>{ deletando ? "Confirma?" : "Deletar"}</button>
                    {deletando &&
                    <button onClick={cancelarDelete} className='button is-danger is-dark is-rounded is-small'>Cancelar</button>
                    }
                </div>
            </td>
        </tr>
    )
}