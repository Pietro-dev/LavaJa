package io.github.pietro_dev.lavajaapi.rest.dashboard;

import io.github.pietro_dev.lavajaapi.model.Agendamento;
import io.github.pietro_dev.lavajaapi.model.repository.AgendamentoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;
    @Autowired
    private ServicoRepository servicoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public DashboardData getDashboard(@RequestParam Long lavaRapidoId) {
        long agendamentosCount = agendamentoRepository.countByLavaRapidoId(lavaRapidoId);
        long servicosCount = servicoRepository.countByLavaRapidoId(lavaRapidoId);
        long usuariosCount = agendamentoRepository.countDistinctUsuariosByLavaRapidoId(lavaRapidoId);

        return new DashboardData(servicosCount, agendamentosCount, usuariosCount);
    }
}
