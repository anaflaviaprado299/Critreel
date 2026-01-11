package br.cefetmg.critreel.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Critica {
    private Long idCritica;
    private String tituloFilme;
    private String texto;
    private Long idUsuario;
    private Long idFilme;
    private String dataCriacao;
    private String fotoCritica;
}
