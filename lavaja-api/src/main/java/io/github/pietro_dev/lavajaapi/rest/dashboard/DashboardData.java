package io.github.pietro_dev.lavajaapi.rest.dashboard;

import lombok.Data;

@Data
public class DashboardData {
    private Long Servicos;
    private Long Agendamentos;
    private Long Clientes;

    public DashboardData(Long servicos, Long agendamentos, Long clientes) {
        Servicos = servicos;
        Agendamentos = agendamentos;
        Clientes = clientes;
    }
}
