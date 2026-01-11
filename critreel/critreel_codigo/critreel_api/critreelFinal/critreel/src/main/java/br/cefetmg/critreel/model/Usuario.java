package br.cefetmg.critreel.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    private Long idUsuario;
    private String username;
    private String senha;
    private String dtNasc;
    private boolean suspensao;
    private String nomeCompleto;
    private String bioPerfil;
    private String fotoPerfil;
    private String email;
    private boolean admin; // indica se o usuário é administrador
}
