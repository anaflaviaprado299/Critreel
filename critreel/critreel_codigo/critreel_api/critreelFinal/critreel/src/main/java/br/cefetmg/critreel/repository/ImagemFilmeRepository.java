package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.ImagemFilme;

@Repository
@RegisterBeanMapper(ImagemFilme.class)
public interface ImagemFilmeRepository {

    // Buscar todas as imagens de filmes
    @SqlQuery("select * from imagemfilme;")
    List<ImagemFilme> findAll();

    // Buscar imagem pelo ID
    @SqlQuery("select * from imagemfilme where idImagemFilme = :idImagemFilme;")
    ImagemFilme findById(@Bind("idImagemFilme") Long idImagemFilme);

    // Buscar imagens de um filme específico
    @SqlQuery("select * from imagemfilme where idFilme = :idFilme;")
    List<ImagemFilme> findByFilme(@Bind("idFilme") Long idFilme);

    // Inserir uma imagem de filme
    @SqlUpdate("""
            insert into imagemfilme (caminho, idFilme, tipo)
            values (:caminho, :idFilme, :tipo);
            """)
    @GetGeneratedKeys
    Long insert(@BindBean ImagemFilme imagemFilme);

    // Atualizar imagem de filme
    @SqlUpdate("""
            update imagemfilme
            set caminho = :caminho
            where idImagemFilme = :idImagemFilme;
            """)
    int update(@BindBean ImagemFilme imagemFilme);

    // Excluir imagem de filme
    @SqlUpdate("delete from imagemfilme where idImagemFilme = :idImagemFilme;")
    int delete(@Bind("idImagemFilme") Long idImagemFilme);
}
