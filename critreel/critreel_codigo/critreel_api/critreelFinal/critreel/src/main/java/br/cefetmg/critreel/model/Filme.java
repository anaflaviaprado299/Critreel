package br.cefetmg.critreel.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filme {
    private Long idFilme;
    private String titulo;
    private String sinopse;
    private String linkTrailer;
    private String anoLancamento;
    private Long idUsuario;
    private String linkAssistir;
}
