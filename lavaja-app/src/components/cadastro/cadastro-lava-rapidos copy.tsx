// "use client"

// import { LavaRapido } from 'app/models/lava-rapidos'
// import { useFormik } from 'formik'
// import { Input, InputCnpj, InputTelefone } from 'components'
// import * as Yup from 'yup'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'
// import httpClient from 'app/http'

// const formScheme: LavaRapido = {
//     razaoSocial: '',
//     cnpj: '',
//     endereco: '',
//     telefone: '',
//     email: '',
//     senha: '',
//     aceitaTermos: false
// }

// const msgObrigatorio = "Campo obrigatório"

// const validationSchema = Yup.object().shape({
//     razaoSocial: Yup.string().trim().required(msgObrigatorio),
//     cnpj: Yup.string().trim().required(msgObrigatorio).length(18, 'O CNPJ está incompleto'),
//     endereco: Yup.string().trim().required(msgObrigatorio),
//     telefone: Yup.string().trim().required(msgObrigatorio),
//     email: Yup.string().trim().required(msgObrigatorio).email("E-mail inválido!"),
//     senha: Yup.string().trim().required(msgObrigatorio).min(6, 'A senha deve ter pelo menos 6 caracteres'),
//     aceitaTermos: Yup.boolean()
//         .oneOf([true], 'Você deve aceitar os Termos de Uso')
// })

// export const CadastroLavaRapidoForm: React.FC = () => {
//     const [error, setError] = useState('')
//     const [loading, setLoading] = useState(false)
//     const [success, setSuccess] = useState('')
//     const router = useRouter()

//     const formik = useFormik<LavaRapido>({
//         initialValues: formScheme,
//         validationSchema: validationSchema,
//         onSubmit: async (values) => {
//             setError('')
//             setSuccess('')
//             setLoading(true)

//             console.log('🔍 Valores do formulário:', values)

//             try {
//                 // Verifica se há erros de validação
//                 const errors = await formik.validateForm(values)
//                 if (Object.keys(errors).length > 0) {
//                     console.log('❌ Erros de validação:', errors)
//                     setError('Por favor, corrija os erros do formulário')
//                     setLoading(false)
//                     return
//                 }

//                 console.log('📝 Tentando cadastrar lava-rápido...')

//                 // Remove campos que não pertencem ao payload da API
//                 const { aceitaTermos, ...lavaRapidoData } = values

//                 console.log('📤 Dados enviados:', lavaRapidoData)

//                 // Faz a requisição para a API
//                 const response = await httpClient.post('auth/cadastro/lava-rapidos', lavaRapidoData)

//                 console.log('✅ Lava-rápido cadastrado com sucesso!', response.data)

//                 setSuccess('Lava-rápido cadastrado com sucesso! Redirecionando para login...')

//                 // Redireciona para login após sucesso
//                 setTimeout(() => {
//                     router.push('/login/lava-rapidos')
//                 }, 500)

//             } catch (err: any) {
//                 console.error('❌ Erro no cadastro do lava-rápido:', err)
                
//                 // Log mais detalhado do erro
//                 console.error('❌ Detalhes do erro:', {
//                     status: err.response?.status,
//                     data: err.response?.data,
//                     message: err.message
//                 })
                
//                 let message = 'Erro ao realizar cadastro do lava-rápido'
                
//                 if (err?.response?.data) {
//                     message = typeof err.response.data === 'string' 
//                         ? err.response.data 
//                         : err.response.data.message || JSON.stringify(err.response.data)
//                 } else if (err?.message) {
//                     message = err.message
//                 }
                
//                 setError(message)
//             } finally {
//                 setLoading(false)
//             }
//         }
//     })

//     const handleFormSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         console.log('🎯 Formulário submetido!')
//         console.log('📋 Valores atuais:', formik.values)
//         console.log('❌ Erros atuais:', formik.errors)
//         formik.handleSubmit()
//     }

//     return (
//         <div className="register-page hero is-fullheight">
//             <div className="hero-body">
//                 <div className="container">
//                     <div className="columns is-centered">
//                         <div className="column is-6-tablet is-5-desktop is-4-widescreen">
//                             <div className="box register-box">
//                                 <h2 className="title is-3 has-text-centered mb-5">Cadastrar Lava-Rápido</h2>

//                                 {error && (
//                                     <div className="notification is-danger is-light has-text-centered">
//                                         {error}
//                                     </div>
//                                 )}

//                                 {success && (
//                                     <div className="notification is-success is-light has-text-centered">
//                                         {success}
//                                     </div>
//                                 )}

