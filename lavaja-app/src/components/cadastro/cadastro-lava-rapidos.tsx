"use client"

import { LavaRapido } from 'app/models/lava-rapidos'
import { useFormik } from 'formik'
import { Input, InputCnpj, InputTelefone } from 'components'
import * as Yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import httpClient from 'app/http'

const formScheme: LavaRapido & {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
} = {
    razaoSocial: '',
    cnpj: '',
    endereco: '', // Este continuará sendo o campo concatenado que vai para o banco
    telefone: '',
    email: '',
    senha: '',
    aceitaTermos: false,
    // Novos campos para o endereço
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
}

const msgObrigatorio = "Campo obrigatório"

const validationSchema = Yup.object().shape({
    razaoSocial: Yup.string().trim().required(msgObrigatorio),
    cnpj: Yup.string().trim().required(msgObrigatorio).length(18, 'O CNPJ está incompleto'),
    telefone: Yup.string().trim().required(msgObrigatorio),
    email: Yup.string().trim().required(msgObrigatorio).email("E-mail inválido!"),
    senha: Yup.string().trim().required(msgObrigatorio).min(6, 'A senha deve ter pelo menos 6 caracteres'),
    aceitaTermos: Yup.boolean()
        .oneOf([true], 'Você deve aceitar os Termos de Uso'),
    cep: Yup.string().trim().required(msgObrigatorio).length(9, 'CEP inválido'),
    logradouro: Yup.string().trim().required(msgObrigatorio),
    numero: Yup.string().trim().required(msgObrigatorio),
    bairro: Yup.string().trim().required(msgObrigatorio),
    cidade: Yup.string().trim().required(msgObrigatorio),
    estado: Yup.string().trim().required(msgObrigatorio).length(2, 'UF inválida')
})

