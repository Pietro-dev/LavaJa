import Link from 'next/link'

export const Menu:React.FC = ()=>{
    return(
        <aside className="menu column is-fullheight" style={{ marginTop: '10px', marginLeft: '10px' }}>
            <p className="menu-label is-hidden-touch">LavaJá - ADM</p>
            <ul className="menu-list">
                <MenuItem href='/consultas/servicos' label='Serviços'/>
                <MenuItem href='/consultas/lava-rapidos' label='Lava Rápidos'/>
                <MenuItem href='/consultas/usuarios' label='Usuários'/>
                <MenuItem href='/consultas/agendamentos' label='Agendamentos'/>
            </ul>
            <p className="menu-label">Lava-Rápidos</p>
            <ul className="menu-list">
                <MenuItem href='/dashboard' label='Dashboard'/>
                <MenuItem href='/consultas/servicos' label='Meus Serviços'/>
                <MenuItem href='/' label='Perfil'/>
            </ul>
            <p className="menu-label">Usuários</p>
            <ul className="menu-list">
                <MenuItem href='/' label='Home'/>
                <MenuItem href='/' label='Meus agendamentos'/>
                <MenuItem href='/' label='Perfil'/>
            </ul>
        </aside>
    )
}

interface MenuItemProps {
    href: string,
    label: string
}

const MenuItem:React.FC<MenuItemProps> = (props: MenuItemProps)=>{
    return(
        <li>
            <Link href={props.href}>
                <span className="icon"></span>{props.label}
            </Link>
        </li>
    )
}