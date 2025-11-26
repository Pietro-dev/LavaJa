'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import httpClient from 'app/http'
import { Layout } from 'components/layout'

interface LavaRapido {
  id: number
  razaoSocial: string
  email: string
  cnpj: string
  endereco?: string
  telefone?: string
  dataCadastro: string
  role?: string
}

interface PerfilLavaRapidoProps {
  lavaRapidoId?: number
}

export function PerfilLavaRapido({ lavaRapidoId }: PerfilLavaRapidoProps) {
  const router = useRouter()
  const [lavaRapido, setLavaRapido] = useState<LavaRapido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [formData, setFormData] = useState<Partial<LavaRapido>>({})
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const getLoggedInLavaRapidoId = (): number | undefined => {
    if (typeof window === 'undefined') return undefined

    const userType = localStorage.getItem('userType')
    const lavaRapidoIdStr = localStorage.getItem('lavaRapidoId')
    
    if (userType === 'LAVA_RAPIDO' && lavaRapidoIdStr) {
      const lavaRapidoId = parseInt(lavaRapidoIdStr, 10)
      return isNaN(lavaRapidoId) ? undefined : lavaRapidoId
    }
    
    return undefined
  }

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true)
        
        let effectiveLavaRapidoId: number | undefined = lavaRapidoId
        
        if (!effectiveLavaRapidoId) {
          effectiveLavaRapidoId = getLoggedInLavaRapidoId()
        }

        if (!effectiveLavaRapidoId) {
          setError('Estabelecimento não autenticado')
          return
        }

        console.log('Carregando perfil do lava-rápido:', effectiveLavaRapidoId)

        const response = await httpClient.get<LavaRapido>(`/api/lava-rapidos/${effectiveLavaRapidoId}`)
        setLavaRapido(response.data)
        setFormData(response.data)

        console.log('Perfil do estabelecimento carregado com sucesso:', response.data)

      } catch (error: any) {
        console.error('Erro ao carregar perfil do lava-rápido:', error)
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError('Sessão expirada. Faça login novamente.')
          setTimeout(() => router.push('/login/lava-rapidos'), 2000)
        } else {
          setError('Não foi possível carregar o perfil do estabelecimento')
        }
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [lavaRapidoId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditar = () => {
    setEditando(true)
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
  }

  const handleCancelar = () => {
    setEditando(false)
    setFormData(lavaRapido || {})
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
  }

  const handleSalvar = async () => {
    try {
      setSalvando(true)
      
      if (!lavaRapido) {
        alert('Erro: Dados do estabelecimento não carregados')
        return
      }

      // Validação: precisa da senha atual para confirmar identidade
      if (!senhaAtual) {
        alert('Para atualizar o perfil, informe sua senha atual.')
        return
      }

      // Se informou nova senha, faz validações
      if (novaSenha) {
        if (novaSenha !== confirmarSenha) {
          alert('A nova senha e a confirmação não coincidem.')
          return
        }

        if (novaSenha.length < 6) {
          alert('A nova senha deve ter pelo menos 6 caracteres.')
          return
        }
      }

      console.log('💾 Salvando alterações do perfil:', formData)

      const dadosParaEnviar: any = {
        razaoSocial: formData.razaoSocial,
        email: formData.email,
        cnpj: formData.cnpj,
        endereco: formData.endereco,
        telefone: formData.telefone,
        senhaAtual: senhaAtual
      }

      if (novaSenha) {
        dadosParaEnviar.novaSenha = novaSenha
      }

      console.log('Dados a serem enviados:', dadosParaEnviar)

      // Faz a requisição PUT para atualizar o lava rápido
      const response = await httpClient.put(`/api/lava-rapidos/${lavaRapido.id}`, dadosParaEnviar)
      
      console.log('Perfil do estabelecimento atualizado com sucesso:', response.data)

      const dadosAtualizados = await httpClient.get<LavaRapido>(`/api/lava-rapidos/${lavaRapido.id}`)
      
      setLavaRapido(dadosAtualizados.data)
      setFormData(dadosAtualizados.data)
      setEditando(false)
      
      // Limpa os campos de senha
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      
      alert('Perfil do estabelecimento atualizado com sucesso!')

    } catch (error: any) {
      console.error('Erro ao atualizar perfil do estabelecimento:', error)
      
      if (error.response?.data) {
        const errorMessage = error.response.data.message || error.response.data
        
        // Trata erros específicos de senha
        if (errorMessage.includes('senha') || error.response.status === 401 || error.response.status === 403) {
          alert('Senha atual incorreta. Verifique e tente novamente.')
          setSenhaAtual('')
        } else {
          alert(`Erro ao atualizar perfil: ${errorMessage}`)
        }
      } else {
        alert('Erro ao atualizar perfil do estabelecimento. Tente novamente.')
      }
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <span className="icon is-large">
            <i className="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p>Carregando perfil do estabelecimento...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <div className="notification is-danger">
            <p>{error}</p>
            <div className="buttons is-centered mt-3">
              <button 
                className="button is-light"
                onClick={() => window.location.reload()}
              >
                Tentar Novamente
              </button>
              <button 
                className="button is-primary"
                onClick={() => router.push('/login/lava-rapidos')}
              >
                Fazer Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!lavaRapido) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <div className="notification is-warning">
            <p>Nenhum dado de estabelecimento encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout
      titulo="Perfil do Estabelecimento"
      subtitulo="Gerencie as informações do seu lava-rápido"
    >
      <div className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-two-thirds">
              <div className="card">
                <div className="card-content">
                  <div className="level">
                    <div className="level-left">
                      <div className="level-item">
                        <h2 className="title is-3">Minhas informações</h2>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        {!editando ? (
                          <button 
                            className="button is-primary is-dark"
                            onClick={handleEditar}
                          >
                            <span>Editar Perfil</span>
                          </button>
                        ) : (
                          <div className="buttons">
                            <button 
                              className="button is-success is-dark"
                              onClick={handleSalvar}
                              disabled={salvando}
                            >
                              <span>{salvando ? 'Salvando...' : 'Salvar'}</span>
                            </button>
                            <button 
                              className="button is-danger is-dark"
                              onClick={handleCancelar}
                              disabled={salvando}
                            >
                              <span>Cancelar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="content">
                    {/*CAMPOS DO LAVA RÁPIDO */}
                    <div className="field">
                      <label className="label">Nome do Estabelecimento</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="razaoSocial"
                          value={formData.razaoSocial || ''}
                          onChange={handleInputChange}
                          disabled={!editando || salvando}
                          placeholder="Nome do seu lava-rápido"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">E-mail</label>
                      <div className="control">
                        <input
                          className="input"
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleInputChange}
                          disabled={!editando || salvando}
                          placeholder="estabelecimento@email.com"
                        />
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label">CNPJ</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              name="cnpj"
                              value={formData.cnpj || ''}
                              onChange={handleInputChange}
                              disabled={!editando || salvando}
                              placeholder="00.000.000/0000-00"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label">Telefone</label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              name="telefone"
                              value={formData.telefone || ''}
                              onChange={handleInputChange}
                              disabled={!editando || salvando}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Endereço</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="endereco"
                          value={formData.endereco || ''}
                          onChange={handleInputChange}
                          disabled={!editando || salvando}
                          placeholder="Endereço completo do estabelecimento"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Data de Cadastro</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={lavaRapido.dataCadastro || ''}
                          disabled={true}
                          placeholder="Não informada"
                        />
                      </div>
                    </div>

                    {/* SEÇÃO DE SENHA*/}
                    {editando && (
                      <div className="box">
                        <p className="subtitle is-6 has-text-grey mb-4">
                          Para atualizar o perfil, informe sua senha atual
                        </p>

                        <div className="field">
                          <label className="label">
                            Senha Atual <span className="has-text-danger">*</span>
                          </label>
                          <div className="control">
                            <input
                              className="input"
                              type="password"
                              value={senhaAtual}
                              onChange={(e) => setSenhaAtual(e.target.value)}
                              disabled={salvando}
                              placeholder="Sua senha atual"
                              required
                            />
                          </div>
                          <p className="help has-text-danger">
                            Campo obrigatório para confirmar sua identidade
                          </p>
                        </div>

                        <hr className="my-4" />

                        <p className="subtitle is-6">Alterar Senha (Opcional)</p>
                        <p className="subtitle is-7 has-text-grey mb-4">
                          Preencha apenas se desejar alterar sua senha
                        </p>

                        <div className="columns">
                          <div className="column">
                            <div className="field">
                              <label className="label">Nova Senha</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="password"
                                  value={novaSenha}
                                  onChange={(e) => setNovaSenha(e.target.value)}
                                  disabled={salvando}
                                  placeholder="Mínimo 6 caracteres"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label">Confirmar Nova Senha</label>
                              <div className="control">
                                <input
                                  className="input"
                                  type="password"
                                  value={confirmarSenha}
                                  onChange={(e) => setConfirmarSenha(e.target.value)}
                                  disabled={salvando}
                                  placeholder="Repita a nova senha"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}