import { Agendamento } from 'app/models/agendamentos'
import { useState } from 'react'

interface TabelaAgendamentoProps {
    agendamentos: Array<Agendamento>
    onEdit: (agendamento: Agendamento) => void
    onDelete: (agendamento: Agendamento) => void
}

interface AgendamentoRowProps {
    agendamento: Agendamento
    onEdit: (agendamento: Agendamento) => void
    onDelete: (agendamento: Agendamento) => void
}

export const TabelaAgendamento: React.FC<TabelaAgendamentoProps> = ({
    agendamentos,
    onEdit,
    onDelete
}) => {
    return(
        <div className="table-container">
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Serviço</th>
                        <th>Lava Rápido</th>
                        <th>Horário</th>
                        <th>Duração (min)</th>
                        <th>Valor (R$)</th>
                        <th>Status</th>
                        <th>Data criação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {agendamentos.map(agendamento => <AgendamentoRow onDelete={onDelete} onEdit={onEdit} key={agendamento.id} agendamento={agendamento}/>)}
                </tbody>
            </table>
        </div>
    )
}

const AgendamentoRow: React.FC<AgendamentoRowProps> = ({
    agendamento,
    onEdit,
    onDelete
}) => {

    const [deletando, setDeletando] = useState<boolean>(false)

    const onDeleteClick = (agendamento:Agendamento)=>{
        if(deletando){
            onDelete(agendamento)
            setDeletando(false)
        }else{
            setDeletando(true)
        }
    }

    const onEditClick = () => {
        onEdit(agendamento)
    }

    const cancelarDelete = () => {
        setDeletando(false)
    }
    return (
        <tr>
            <td>{agendamento.id}</td>
            <td>{agendamento.servicoNome}</td>
            <td>{agendamento.lavaRapidoNome}</td>
            <td>{agendamento.inicio}</td>
            <td>{agendamento.duracaoMinutos}</td>
            <td>{agendamento.valor}</td>
            <td>{agendamento.status}</td>
            <td>{agendamento.dataCriacao}</td>
            <td>
                <div className='buttons' style={{flexWrap: 'nowrap'}}>
                    {!deletando &&
                    <button onClick={onEditClick} className='button is-warning is-dark is-rounded is-small'>Editar</button>
                    }
                    <button onClick={e => onDeleteClick(agendamento)} className={`button is-${deletando ? "success" : "danger"} is-dark is-rounded is-small`}>{ deletando ? "Confirma?" : "Deletar"}</button>
                    {deletando &&
                    <button onClick={cancelarDelete} className='button is-danger is-dark is-rounded is-small'>Cancelar</button>
                    }
                </div>
            </td>
        </tr>
    )
}