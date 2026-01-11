package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.Filme;

@Repository
@RegisterBeanMapper(Filme.class)
public interface FilmeRepository {

    @SqlQuery("select * from filme;")
    List<Filme> findAll();

    @SqlQuery("select * from filme where idFilme = :idFilme;")
    Filme findById(@Bind("idFilme") Long idFilme);

    // NOVO: Método para buscar filmes por ID de usuário
    @SqlQuery("select * from filme where idUsuario = :idUsuario;")
    List<Filme> findByUsuario(@Bind("idUsuario") Long idUsuario);

    @SqlUpdate("""
                    insert into filme (titulo,
            sinopse,
            linkTrailer,
            anoLancamento,
            idUsuario,
            linkAssistir)
                    values (:titulo,
            :sinopse,
            :linkTrailer,
            :anoLancamento,
            :idUsuario,
            :linkAssistir
            );
                """)
    @GetGeneratedKeys
    Long insert(@BindBean Filme filme);

    @SqlUpdate("""
            update filme
                set
                titulo = :titulo,
                sinopse = :sinopse,
                linkTrailer = :linkTrailer,
                anoLancamento = :anoLancamento,
                idUsuario = :idUsuario,
                linkAssistir = :linkAssistir
                where idFilme = :idFilme;
                    """)
    int update(@BindBean Filme filme);

    @SqlUpdate("""
                delete from filme where idFilme = :idFilme;
            """)
    int delete(@Bind("idFilme") Long idFilme);

    // KPIs
    @SqlQuery("select count(*) from filme;")
    long countAll();
}
