"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from "context/AuthContext"
import { useEffect, useState } from 'react'

export const Menu:React.FC = ()=>{
    const router = useRouter()
    const { logout } = useAuth()
    const [userType, setUserType] = useState<'ADMIN' | 'CLIENTE' | 'LAVA_RAPIDO' | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Detecta o tipo de usuário baseado nos IDs
    useEffect(() => {
        const usuarioId = localStorage.getItem('usuarioId')
        const lavaRapidoId = localStorage.getItem('lavaRapidoId')
    
        if (usuarioId === '1' && !lavaRapidoId) {
            console.log('Usuário detectado: ADMIN')
            setUserType('ADMIN')
        } else if (lavaRapidoId) {
            console.log('Usuário detectado: LAVA_RAPIDO')
            setUserType('LAVA_RAPIDO')
        } else if (usuarioId) {
            console.log('Usuário detectado: CLIENTE')
            setUserType('CLIENTE')
        } else {
            console.log('Nenhum usuário logado')
            setUserType(null)
        }
        
        setIsLoading(false)
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        logout()
        router.push("/login")
    }

    // Mostra loading enquanto detecta o tipo de usuário
    if (isLoading) {
        return (
            <aside className="menu column is-fullheight" style={{ marginTop: '10px', marginLeft: '10px' }}>
                <p className="menu-label">Carregando...</p>
            </aside>
        )
    }

    return(
        <aside className="menu column is-fullheight" style={{ marginTop: '10px', marginLeft: '10px' }}>
            
            {/* MENU PARA ADMINISTRADORES (apenas usuarioId = 1) */}
            {userType === 'ADMIN' && (
                <>
                    <p className="menu-label is-hidden-touch">LavaJá - ADM</p>
                    <ul className="menu-list">
                        {/* <MenuItem href='/consultas/servicos' label='Serviços'/> */}
                        <MenuItem href='/consultas/lava-rapidos' label='Lava Rápidos'/>
                        <MenuItem href='/consultas/usuarios' label='Usuários'/>
                        <MenuItem href='/consultas/agendamentos' label='Agendamentos'/>
                        <MenuItem href='/login' onClick={handleLogout} label='Sair'/>
                    </ul>
                </>
            )}

            {/* MENU PARA LAVA-RÁPIDOS (tem lavaRapidoId) */}
            {userType === 'LAVA_RAPIDO' && (
                <>
                    <p className="menu-label is-hidden-touch">Meu Lava-Rápido</p>
                    <ul className="menu-list">
                        <MenuItem href='/dashboard' label='Dashboard'/>
                        <MenuItem href='/lava-rapido/agendamentos' label='Agendamentos'/>
                        <MenuItem href='/lava-rapido/servicos' label='Meus Serviços'/>
                        <MenuItem href='/lava-rapido/perfil' label='Perfil do Estabelecimento'/>
                        <MenuItem href='/login/lava-rapidos' onClick={handleLogout} label='Sair'/>
                    </ul>
                </>
            )}

            {/* MENU PARA CLIENTES (tem usuarioId e não é 1) */}
            {userType === 'CLIENTE' && (
                <>
                    <p className="menu-label is-hidden-touch">Minha Conta</p>
                    <ul className="menu-list">
                        <MenuItem href='/clientes/home-clientes' label='Home'/>
                        <MenuItem href='/clientes/historico-agendamentos' label='Histórico'/>
                        <MenuItem href='/clientes/perfil' label='Meu Perfil'/>
                        <MenuItem href='/login' onClick={handleLogout} label='Sair'/>
                    </ul>
                </>
            )}

            {!userType && (
                <>
                    <p className="menu-label is-hidden-touch">Visitante</p>
                    <ul className="menu-list">
                        <MenuItem href='/login' label='Fazer Login'/>
                        <MenuItem href='/cadastre-se' label='Cadastrar'/>
                    </ul>
                </>
            )}
        </aside>
    )
}

interface MenuItemProps {
    href: string,
    label: string,
    onClick?: () => void
}

const MenuItem:React.FC<MenuItemProps> = (props: MenuItemProps)=>{
    return(
        <li>
            <Link href={props.href} onClick={props.onClick}>
                <span className="icon"></span>{props.label}
            </Link>
        </li>
    )
}