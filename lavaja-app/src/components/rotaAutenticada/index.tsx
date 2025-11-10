"use client"

import { signIn, useSession } from "next-auth/react"

export const RotaAutenticada = ({ children }: { 
    children: React.ReactNode

}) => {

    const { data: session, status } = useSession()

    if (status === "loading") return <div>Carregando...</div>

    if (!session) return (
        <div>
            <p>Não está logado</p>
            <button className="button is-info is-dark " onClick={() => signIn()}>Entrar</button>
        </div>
    )

    return <>{children}</>
}