"use client"

import { useFormik } from 'formik'
import { Input } from 'components'
import * as Yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import httpClient from 'app/http'

interface LoginLavaRapidoFormValues {
    email: string
    senha: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string().trim().required('E-mail obrigatório').email('E-mail inválido'),
    senha: Yup.string().trim().required('Senha obrigatória')
})

export const LoginLavaRapidoForm: React.FC = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setIsClient(true)
        console.log('🔄 LoginLavaRapidoForm - Componente montado')
    }, [])

    const handleSubmit = async (values: LoginLavaRapidoFormValues) => {
        console.log('handleSubmit CHAMADO - Valores:', values)
        setError('')
        setLoading(true)

        try {
            console.log('Tentando login como lava-rápido...', values)
            
            const response = await httpClient.post('auth/login/lava-rapidos', values)
            
            console.log('Resposta recebida:', response.data)

            if (response.data.token) {
            localStorage.setItem('token', response.data.token)
            
            const lavaRapidoId = 
                response.data.lavaRapidoId ||
                response.data.id

            if (lavaRapidoId) {
                localStorage.setItem('lavaRapidoId', lavaRapidoId.toString())
                localStorage.setItem('userType', 'LAVA_RAPIDO')
                console.log('🏪 Lava Rápido ID salvo:', lavaRapidoId)
            } else {
                console.warn('⚠️ Lava Rápido ID não encontrado na resposta')
            }
        }

            router.push('/dashboard')

        } catch (err: any) {
            console.error('Erro no login:', err)
            
            let message = 'Erro ao realizar login'
            
            if (err?.response?.data) {
                message = typeof err.response.data === 'string' 
                    ? err.response.data 
                    : err.response.data.message || JSON.stringify(err.response.data)
            } else if (err?.message) {
                message = err.message
            }
            
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const formik = useFormik<LoginLavaRapidoFormValues>({
        initialValues: {
            email: '',
            senha: ''
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit
    })

    // Handler personalizado para o form
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Valida manualmente antes de submeter
        formik.validateForm().then(errors => {
            if (Object.keys(errors).length === 0) {
                console.log('Formulário válido, submetendo...')
                handleSubmit(formik.values)
            } else {
                console.log('Erros de validação:', errors)
                formik.setTouched({
                    email: true,
                    senha: true
                })
            }
        })
    }

    if (!isClient) {
        return (
            <div className="login-page hero is-fullheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-4-tablet is-4-desktop is-3-widescreen">
                                <div className="box login-box">
                                    <h2 className="title is-3 has-text-centered mb-5">Lava-Rápido</h2>
                                    <p className="has-text-centered">Carregando...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="login-page hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-tablet is-4-desktop is-3-widescreen">
                            <div className="box login-box">
                                <h2 className="title is-3 has-text-centered mb-3">Lava-Rápido</h2>
                                <p className="subtitle is-6 has-text-centered has-text-grey mb-4">
                                    Acesse sua conta de estabelecimento
                                </p>

                                {error && (
                                    <div className="notification is-danger is-light has-text-centered">
                                        {error}
                                    </div>
                                )}

                                {/*handleFormSubmit personalizado */}
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
                                    <Link href="/lava-rapido/cadastre-se" className="is-size-7">
                                        Cadastrar lava-rápido
                                    </Link>
                                    <br />
                                    <Link href="/login" className="is-size-7">
                                        Sou um cliente
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

export default LoginLavaRapidoForm