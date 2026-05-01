package com.projeto.petitrose.models;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Data //getters e setters
@Table(name="Usuario")
public class Usuario implements Serializable, UserDetails{
    private static final long serialVersionUID = 1L; //camada extra de seguranca
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable=false, length = 100)
    private String nome;
    @Column(nullable=false, unique=true)
    private String email;
    @Column(nullable=false)
    private String senha;

    private Boolean gerente = false; //valor padrao


    //user detail - padrao
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Se o usuário for gerente, ele terá permissões de ADMIN e USER.
        // Se não for, terá apenas permissão de USER.
        if (Boolean.TRUE.equals(this.gerente)) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        // O Spring Security chama getPassword(), mas retorna o seu atributo 'senha'
        return this.senha;
    }

    @Override
    public String getUsername() {
        // O Spring Security chama getUsername(), mas retorna o seu atributo 'email'
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Conta ativa e não expirada
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Conta não bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credenciais válidas
    }

    @Override
    public boolean isEnabled() {
        return true; // Usuário ativo
    }
}
