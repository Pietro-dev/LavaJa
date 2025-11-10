
"use client"

import { Input } from "components/common"
import { Layout } from "components/layout"

interface DashboardProps{
    clientes?: number,
    agendamentos?: number,
    servicos?: number,
    lavaRapidoId?: string,
    onLavaRapidoIdChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBuscarClick?: () => void,
    loading?: boolean
}

export const Dashboard: React.FC<DashboardProps> = ({
    clientes = 0, 
    agendamentos = 0,
    servicos = 0,
    lavaRapidoId = "",
    onLavaRapidoIdChange,
    onBuscarClick,
    loading = false
}) => {
    return (
        <Layout titulo="Dashboard">
            <div className="container" style={{ padding: '1rem' }}>
                {/* Input e Botão */}
                <div className="field is-grouped" style={{ marginBottom: '2rem' }}>
                    <div className="control is-expanded">
                        <Input 
                            className='input is-half'
                            id='lavaRapidoId' 
                            name='lavaRapidoId' 
                            label='Código do Lava Rápido:' 
                            onChange={onLavaRapidoIdChange} 
                            value={lavaRapidoId}
                            autoComplete='off'
                            placeholder="Digite o ID do lava rápido"
                        />
                    </div>
                    <div className="control" style={{ alignSelf: 'flex-end' }}>
                        <button 
                            className="button is-primary"
                            onClick={onBuscarClick}
                            disabled={loading}
                        >
                            {loading ? 'Carregando...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="notification is-info">
                        Carregando dados do Lava Rápido {lavaRapidoId}...
                    </div>
                )}

                {/* Cards */}
                <div className="columns is-multiline">
                    <div className="column is-one-third">
                        <div className="card has-background-primary has-text-white">
                            <header className="card-header">
                                <div className="card-header-title has-text-white">
                                    <p className="subtitle is-5">Clientes</p>
                                </div>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    <p className="title is-1 has-text-white">{clientes}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="column is-one-third">
                        <div className="card has-background-success has-text-white">
                            <header className="card-header">
                                <div className="card-header-title has-text-white">
                                    <p className="subtitle is-5">Serviços</p>
                                </div>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    <p className="title is-1 has-text-white">{servicos}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="column is-one-third">
                        <div className="card has-background-warning has-text-dark">
                            <header className="card-header">
                                <div className="card-header-title">
                                    <p className="subtitle is-5">Agendamentos</p>
                                </div>
                            </header>
                            <div className="card-content">
                                <div className="content">
                                    <p className="title is-1">{agendamentos}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}