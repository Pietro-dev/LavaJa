import { Usuario } from 'app/models/usuarios'
import { useState } from 'react'

interface TabelaUsuariosProps {
    usuarios: Array<Usuario>
    onEdit: (usuario: Usuario) => void
    onDelete: (ario: Usuario) => void
}

interface UsuarioRowProps {
    usuario: Usuario
    onEdit: (usuario: Usuario) => void
    onDelete: (usuario: Usuario) => void
}

export const TabelaUsuario: React.FC<TabelaUsuariosProps> = ({
    usuarios,
    onEdit,
    onDelete
}) => {
    return(
        <div className="table-container">
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Data cadastro</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => <UsuarioRow onDelete={onDelete} onEdit={onEdit} key={usuario.id} usuario={usuario}/>)}
                </tbody>
            </table>
        </div>
    )
}

const UsuarioRow: React.FC<UsuarioRowProps> = ({
    usuario,
    onEdit,
    onDelete
}) => {

    const [deletando, setDeletando] = useState<boolean>(false)

    const onDeleteClick = (usuario:Usuario)=>{
        if(deletando){
            onDelete(usuario)
            setDeletando(false)
        }else{
            setDeletando(true)
        }
    }

    const onEditClick = () => {
        onEdit(usuario)
    }

    const cancelarDelete = () => {
        setDeletando(false)
    }

    return (
        <tr>
            <td>{usuario.id}</td>
            <td>{usuario.nome}</td>
            <td>{usuario.email}</td>
            <td>{usuario.dataCadastro}</td>
            <td>
                <div className='buttons' style={{flexWrap: 'nowrap'}}>
                    {!deletando &&
                    <button onClick={onEditClick} className='button is-warning is-dark is-rounded is-small'>Editar</button>
                    }
                    <button onClick={e => onDeleteClick(usuario)} className={`button is-${deletando ? "success" : "danger"} is-dark is-rounded is-small`}>{ deletando ? "Confirma?" : "Deletar"}</button>
                    {deletando &&
                    <button onClick={cancelarDelete} className='button is-danger is-dark is-rounded is-small'>Cancelar</button>
                    }
                </div>
            </td>
        </tr>
    )
}