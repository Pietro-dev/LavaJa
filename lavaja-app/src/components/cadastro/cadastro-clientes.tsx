"use client"

import { Input } from "components/common"
import { useFormik } from "formik"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import * as Yup from 'yup'
import authService from "../../app/services/Autenticacao.Service"

interface CadastroFormValues {
  nome: string
  email: string
  senha: string
  aceitaTermos: boolean
}

const initialValues: CadastroFormValues = {
  nome: '',
  email: '',
  senha: '',
  aceitaTermos: false
}

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .trim()
    .required("Nome obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: Yup.string()
    .trim()
    .required("E-mail obrigatório")
    .email("E-mail inválido!"),
  senha: Yup.string()
    .trim()
    .required("Senha obrigatória")
    .min(6, "Senha deve ter ao menos 6 caracteres"),
  aceitaTermos: Yup.boolean()
    .oneOf([true], "Você deve aceitar os Termos de Uso para continuar")
})

export const CadastroForm: React.FC = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const formik = useFormik<CadastroFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setError('')
      setSuccess('')
      setLoading(true)

      try {
        console.log('📝 Tentando cadastro...', values)

        const { aceitaTermos, ...userData } = values

        const payloadComRole = {
          ...userData,
          role: 'CLIENTE'
        }

        console.log('📤 Dados a serem enviados:', payloadComRole)
        console.log('🔗 Endpoint: /auth/cadastro')

        await authService.register(payloadComRole)

        console.log('✅ Cadastro bem-sucedido!')

        setSuccess('Cadastro realizado com sucesso! Redirecionando para login...')

        // Redireciona para login
        setTimeout(() => {
          router.push('/login')
        }, 700)

      } catch (err: any) {
        console.error('Erro completo no cadastro:', err)
        
        // Debug
        console.error('🔍 Detalhes do erro:')
        console.error('   - Message:', err.message)
        
        let message = 'Erro ao realizar cadastro'
        
        if (err?.message) {
          message = err.message
        }
        
        setError(message)
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <div className="register-page hero is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
              <div className="box register-box">
                <h2 className="title is-3 has-text-centered mb-5">Criar Conta</h2>

                {error && (
                  <div className="notification is-danger is-light has-text-centered">
                    <strong>Erro:</strong> {error}
                    <br />
                    <small className="has-text-grey">
                      Verifique o console para mais detalhes (F12)
                    </small>
                  </div>
                )}

                {success && (
                  <div className="notification is-success is-light has-text-centered">
                    {success}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                  {/* Campo Nome */}
                  <div className="field">
                    <Input
                      label="Nome:"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.nome}
                      id="nome"
                      name="nome"
                      type="text"
                      placeholder="Seu nome completo"
                      error={formik.touched.nome ? formik.errors.nome : undefined}
                      disabled={loading}
                    />
                  </div>

                  {/* Campo E-mail */}
                  <div className="field">
                    <Input
                      label="E-mail:"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      error={formik.touched.email ? formik.errors.email : undefined}
                      disabled={loading}
                    />
                  </div>

                  {/* Campo Senha */}
                  <div className="field">
                    <Input
                      label="Senha:"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.senha}
                      id="senha"
                      name="senha"
                      type="password"
                      placeholder="Crie uma senha segura"
                      error={formik.touched.senha ? formik.errors.senha : undefined}
                      disabled={loading}
                    />
                  </div>
                  {/* Checkbox - Termos de Uso */}
                  <div className="field mt-4">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="aceitaTermos"
                        id="aceitaTermos"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.aceitaTermos}
                        disabled={loading}
                      />{" "}
                      Li e aceito os{" "}
                      <a
                        href="/termos-de-uso"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Termos de Uso
                      </a>{" "}
                      da plataforma.
                    </label>

                    {formik.touched.aceitaTermos && formik.errors.aceitaTermos && (
                      <p className="help is-danger">{formik.errors.aceitaTermos}</p>
                    )}
                  </div>

                  {/* Botão de cadastro */}
                  <div className="field">
                    <div className="control">
                      <button
                        type="submit"
                        className={`button is-primary is-fullwidth ${loading ? "is-loading" : ""}`}
                        disabled={loading}
                      >
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Links auxiliares */}
                <div className="has-text-centered mt-4">
                  <p className="is-size-7">
                    Já possui uma conta?{" "}
                    <Link href="/login">Fazer login</Link>
                  </p>
                  <p className="is-size-7 mt-2">
                      É um Lava-Rápido?{" "}
                      <Link href="/cadastre-se/lava-rapidos">Cadastrar como Lava-Rápido</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CadastroForm