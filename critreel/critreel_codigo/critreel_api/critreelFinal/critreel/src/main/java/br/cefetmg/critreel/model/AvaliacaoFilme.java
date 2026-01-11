package br.cefetmg.critreel.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoFilme {
private Long idFilme;
private Long idUsuario;
private int nota;
}
