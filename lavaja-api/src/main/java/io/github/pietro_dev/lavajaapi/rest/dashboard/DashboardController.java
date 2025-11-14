package io.github.pietro_dev.lavajaapi.rest.dashboard;

import io.github.pietro_dev.lavajaapi.model.Agendamento;
import io.github.pietro_dev.lavajaapi.model.repository.AgendamentoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private AgendamentoRepository agendamentoRepository;
    @Autowired
    private ServicoRepository servicoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;


    @GetMapping("/{lavaRapidoId}")
    public DashboardData getDashboard(@PathVariable Long lavaRapidoId) {
        System.out.println("lavaRapidoId: " + lavaRapidoId);
        long agendamentosCount = agendamentoRepository.countByLavaRapidoId(lavaRapidoId);
        long servicosCount = servicoRepository.countByLavaRapidoId(lavaRapidoId);
        long usuariosCount = agendamentoRepository.countDistinctUsuariosByLavaRapidoId(lavaRapidoId);

        var mesCorrente = LocalDate.now().getMonthValue();
        var agendamentosPorDia = agendamentoRepository.obterContagemAgendamentoPorDia(mesCorrente, lavaRapidoId);

        return new DashboardData(servicosCount, agendamentosCount, usuariosCount, agendamentosPorDia);
    }
}
