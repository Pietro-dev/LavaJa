"use client"

import { Input } from "components/common"
import { Layout } from "components/layout"
import { GraficoBarras } from "./graficos"
import { AgendamentosPorDia } from "app/models/dashboard"

interface DashboardProps{
    clientes?: number,
    agendamentos?: number,
    servicos?: number,
    lavaRapidoId?: string,
    onLavaRapidoIdChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBuscarClick?: () => void,
    loading?: boolean,
    agendamentosPorDia?: AgendamentosPorDia[]
}

export const Dashboard: React.FC<DashboardProps> = ({
    clientes = 0, 
    agendamentos = 0,
    servicos = 0,
    lavaRapidoId = "",
    onLavaRapidoIdChange,
    onBuscarClick,
    loading = false,
    agendamentosPorDia = []
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
                    <div className="card has-background-primary">
                        <header className="card-header">
                            <div className="card-header-title has-text-white">
                                <p className="subtitle is-5 has-text-primary-dark">Clientes</p>
                            </div>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <p className="title is-1 has-text-primary-dark">{clientes}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="column is-one-third">
                    <div className="card has-background-success has-text-white">
                        <header className="card-header">
                            <div className="card-header-title ">
                                <p className="subtitle is-5 has-text-success-dark">Serviços</p>
                            </div>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <p className="title is-1 has-text-success-dark">{servicos}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="column is-one-third">
                    <div className="card has-background-warning">
                        <header className="card-header">
                            <div className="card-header-title">
                                <p className="subtitle is-5 has-text-warning-dark">Agendamentos</p>
                            </div>
                        </header>
                        <div className="card-content">
                            <div className="content">
                                <p className="title is-1 has-text-warning-dark">{agendamentos}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico - LAYOUT CORRIGIDO */}
            <div className="columns" style={{ marginTop: '2rem' }}>
                <div className="column is-full">
                    <div className="card">
                        <header className="card-header">
                            <div className="card-header-title">
                                <p className="title is-4">Agendamentos por Dia</p>
                            </div>
                        </header>
                        <div className="card-content">
                            <div className="content" style={{ 
                                height: '400px', 
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <GraficoBarras 
                                    agendamentosPorDia={agendamentosPorDia}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
)
}