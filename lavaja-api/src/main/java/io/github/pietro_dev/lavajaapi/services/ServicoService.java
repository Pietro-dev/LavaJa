package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoFormRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private LavaRapidoRepository lavaRapidoRepository;

    public Servico salvar(ServicoFormRequest servicoFormRequest){
        Servico servico = servicoFormRequest.toModel();

        LavaRapido lavaRapido = lavaRapidoRepository.findById(servicoFormRequest.getLavaRapidoId())
                .orElseThrow(() -> new RuntimeException("Lava-Rápido não encontrado!"));

        servico.setLavaRapido(lavaRapido);

        return servicoRepository.save(servico);
    }
}
