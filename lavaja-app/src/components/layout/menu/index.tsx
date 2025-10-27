import Link from 'next/link'

export const Menu:React.FC = ()=>{
    return(
        <aside className="menu column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
            <p className="menu-label is-hidden-touch">LavaJá</p>
            <ul className="menu-list">
                <MenuItem href='/' label='Home'/>
                <MenuItem href='/' label='Dashboard'/>
                <MenuItem href='/consultas/servicos' label='Serviços'/>
                <MenuItem href='/' label='Agenda'/>
                <MenuItem href='/' label='Promoções'/>
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