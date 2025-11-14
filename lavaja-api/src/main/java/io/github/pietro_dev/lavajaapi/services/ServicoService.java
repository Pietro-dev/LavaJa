package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.Servico;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.model.repository.ServicoRepository;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoFormRequest;
import io.github.pietro_dev.lavajaapi.rest.servicos.ServicoListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public List<ServicoListDTO> listarPorRazaoSocialLavaRapido(String razaoSocial){
        if (razaoSocial==null || razaoSocial.isBlank()){
            return servicoRepository.findAll().stream()
                    .map(servico -> new ServicoListDTO(
                            servico.getId(),
                            servico.getServico(),
                            servico.getDescricao(),
                            servico.getValor(),
                            servico.getDuracao(),
                            servico.getDataCadastro(),
                            servico.getLavaRapido().getId(),
                            servico.getLavaRapido().getRazaoSocial()))
                    .toList();
        } else {
            return servicoRepository.findByLavaRapidoRazaoSocialContainingIgnoreCase(razaoSocial);
        }
    }

    public List<Servico> findByLavaRapidoId(Long lavaRapidoId) {
        return servicoRepository.findByLavaRapidoId(lavaRapidoId);
    }
}