export const CadastroLavaRapidoForm: React.FC = () => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [buscandoCep, setBuscandoCep] = useState(false)
    const router = useRouter()

    // Função para buscar CEP
    const buscarCep = async (cep: string) => {
        const cepLimpo = cep.replace(/\D/g, '')
        
        if (cepLimpo.length !== 8) return
        
        setBuscandoCep(true)
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
            const data = await response.json()
            
            if (!data.erro) {
                formik.setValues(prev => ({
                    ...prev,
                    logradouro: data.logradouro || '',
                    bairro: data.bairro || '',
                    cidade: data.localidade || '',
                    estado: data.uf || '',
                    complemento: data.complemento || ''
                }))
            } else {
                formik.setFieldError('cep', 'CEP não encontrado')
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error)
            formik.setFieldError('cep', 'Erro ao buscar CEP')
        } finally {
            setBuscandoCep(false)
        }
    }

    // Função para concatenar endereço completo
    const concatenarEndereco = (values: any): string => {
        const { logradouro, numero, complemento, bairro, cidade, estado } = values
        
        let enderecoCompleto = ''
        
        if (logradouro) {
            enderecoCompleto += logradouro
            if (numero) enderecoCompleto += `, ${numero}`
            if (complemento) enderecoCompleto += ` - ${complemento}`
            if (bairro) enderecoCompleto += `, ${bairro}`
            if (cidade) enderecoCompleto += `, ${cidade}`
            if (estado) enderecoCompleto += ` - ${estado}`
        }
        
        return enderecoCompleto
    }

    // Função para lidar com mudanças no CEP
    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        
        // Formata o CEP (xxxxx-xxx)
        let formattedValue = value.replace(/\D/g, '')
        if (formattedValue.length > 5) {
            formattedValue = formattedValue.substring(0, 5) + '-' + formattedValue.substring(5, 8)
        }
        
        formik.setFieldValue('cep', formattedValue)
        
        // Busca CEP automaticamente quando completo
        if (formattedValue.length === 9) {
            buscarCep(formattedValue)
        }
    }

    const formik = useFormik({
        initialValues: formScheme,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setError('')
            setSuccess('')
            setLoading(true)

            console.log('🔍 Valores do formulário ANTES da concatenação:', values)

            try {
                // Concatena o endereço antes de enviar
                const enderecoCompleto = concatenarEndereco(values)
                
                // Verifica se o endereço foi gerado corretamente
                if (!enderecoCompleto) {
                    setError('Endereço inválido. Verifique os campos de CEP')
                    setLoading(false)
                    return
                }

                console.log('Endereço completo concatenado:', enderecoCompleto)

                // Cria uma cópia dos valores com o endereço concatenado para validação
                const valoresComEnderecoConcatenado = {
                    ...values,
                    endereco: enderecoCompleto
                }

                console.log('🔍 Valores do formulário COM endereço concatenado:', valoresComEnderecoConcatenado)

                // Verifica se há erros de validação com o endereço concatenado
                const errors = await validationSchema.validate(valoresComEnderecoConcatenado, { abortEarly: false })
                    .then(() => ({}))
                    .catch((err) => {
                        const validationErrors: any = {}
                        err.inner.forEach((error: any) => {
                            validationErrors[error.path] = error.message
                        })
                        return validationErrors
                    })

                if (Object.keys(errors).length > 0) {
                    console.log('Erros de validação:', errors)
                    // Seta os erros no formik para mostrar ao usuário
                    formik.setErrors(errors)
                    setError('Por favor, corrija os erros do formulário')
                    setLoading(false)
                    return
                }

                console.log('Tentando cadastrar lava-rápido...')

                // Prepara os dados para envio - mantém apenas os campos que vão para a API
                const { 
                    aceitaTermos, 
                    cep, 
                    logradouro, 
                    numero, 
                    complemento, 
                    bairro, 
                    cidade, 
                    estado,
                    ...lavaRapidoData 
                } = valoresComEnderecoConcatenado

                // Os dados já incluem o endereco concatenado
                const dadosParaEnviar = {
                    ...lavaRapidoData
                    // endereco já está incluso aqui com o valor concatenado
                }

                console.log('Dados enviados para API:', dadosParaEnviar)

                // Faz a requisição para a API
                const response = await httpClient.post('auth/cadastro/lava-rapidos', dadosParaEnviar)

                console.log('✅ Lava-rápido cadastrado com sucesso!', response.data)

                setSuccess('Lava-rápido cadastrado com sucesso! Redirecionando para login...')

                // Redireciona para login após sucesso
                setTimeout(() => {
                    router.push('/login/lava-rapidos')
                }, 500)

            } catch (err: any) {
                console.error('Erro no cadastro do lava-rápido:', err)
                
                // Log mais detalhado do erro
                console.error('Detalhes do erro:', {
                    status: err.response?.status,
                    data: err.response?.data,
                    message: err.message
                })
                
                let message = 'Erro ao realizar cadastro do lava-rápido'
                
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
    })

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Formulário submetido!')
        console.log('Valores atuais:', formik.values)
        console.log('Erros atuais:', formik.errors)
        formik.handleSubmit()
    }

    return (
        <div className="register-page hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-6-tablet is-5-desktop is-6-widescreen">
                            <div className="box register-box">
                                <h2 className="title is-3 has-text-centered mb-5">Cadastrar Lava-Rápido</h2>

                                {error && (
                                    <div className="notification is-danger is-light has-text-centered">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="notification is-success is-light has-text-centered">
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleFormSubmit}>
                                    <div className="field">
                                        <Input 
                                            className='input is-full'
                                            id='razaoSocial' 
                                            name='razaoSocial' 
                                            label='Razão Social:' 
                                            onChange={formik.handleChange} 
                                            onBlur={formik.handleBlur}
                                            value={formik.values.razaoSocial}
                                            autoComplete='off'
                                            disabled={loading}
                                            error={formik.touched.razaoSocial ? formik.errors.razaoSocial : undefined}
                                        />
                                    </div> 

                                    <div className="field is-horizontal"> 
                                        <InputCnpj
                                            className='input is-half'
                                            id='cnpj' 
                                            name='cnpj' 
                                            label='CNPJ:' 
                                            onChange={formik.handleChange} 
                                            onBlur={formik.handleBlur}
                                            value={formik.values.cnpj}
                                            autoComplete='off'
                                            disabled={loading}
                                            error={formik.touched.cnpj ? formik.errors.cnpj : undefined}
                                        />
                                        <InputTelefone 
                                            className='input is-half'
                                            id='telefone' 
                                            name='telefone' 
                                            label='Telefone:' 
                                            onChange={formik.handleChange} 
                                            onBlur={formik.handleBlur}
                                            value={formik.values.telefone}
                                            autoComplete='off'
                                            disabled={loading}
                                            error={formik.touched.telefone ? formik.errors.telefone : undefined}
                                        />
                                    </div>  

                                    {/* Campos de Endereço com VIA CEP */}
                                    <div className="field">
                                        <Input 
                                            className='input is-full'
                                            id='cep' 
                                            name='cep' 
                                            label='CEP:' 
                                            onChange={handleCepChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.cep}
                                            autoComplete='off'
                                            disabled={loading || buscandoCep}
                                            placeholder="00000-000"
                                            maxLength={9}
                                            error={formik.touched.cep ? formik.errors.cep : undefined}
                                        />
                                        {buscandoCep && <p className="help is-info">Buscando CEP...</p>}
                                    </div>

                                    <div className="field">
                                        <Input 
                                            className='input'
                                            id='logradouro' 
                                            name='logradouro' 
                                            label='Logradouro:' 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.logradouro}
                                            autoComplete='off'
                                            disabled={loading}
                                            error={formik.touched.logradouro ? formik.errors.logradouro : undefined}
                                        />
                                    </div>
                                    {/* Linha com Logradouro e Número */}
                                    <div className="field is-horizontal">
                                        <div className="field-body">
                                            <div className="field">
                                                <Input 
                                                    className='input'
                                                    id='numero' 
                                                    name='numero' 
                                                    label='Número:' 
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.numero}
                                                    autoComplete='off'
                                                    disabled={loading}
                                                    error={formik.touched.numero ? formik.errors.numero : undefined}
                                                />
                                            </div>
                                                {/* Complemento */}
                                                <div className="field">
                                                    <Input 
                                                        className='input is-full'
                                                        id='complemento' 
                                                        name='complemento' 
                                                        label='Complemento:' 
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.complemento}
                                                        autoComplete='off'
                                                        disabled={loading}
                                                        placeholder="Opcional"
                                                        error={formik.touched.complemento ? formik.errors.complemento : undefined}
                                                    />
                                                </div>
                                        </div>
                                    </div>


                                    {/* Linha com Bairro, Cidade e Estado */}
                                    <div className="field is-horizontal">
                                        <div className="field-body">
                                            <div className="field">
                                                <Input 
                                                    className='input'
                                                    id='bairro' 
                                                    name='bairro' 
                                                    label='Bairro:' 
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.bairro}
                                                    autoComplete='off'
                                                    disabled={loading}
                                                    error={formik.touched.bairro ? formik.errors.bairro : undefined}
                                                />
                                            </div>
                                            <div className="field">
                                                <Input 
                                                    className='input'
                                                    id='cidade' 
                                                    name='cidade' 
                                                    label='Cidade:' 
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.cidade}
                                                    autoComplete='off'
                                                    disabled={loading}
                                                    error={formik.touched.cidade ? formik.errors.cidade : undefined}
                                                />
                                            </div>
                                            <div className="field">
                                                <Input 
                                                    className='input'
                                                    id='estado' 
                                                    name='estado' 
                                                    label='UF:' 
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.estado}
                                                    autoComplete='off'
                                                    disabled={loading}
                                                    maxLength={2}
                                                    placeholder="UF"
                                                    error={formik.touched.estado ? formik.errors.estado : undefined}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <Input 
                                            className='input is-full'
                                            id='email' 
                                            name='email' 
                                            label='E-mail:' 
                                            onChange={formik.handleChange} 
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                            autoComplete='off'
                                            disabled={loading}
                                            error={formik.touched.email ? formik.errors.email : undefined}
                                        />
                                    </div>

                                    <div className="field">
                                        <Input 
                                            className='input is-full'
                                            id='senha' 
                                            name='senha' 
                                            label='Senha:' 
                                            type='password'
                                            onChange={formik.handleChange} 
                                            onBlur={formik.handleBlur}
                                            value={formik.values.senha}
                                            autoComplete='off'
                                            disabled={loading}
                                            error={formik.touched.senha ? formik.errors.senha : undefined}
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
                                                href="/termos-de-uso-lava-rapidos"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Termos de Uso para Lava-Rápidos
                                            </a>
                                        </label>

                                        {formik.touched.aceitaTermos && formik.errors.aceitaTermos && (
                                            <p className="help is-danger">{formik.errors.aceitaTermos}</p>
                                        )}
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <button 
                                                type="submit" 
                                                className={`button is-primary is-fullwidth ${loading ? 'is-loading' : ''}`}
                                                disabled={loading}
                                            >
                                                {loading ? 'Cadastrando...' : 'Cadastrar Lava-Rápido'}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Links auxiliares */}
                                <div className="has-text-centered mt-4">
                                    <p className="is-size-7">
                                        Já possui uma conta?{" "}
                                        <Link href="/login/lava-rapidos">Fazer login</Link>
                                    </p>
                                    <p className="is-size-7 mt-2">
                                        É um cliente?{" "}
                                        <Link href="/clientes/cadastre-se">Cadastrar como cliente</Link>
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

export default CadastroLavaRapidoForm