package io.github.pietro_dev.lavajaapi.rest.dashboard;

import io.github.pietro_dev.lavajaapi.model.repository.projections.AgendamentoPorDia;
import lombok.Data;

import java.util.List;

@Data
public class DashboardData {
    private Long Servicos;
    private Long Agendamentos;
    private Long Clientes;
    private List<AgendamentoPorDia> AgendamentosPorDia;

    public DashboardData(Long servicos, Long agendamentos, Long clientes, List agendamentosPorDia) {
        Servicos = servicos;
        Agendamentos = agendamentos;
        Clientes = clientes;
        AgendamentosPorDia = agendamentosPorDia;
    }
}
