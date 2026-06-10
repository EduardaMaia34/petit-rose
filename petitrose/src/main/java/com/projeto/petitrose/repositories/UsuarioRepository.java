package com.projeto.petitrose.repositories;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.projeto.petitrose.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    
    Usuario findByUser(String user);
    
    boolean existsByUser(String user);
}