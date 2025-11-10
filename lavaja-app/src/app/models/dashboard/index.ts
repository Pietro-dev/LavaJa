export interface DashboardData {
    clientes?: number,
    servicos?: number,
    agendamentos?: number,
    agendamentosPorDia?: Array<AgendamentosPorDia>
}

export interface AgendamentosPorDia {
    dia?: number,
    totalAgendamentos?: number
}