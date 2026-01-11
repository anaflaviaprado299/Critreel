package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.Critica;

@Repository
@RegisterBeanMapper(Critica.class)
public interface CriticaRepository {

    @SqlQuery("select * from critica;")
    List<Critica> findAll();

    @SqlQuery("select * from critica where idCritica = :idCritica;")
    Critica findById(@Bind("idCritica") Long idCritica);

    // Buscar críticas por filme
    @SqlQuery("select * from critica where idFilme = :idFilme;")
    List<Critica> findByFilme(@Bind("idFilme") Long idFilme);

    // Buscar críticas por usuário
    @SqlQuery("select * from critica where idUsuario = :idUsuario;")
    List<Critica> findByUsuario(@Bind("idUsuario") Long idUsuario);

    @SqlUpdate("""
            insert into critica (tituloFilme,
            texto,
            idUsuario,
            idFilme,
            fotoCritica,
            dataCriacao)
            values (:tituloFilme,
            :texto,
            :idUsuario,
            :idFilme,
            :fotoCritica,
            :dataCriacao
            );
            """)
    @GetGeneratedKeys
    Long insert(@BindBean Critica critica);

    @SqlUpdate("""
            update critica
            set
            tituloFilme = :tituloFilme,
            texto = :texto,
            idUsuario = :idUsuario,
            idFilme = :idFilme,
            fotoCritica = :fotoCritica,
            dataCriacao = :dataCriacao
            where idCritica = :idCritica;
            """)
    int update(@BindBean Critica critica);

    @SqlUpdate("""
            delete from critica where idCritica = :idCritica;
            """)
    int delete(@Bind("idCritica") Long idCritica);

        // KPIs
        @SqlQuery("select count(*) from critica;")
        long countAll();

}
