package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoFormRequest;
import io.github.pietro_dev.lavajaapi.dtos.lavarapidos.LavaRapidoResponseDTO;
import io.github.pietro_dev.lavajaapi.dtos.servicos.ServicoResponseDTO;
import io.github.pietro_dev.lavajaapi.model.entity.LavaRapido;
import io.github.pietro_dev.lavajaapi.model.repository.LavaRapidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class LavaRapidoService {

    @Autowired
    private LavaRapidoRepository lavaRapidoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LavaRapido salvarLavaRapido(LavaRapidoFormRequest request) {
        // Validação de email único
        if (lavaRapidoRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Já existe um lava-rápido cadastrado com este email: " + request.getEmail());
        }

        LavaRapido lavaRapido = request.toModel();
        lavaRapido.setSenha(passwordEncoder.encode(request.getSenha()));

        return lavaRapidoRepository.save(lavaRapido);
    }

    public LavaRapido atualizarLavaRapido(Long id, LavaRapidoFormRequest request) {
        LavaRapido lavaRapidoExistente = lavaRapidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lava-rápido não encontrado com ID: " + id));

        LavaRapido lavaRapidoNovo = request.toModel();

        // Atualiza todos os campos exceto a senha (se estiver vazia ou null)
        lavaRapidoExistente.setRazaoSocial(lavaRapidoNovo.getRazaoSocial());
        lavaRapidoExistente.setCnpj(lavaRapidoNovo.getCnpj());
        lavaRapidoExistente.setEndereco(lavaRapidoNovo.getEndereco());
        lavaRapidoExistente.setTelefone(lavaRapidoNovo.getTelefone());
        lavaRapidoExistente.setEmail(lavaRapidoNovo.getEmail());

        // Só atualiza a senha se foi fornecida uma nova
        if (lavaRapidoNovo.getSenha() != null && !lavaRapidoNovo.getSenha().trim().isEmpty()) {
            lavaRapidoExistente.setSenha(passwordEncoder.encode(lavaRapidoNovo.getSenha()));
        }

        return lavaRapidoRepository.save(lavaRapidoExistente);
    }

    public Optional<LavaRapido> buscarPorId(Long id) {
        return lavaRapidoRepository.findById(id);
    }

    public void deletarLavaRapido(Long id) {
        LavaRapido lavaRapido = lavaRapidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lava-rápido não encontrado com ID: " + id));
        lavaRapidoRepository.delete(lavaRapido);
    }

    public List<LavaRapidoResponseDTO> listarTodos() {
        List<LavaRapido> lavaRapidos = lavaRapidoRepository.findAll();
        return lavaRapidos.stream()
                .map(LavaRapidoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public LavaRapidoResponseDTO buscarPorIdComServicos(Long id) {
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