package com.projeto.petitrose.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.projeto.petitrose.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID>{
    
    UserDetails findByEmail(String email);
    boolean existsByEmail(String email);
}
