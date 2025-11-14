package io.github.pietro_dev.lavajaapi.services;

import io.github.pietro_dev.lavajaapi.model.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AuthorizationService authorizationService;

    private final String EXISTING_EMAIL = "usuario@exemplo.com";
    private final String NON_EXISTING_EMAIL = "naoexiste@exemplo.com";

    @Test
    void loadUserByUsername_WhenUserExists_ShouldReturnUserDetails() {
        // Arrange
        UserDetails mockUserDetails = mock(UserDetails.class);
        when(usuarioRepository.findByEmail(EXISTING_EMAIL)).thenReturn(mockUserDetails);

        // Act
        UserDetails result = authorizationService.loadUserByUsername(EXISTING_EMAIL);

        // Assert
        assertNotNull(result);
        assertEquals(mockUserDetails, result);
        verify(usuarioRepository, times(1)).findByEmail(EXISTING_EMAIL);
    }

    @Test
    void loadUserByUsername_WhenUserDoesNotExist_ShouldThrowUsernameNotFoundException() {
        // Arrange
        when(usuarioRepository.findByEmail(NON_EXISTING_EMAIL)).thenReturn(null);

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> authorizationService.loadUserByUsername(NON_EXISTING_EMAIL)
        );

        assertEquals("Usuário não encontrado: " + NON_EXISTING_EMAIL, exception.getMessage());
        verify(usuarioRepository, times(1)).findByEmail(NON_EXISTING_EMAIL);
    }

    @Test
    void loadUserByUsername_WhenRepositoryThrowsException_ShouldPropagateException() {
        // Arrange
        RuntimeException expectedException = new RuntimeException("Erro de banco de dados");
        when(usuarioRepository.findByEmail(EXISTING_EMAIL)).thenThrow(expectedException);

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authorizationService.loadUserByUsername(EXISTING_EMAIL)
        );

        assertEquals(expectedException, exception);
        verify(usuarioRepository, times(1)).findByEmail(EXISTING_EMAIL);
    }

    @Test
    void loadUserByUsername_ShouldCallRepositoryWithCorrectEmail() {
        // Arrange
        String specificEmail = "teste@especifico.com";
        UserDetails mockUserDetails = mock(UserDetails.class);
        when(usuarioRepository.findByEmail(specificEmail)).thenReturn(mockUserDetails);

        // Act
        UserDetails result = authorizationService.loadUserByUsername(specificEmail);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository, times(1)).findByEmail(specificEmail);
    }
}