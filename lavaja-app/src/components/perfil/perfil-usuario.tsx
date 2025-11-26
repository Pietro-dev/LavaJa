// components/perfil/PerfilUsuario.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import httpClient from 'app/http'
import { Layout } from 'components/layout'

interface Usuario {
  id: number
  nome: string
  email: string
  dataCadastro: string
  role?: string
}

interface PerfilUsuarioProps {
  usuarioId?: number
}

export function PerfilUsuario({ usuarioId }: PerfilUsuarioProps) {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [formData, setFormData] = useState<Partial<Usuario>>({})
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  
  // Estados para a funcionalidade de deletar conta
  const [modalDeletarAberto, setModalDeletarAberto] = useState(false)
  const [confirmacaoDeletar, setConfirmacaoDeletar] = useState('')
  const [senhaDeletar, setSenhaDeletar] = useState('')
  const [deletando, setDeletando] = useState(false)

  const getLoggedInUserId = (): number | undefined => {
    if (typeof window === 'undefined') return undefined

    const usuarioIdStr = localStorage.getItem('usuarioId')
    if (usuarioIdStr) {
      const usuarioId = parseInt(usuarioIdStr, 10)
      return isNaN(usuarioId) ? undefined : usuarioId
    }
    
    return undefined
  }

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true)
        
        let effectiveUsuarioId: number | undefined = usuarioId
        
        if (!effectiveUsuarioId) {
          effectiveUsuarioId = getLoggedInUserId()
        }

        if (!effectiveUsuarioId) {
          setError('Usuário não autenticado')
          return
        }

        console.log('🔍 Carregando perfil do usuário:', effectiveUsuarioId)

        const response = await httpClient.get<Usuario>(`/api/usuarios/${effectiveUsuarioId}`)
        setUsuario(response.data)
        setFormData(response.data)

        console.log('Perfil carregado com sucesso:', response.data)

      } catch (error: any) {
        console.error('Erro ao carregar perfil:', error)
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError('Sessão expirada. Faça login novamente.')
          setTimeout(() => router.push('/login'), 2000)
        } else {
          setError('Não foi possível carregar o perfil do usuário')
        }
      } finally {
        setLoading(false)
      }
    }

    carregarPerfil()
  }, [usuarioId, router])

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
    setFormData(usuario || {})
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
  }

  const handleSalvar = async () => {
    try {
      setSalvando(true)
      
      if (!usuario) {
        alert('Erro: Dados do usuário não carregados')
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
        nome: formData.nome,
        email: formData.email,
        senhaAtual: senhaAtual
      }

      if (novaSenha) {
        dadosParaEnviar.novaSenha = novaSenha
      }

      console.log('📤 Dados a serem enviados:', dadosParaEnviar)

      // Faz a requisição PUT para atualizar o usuário
      const response = await httpClient.put(`/api/usuarios/${usuario.id}`, dadosParaEnviar)
    
      console.log('Perfil atualizado com sucesso:', response.data)
      
      setUsuario(response.data)
      setFormData(response.data)
      setEditando(false)
      
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      
      alert('Perfil atualizado com sucesso!')

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      
      if (error.response?.data) {
        const errorMessage = error.response.data.message || error.response.data
        
        // Trata erros específicos de senha
        if (errorMessage.includes('senha') || error.response.status === 401 || error.response.status === 403) {
          alert('Senha atual incorreta. Verifique e tente novamente.')
          setSenhaAtual('') // Limpa o campo para nova tentativa
        } else {
          alert(`Erro ao atualizar perfil: ${errorMessage}`)
        }
      } else {
        alert('Erro ao atualizar perfil. Tente novamente.')
      }
    } finally {
      setSalvando(false)
    }
  }

  const abrirModalDeletar = () => {
    setModalDeletarAberto(true)
    setConfirmacaoDeletar('')
    setSenhaDeletar('')
  }

  const fecharModalDeletar = () => {
    setModalDeletarAberto(false)
    setConfirmacaoDeletar('')
    setSenhaDeletar('')
    setDeletando(false)
  }

  const handleDeletarConta = async () => {
    try {
      if (!usuario) return

      // Validações
      if (confirmacaoDeletar !== 'DELETAR MINHA CONTA') {
        alert('Por favor, digite exatamente "DELETAR MINHA CONTA" para confirmar.')
        return
      }

      if (!senhaDeletar) {
        alert('Por favor, informe sua senha para confirmar a exclusão.')
        return
      }

      setDeletando(true)

      console.log('🗑️ Iniciando exclusão da conta...')

     await httpClient.delete(`/api/usuarios/${usuario.id}`, {
        data: {
          senha: senhaDeletar
        }
      })

      console.log('✅ Conta deletada com sucesso')

      localStorage.removeItem('usuarioId')
      localStorage.removeItem('token') // se você armazena token
      localStorage.removeItem('userData') // se você armazena outros dados

      alert('Sua conta foi deletada com sucesso. Sentiremos sua falta!')

      router.push('/')

    } catch (error: any) {
      console.error('Erro ao deletar conta:', error)
      
      if (error.response?.data) {
        const errorMessage = error.response.data.message || error.response.data
        
        if (errorMessage.includes('senha') || error.response.status === 401) {
          alert('Senha incorreta. Verifique e tente novamente.')
          setSenhaDeletar('')
        } else {
          alert(`Erro ao deletar conta: ${errorMessage}`)
        }
      } else {
        alert('Erro ao deletar conta. Tente novamente.')
      }
    } finally {
      setDeletando(false)
    }
  }

  if (loading) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <span className="icon is-large">
            <i className="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p>Carregando perfil...</p>
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
                onClick={() => router.push('/login')}
              >
                Fazer Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="section">
        <div className="container has-text-centered">
          <div className="notification is-warning">
            <p>Nenhum dado de usuário encontrado.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout
      titulo="Meu Perfil"
      subtitulo="Gerencie suas informações pessoais"
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
                        <h2 className="title is-3">Informações Pessoais</h2>
                      </div>
                    </div>
                    <div className="level-right">
                      <div className="level-item">
                        {!editando ? (
                          <div className="buttons">
                            <button 
                              className="button is-primary is-dark"
                              onClick={handleEditar}
                            >
                              <span>Editar Perfil</span>
                            </button>
                            <button 
                              className="button is-danger is-outlined"
                              onClick={abrirModalDeletar}
                            >
                              <span>Deletar Conta</span>
                            </button>
                          </div>
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
                    <div className="field">
                      <label className="label">Nome Completo</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          name="nome"
                          value={formData.nome || ''}
                          onChange={handleInputChange}
                          disabled={!editando || salvando}
                          placeholder="Seu nome completo"
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
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Data de Cadastro</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          value={usuario.dataCadastro ? usuario.dataCadastro : ''}
                          disabled={true}
                          placeholder="Não informada"
                        />
                      </div>
                    </div>

                    {/* SEÇÃO DE SENHA*/}
                    {editando && (
                      <div className="box">
                        <p className="subtitle is-6 has-text-grey mb-4">
                          Para atualizar seu perfil, informe sua senha atual
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

      {/*MODAL PARA CONFIRMAR EXCLUSÃO DA CONTA */}
      {modalDeletarAberto && (
        <div className="modal is-active">
          <div className="modal-background" onClick={fecharModalDeletar}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Deletar Conta Permanentemente</p>
              <button 
                className="delete" 
                aria-label="close"
                onClick={fecharModalDeletar}
                disabled={deletando}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="content">
                <div className="notification is-danger is-light">
                  <strong>Atenção! Esta ação é irreversível.</strong>
                  <br />
                  Todos os seus dados serão permanentemente excluídos e não poderão ser recuperados.
                </div>

                <div className="field">
                  <label className="label">
                    Digite <code>DELETAR MINHA CONTA</code> para confirmar:
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={confirmacaoDeletar}
                      onChange={(e) => setConfirmacaoDeletar(e.target.value)}
                      disabled={deletando}
                      placeholder="DELETAR MINHA CONTA"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">
                    Sua Senha <span className="has-text-danger">*</span>
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="password"
                      value={senhaDeletar}
                      onChange={(e) => setSenhaDeletar(e.target.value)}
                      disabled={deletando}
                      placeholder="Digite sua senha atual"
                      required
                    />
                  </div>
                  <p className="help has-text-danger">
                    Necessária para confirmar a exclusão
                  </p>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button 
                className="button is-danger"
                onClick={handleDeletarConta}
                disabled={deletando || confirmacaoDeletar !== 'DELETAR MINHA CONTA' || !senhaDeletar}
              >
                {deletando ? 'Deletando...' : 'Deletar Minha Conta Permanentemente'}
              </button>
              <button 
                className="button"
                onClick={fecharModalDeletar}
                disabled={deletando}
              >
                Cancelar
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  )
}