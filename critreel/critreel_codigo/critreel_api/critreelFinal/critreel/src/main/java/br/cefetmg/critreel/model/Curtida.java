package br.cefetmg.critreel.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Curtida {
    private Long idUsuario;
    private Long idCritica;
}
