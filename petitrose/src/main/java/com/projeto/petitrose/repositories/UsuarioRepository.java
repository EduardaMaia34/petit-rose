package com.projeto.petitrose.repositories;

import com.projeto.petitrose.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    @Query("SELECT u FROM Usuario u WHERE u.user = :login")
    Usuario findByUser(@Param("login") String login);

    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.user = :login")
    boolean existsByUser(@Param("login") String login);
}