package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoResponseDTO;
import io.github.pietro_dev.lavajaapi.dtos.servicos.ServicoResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LavaRapidoService {

    @Autowired
    private LavaRapidoRepository lavaRapidoRepository;

    public LavaRapidoResponseDTO findByIdWithServicos(Long id) {
        LavaRapido lavaRapido = lavaRapidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LavaRapido não encontrado"));

        return toResponseDTO(lavaRapido);
    }

    public List<LavaRapidoResponseDTO> listarLavaRapidosComServico() {
        List<LavaRapido> lavaRapidos = lavaRapidoRepository.findAll();
        return lavaRapidos.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private LavaRapidoResponseDTO toResponseDTO(LavaRapido lavaRapido) {
        List<ServicoResponseDTO> servicosDTO = lavaRapido.getServicos().stream()
                .map(servico -> new ServicoResponseDTO(
                        servico.getId(),
                        servico.getServico(),
                        servico.getDescricao(),
                        servico.getValor(),
                        servico.getDuracao(),
                        servico.getDataCadastro()
                ))
                .collect(Collectors.toList());

        return new LavaRapidoResponseDTO(
                lavaRapido.getId(),
                lavaRapido.getRazaoSocial(),
                lavaRapido.getCnpj(),
                lavaRapido.getEndereco(),
                lavaRapido.getTelefone(),
                lavaRapido.getEmail(),
                lavaRapido.getDataCadastro(),
                servicosDTO
        );
    }
}