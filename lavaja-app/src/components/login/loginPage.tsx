// components/login/loginPage.tsx
"use client"

import { useFormik } from 'formik'
import { Input } from 'components'
import * as Yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import httpClient, { authHelper } from 'app/http'

interface LoginFormValues {
    email: string
    senha: string
}

interface LoginResponse {
    token: string
    usuarioId: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().trim().required('E-mail obrigatório').email('E-mail inválido'),
    senha: Yup.string().trim().required('Senha obrigatória')
})

export const LoginForm: React.FC = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        console.log('🔄 LoginForm montado')
        authHelper.debug()
    }, [])

    const formik = useFormik<LoginFormValues>({
        initialValues: {
            email: '',
            senha: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setError('')
            setLoading(true)

            try {
                console.log('🔐 Tentando login...', values)

                const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'
                const url = `${API_BASE}/auth/login`
                
                console.log('🌐 URL do login:', url)

                // 1. Faz login para obter token e usuarioId
                const loginResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values)
                })

                console.log('📡 Status da resposta:', loginResponse.status)
                console.log('📡 Status Text:', loginResponse.statusText)

                if (!loginResponse.ok) {
                    const errorText = await loginResponse.text()
                    console.error('❌ Erro do backend:', errorText)
                    
                    // Trata erro 403 especificamente
                    if (loginResponse.status === 403) {
                        throw new Error('Acesso negado. Verifique suas credenciais.')
                    }
                    
                    throw new Error(errorText || `Erro ${loginResponse.status}: ${loginResponse.statusText}`)
                }

                const loginData: LoginResponse = await loginResponse.json()
                console.log('✅ Resposta do login recebida:', loginData)

                // 2. Salva token e usuarioId no localStorage
                if (loginData.token && loginData.usuarioId) {
                    localStorage.setItem('token', loginData.token)
                    localStorage.setItem('usuarioId', loginData.usuarioId)
                    
                    // 🔥 NÃO define userType fixo - será determinado pelos IDs
                    console.log('🔑 Dados salvos no localStorage:')
                    console.log('   - Token:', loginData.token ? '✅' : '❌')
                    console.log('   - UsuarioId:', loginData.usuarioId)

                    // 3. Aguarda para garantir que o localStorage foi atualizado
                    await new Promise(resolve => setTimeout(resolve, 100))

                    // 4. Verificação final
                    const usuarioId = loginData.usuarioId
                    let userType = 'CLIENTE'
                    let redirectPath = '/clientes/home-clientes'

                    console.log('🔍 Verificando tipo de usuário:')
                    console.log('   - usuarioId:', usuarioId)
                    console.log('   - tipo:', typeof usuarioId)
                    console.log('   - valor exato:', usuarioId)

                    if (usuarioId == '1') {
                        userType = 'ADMIN'
                        redirectPath = '/consultas/lava-rapidos'
                        console.log('👑 Usuário identificado como ADMIN')
                    } else {
                        console.log('👤 Usuário identificado como CLIENTE')
                    }
                    
                    // 🔥 SALVA O userType CORRETO
                    localStorage.setItem('userType', userType)
                    
                    // 🔥 VERIFICAÇÃO ANTES DO REDIRECT
                    const savedUserType = localStorage.getItem('userType')
                    console.log('🏷️ UserType salvo no localStorage:', savedUserType)

                    if(userType === 'ADMIN'){
                        router.push('/consultas/lava-rapidos')
                     } else {
                        router.push('/clientes/home-clientes')
                    }
                    
                } else {
                    throw new Error('Token ou usuarioId não recebidos do servidor')
                }

            } catch (err: any) {
                console.error('❌ Erro completo no login:', err)
                
                let message = 'Erro ao realizar login'
                
                if (err?.message) {
                    message = err.message
                }
                
                // Trata erros específicos
                if (message.includes('401') || message.toLowerCase().includes('credenciais')) {
                    message = 'E-mail ou senha incorretos'
                } else if (message.includes('403') || message.includes('Acesso negado')) {
                    message = 'Acesso negado. Verifique suas credenciais.'
                } else if (message.includes('Network Error') || message.includes('Failed to fetch')) {
                    message = 'Erro de conexão. Verifique se o servidor está rodando.'
                } else if (message.includes('404')) {
                    message = 'Endpoint não encontrado. Verifique a URL do login.'
                }
                
                setError(message)
                
                // Limpa dados em caso de erro
                authHelper.clearAuth()
            } finally {
                setLoading(false)
            }
        }
    })

    // 🔥 CORREÇÃO: Tipo correto para o form event
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('📝 Formulário submetido, prevenindo recarregamento...')
        formik.handleSubmit(e)
    }

    return (
        <div className="login-page hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-tablet is-4-desktop is-3-widescreen">
                            <div className="box login-box">

                                <h2 className="title is-3 has-text-centered mb-5">Login</h2>

                                {error && (
                                    <div className="notification is-danger is-light has-text-centered">
                                        <strong>Erro:</strong> {error}
                                        <br />
                                        <small className="has-text-grey">
                                            Status: 403 - Acesso Negado
                                        </small>
                                    </div>
                                )}

                                {/* 🔥 CORREÇÃO: Usa handleFormSubmit com tipo correto */}
                                <form onSubmit={handleFormSubmit}>
                                    <div className="field">
                                        <Input 
                                            id="email"
                                            name="email"
                                            label="E-mail:"
                                            type="email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                            autoComplete="email"
                                            disabled={loading}
                                            error={formik.touched.email ? formik.errors.email : undefined}
                                        />
                                    </div>

                                    <div className="field">
                                        <Input 
                                            id="senha"
                                            name="senha"
                                            label="Senha:"
                                            type="password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.senha}
                                            autoComplete="current-password"
                                            disabled={loading}
                                            error={formik.touched.senha ? formik.errors.senha : undefined}
                                        />
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <button 
                                                type="submit" 
                                                className={`button is-primary is-fullwidth ${loading ? 'is-loading' : ''}`}
                                                disabled={loading}
                                            >
                                                {loading ? 'Entrando...' : 'Entrar'}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <div className="has-text-centered mt-4">
                                    <Link href="clientes/cadastre-se" className="is-size-7">
                                        Criar conta
                                    </Link>
                                    <br />
                                    <Link href="/login/lava-rapidos" className="is-size-7">
                                        Sou um lava-rápido
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm