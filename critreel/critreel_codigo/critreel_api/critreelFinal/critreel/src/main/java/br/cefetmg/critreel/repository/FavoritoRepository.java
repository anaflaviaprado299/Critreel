package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.Favorito;
import br.cefetmg.critreel.model.Filme;

@Repository
@RegisterBeanMapper(Favorito.class)
public interface FavoritoRepository {

    // Verificar se um filme já é favorito do usuário (retorna boolean)
    @SqlQuery("select count(*) > 0 from filmesfavoritos where idUsuario = :idUsuario and idFilme = :idFilme;")
    boolean verificarFavorito(@Bind("idUsuario") Long idUsuario, @Bind("idFilme") Long idFilme);

    // Inserir um novo favorito
    @SqlUpdate("""
            insert into filmesfavoritos (idUsuario, idFilme)
            values (:idUsuario, :idFilme);
            """)
    int insert(@BindBean Favorito favorito); // ← Retorna int (linhas afetadas)

    // Buscar todos os filmes favoritos de um usuário (retorna objetos Filme)
    @SqlQuery("""
            select f.* from filme f
            inner join filmesfavoritos fav on f.idFilme = fav.idFilme
            where fav.idUsuario = :idUsuario;
            """)
    @RegisterBeanMapper(Filme.class)
    List<Filme> findFilmesByUsuario(@Bind("idUsuario") Long idUsuario);

    // Remover favorito por usuário e filme
    @SqlUpdate("delete from filmesfavoritos where idUsuario = :idUsuario and idFilme = :idFilme;")
    int deleteByUsuarioAndFilme(@Bind("idUsuario") Long idUsuario, @Bind("idFilme") Long idFilme);
}