//                                 <form onSubmit={handleFormSubmit}>
//                                     <div className="field">
//                                         <Input 
//                                             className='input is-full'
//                                             id='razaoSocial' 
//                                             name='razaoSocial' 
//                                             label='Razão Social:' 
//                                             onChange={formik.handleChange} 
//                                             onBlur={formik.handleBlur}
//                                             value={formik.values.razaoSocial}
//                                             autoComplete='off'
//                                             disabled={loading}
//                                             error={formik.touched.razaoSocial ? formik.errors.razaoSocial : undefined}
//                                         />
//                                     </div> 

//                                     <div className="field is-horizontal"> 
//                                         <InputCnpj
//                                             className='input is-half'
//                                             id='cnpj' 
//                                             name='cnpj' 
//                                             label='CNPJ:' 
//                                             onChange={formik.handleChange} 
//                                             onBlur={formik.handleBlur}
//                                             value={formik.values.cnpj}
//                                             autoComplete='off'
//                                             disabled={loading}
//                                             error={formik.touched.cnpj ? formik.errors.cnpj : undefined}
//                                         />
//                                         <InputTelefone 
//                                             className='input is-half'
//                                             id='telefone' 
//                                             name='telefone' 
//                                             label='Telefone:' 
//                                             onChange={formik.handleChange} 
//                                             onBlur={formik.handleBlur}
//                                             value={formik.values.telefone}
//                                             autoComplete='off'
//                                             disabled={loading}
//                                             error={formik.touched.telefone ? formik.errors.telefone : undefined}
//                                         />
//                                     </div>  

//                                     <div className="field">
//                                         <Input 
//                                             className='input is-full'
//                                             id='endereco' 
//                                             name='endereco' 
//                                             label='Endereço:' 
//                                             onChange={formik.handleChange} 
//                                             onBlur={formik.handleBlur}
//                                             value={formik.values.endereco}
//                                             autoComplete='off'
//                                             disabled={loading}
//                                             error={formik.touched.endereco ? formik.errors.endereco : undefined}
//                                         />
//                                     </div>

//                                     <div className="field">
//                                         <Input 
//                                             className='input is-full'
//                                             id='email' 
//                                             name='email' 
//                                             label='E-mail:' 
//                                             onChange={formik.handleChange} 
//                                             onBlur={formik.handleBlur}
//                                             value={formik.values.email}
//                                             autoComplete='off'
//                                             disabled={loading}
//                                             error={formik.touched.email ? formik.errors.email : undefined}
//                                         />
//                                     </div>

//                                     <div className="field">
//                                         <Input 
//                                             className='input is-full'
//                                             id='senha' 
//                                             name='senha' 
//                                             label='Senha:' 
//                                             type='password'
//                                             onChange={formik.handleChange} 
//                                             onBlur={formik.handleBlur}
//                                             value={formik.values.senha}
//                                             autoComplete='off'
//                                             disabled={loading}
//                                             error={formik.touched.senha ? formik.errors.senha : undefined}
//                                         />
//                                     </div>

//                                     {/* Checkbox - Termos de Uso */}
//                                     <div className="field mt-4">
//                                         <label className="checkbox">
//                                             <input
//                                                 type="checkbox"
//                                                 name="aceitaTermos"
//                                                 id="aceitaTermos"
//                                                 onChange={formik.handleChange}
//                                                 onBlur={formik.handleBlur}
//                                                 checked={formik.values.aceitaTermos}
//                                                 disabled={loading}
//                                             />{" "}
//                                             Li e aceito os{" "}
//                                             <a
//                                                 href="/termos-de-uso-lava-rapidos"
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                             >
//                                                 Termos de Uso para Lava-Rápidos
//                                             </a>
//                                         </label>

//                                         {formik.touched.aceitaTermos && formik.errors.aceitaTermos && (
//                                             <p className="help is-danger">{formik.errors.aceitaTermos}</p>
//                                         )}
//                                     </div>

//                                     <div className="field">
//                                         <div className="control">
//                                             <button 
//                                                 type="submit" 
//                                                 className={`button is-primary is-fullwidth ${loading ? 'is-loading' : ''}`}
//                                                 disabled={loading}
//                                             >
//                                                 {loading ? 'Cadastrando...' : 'Cadastrar Lava-Rápido'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </form>

//                                 {/* Links auxiliares */}
//                                 <div className="has-text-centered mt-4">
//                                     <p className="is-size-7">
//                                         Já possui uma conta?{" "}
//                                         <Link href="/login/lava-rapidos">Fazer login</Link>
//                                     </p>
//                                     <p className="is-size-7 mt-2">
//                                         É um cliente?{" "}
//                                         <Link href="/clientes/cadastre-se">Cadastrar como cliente</Link>
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CadastroLavaRapidoForm