import { Servico } from 'app/models/servicos'
import { useState } from 'react'

interface TabelaServicosProps {
    servicos: Array<Servico>
    onEdit: (servico: Servico) => void
    onDelete: (servico: Servico) => void
}

interface ServicoRowProps {
    servico: Servico
    onEdit: (servico: Servico) => void
    onDelete: (servico: Servico) => void
}

export const TabelaServicos: React.FC<TabelaServicosProps> = ({
    servicos,
    onEdit,
    onDelete
}) => {
    return(
        <table className="table is-striped is-hoverable is-fullwidth">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Servico</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th>Duração</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {servicos.map(servico => <ServicoRow onDelete={onDelete} onEdit={onEdit} key={servico.id} servico={servico}/>)}
            </tbody>
        </table>
    )
}

const ServicoRow: React.FC<ServicoRowProps> = ({
    servico,
    onEdit,
    onDelete
}) => {

    const [deletando, setDeletando] = useState<boolean>(false)

    const onDeleteClick = (servico:Servico)=>{
        if(deletando){
            onDelete(servico)
            setDeletando(false)
        }else{
            setDeletando(true)
        }
    }

    const cancelarDelete = () => {
        setDeletando(false)
    }

    return (
        <tr>
            <td>{servico.id}</td>
            <td>{servico.servico}</td>
            <td>{servico.descricao}</td>
            <td>{servico.valor}</td>
            <td>{servico.duracao}</td>
            <td>
                <div className='buttons' style={{flexWrap: 'nowrap'}}>
                    {!deletando &&
                    <button onClick={e => onEdit(servico)} className='button is-warning is-dark is-rounded is-small'>Editar</button>
                    }
                    <button onClick={e => onDeleteClick(servico)} className={`button is-${deletando ? "success" : "danger"} is-dark is-rounded is-small`}>{ deletando ? "Confirma?" : "Deletar"}</button>
                    {deletando &&
                    <button onClick={cancelarDelete} className='button is-danger is-dark is-rounded is-small'>Cancelar</button>

                    }
                </div>
            </td>
        </tr>
    )
}