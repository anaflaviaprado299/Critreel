package br.cefetmg.critreel.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seguidor {
    private Long idSeguidor; // quem segue
    private Long idSeguido;  // quem é seguido
}
