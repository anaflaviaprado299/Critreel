package br.cefetmg.critreel.config;

import br.cefetmg.critreel.repository.CriticaRepository;
import br.cefetmg.critreel.repository.AvaliacaoFilmeRepository;
import br.cefetmg.critreel.repository.CurtidaRepository;
import br.cefetmg.critreel.repository.FavoritoRepository;
import br.cefetmg.critreel.repository.FilmeRepository;
import br.cefetmg.critreel.repository.ImagemFilmeRepository;
import br.cefetmg.critreel.repository.SeguidorRepository;
import br.cefetmg.critreel.repository.UsuarioRepository;

import org.jdbi.v3.core.Jdbi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RepositoryConfig {
    @Bean
    public UsuarioRepository getUsuarioRepository(Jdbi jdbi) {
        return jdbi.onDemand(UsuarioRepository.class);
    }

    @Bean
    public FilmeRepository getFilmeRepository(Jdbi jdbi) {
        return jdbi.onDemand(FilmeRepository.class);
    }

    @Bean
    public ImagemFilmeRepository getImagemFilmeRepository(Jdbi jdbi) {
        return jdbi.onDemand(ImagemFilmeRepository.class);
    }

    @Bean
    public CriticaRepository getCriticaRepository(Jdbi jdbi) {
        return jdbi.onDemand(CriticaRepository.class);
    }

    @Bean
    public FavoritoRepository getFavoritoRepository(Jdbi jdbi) {
        return jdbi.onDemand(FavoritoRepository.class);
    }

    @Bean
    public CurtidaRepository getCurtidaRepository(Jdbi jdbi) {
        return jdbi.onDemand(CurtidaRepository.class);
    }

    @Bean
    public SeguidorRepository getSeguidorRepository(Jdbi jdbi) {
        return jdbi.onDemand(SeguidorRepository.class);
    }

    @Bean
    public AvaliacaoFilmeRepository getAvaliacaoFilmeRepository(Jdbi jdbi) {
        return jdbi.onDemand(AvaliacaoFilmeRepository.class);
    }

    

}
