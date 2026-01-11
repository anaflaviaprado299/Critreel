package br.cefetmg.critreel.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImagemFilme {
    private Long idImagemFilme;
    private Long idFilme;
    private String tipo; // "POSTER" ou "CENA"
    private String caminho;
}
