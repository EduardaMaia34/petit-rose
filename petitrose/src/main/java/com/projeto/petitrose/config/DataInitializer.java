package com.projeto.petitrose.config;

import com.projeto.petitrose.models.Categoria;
import com.projeto.petitrose.models.Usuario;
import com.projeto.petitrose.repositories.CategoriaRepository;
import com.projeto.petitrose.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            CategoriaRepository categoriaRepository, 
            UsuarioRepository usuarioRepository, 
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            // inicializar categorias padroes
            if (categoriaRepository.count() == 0) {
                Categoria bolo = new Categoria();
                bolo.setNome("Bolo");

                Categoria bebida = new Categoria();
                bebida.setNome("Bebida");

                Categoria doce = new Categoria();
                doce.setNome("Doce");

                Categoria salgado = new Categoria();
                salgado.setNome("Salgado");

                categoriaRepository.saveAll(List.of(bolo, bebida, doce, salgado));
                System.out.println("🌱 Categorias padrões inicializadas com sucesso!");
            }

            // usuário automático de ADMIN
            if (usuarioRepository.findByUser("admin") == null) { 
                
                Usuario admin = new Usuario();
                admin.setUser("admin");
                admin.setNome("Administrador PetitRose");
                
                String senhaCriptografada = passwordEncoder.encode("admin123");
                admin.setSenha(senhaCriptografada);
                
                admin.setGerente(true); 
                
                usuarioRepository.save(admin);
                System.out.println("👤 Usuário administrador padrão (admin/admin123) criado com sucesso!");
            } else {
                System.out.println("✅ Usuário administrador já existe no banco.");
            }
        };
    }
}