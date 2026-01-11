package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.Seguidor;
import br.cefetmg.critreel.model.Usuario;

@Repository
@RegisterBeanMapper(Seguidor.class)
public interface SeguidorRepository {

    // Verificar se idSeguidor já segue idSeguido
    @SqlQuery("select count(*) > 0 from seguidores where idSeguidor = :idSeguidor and idSeguido = :idSeguido;")
    boolean verificarSeguimento(@Bind("idSeguidor") Long idSeguidor, @Bind("idSeguido") Long idSeguido);

    // Seguir (inserir relação)
    @SqlUpdate("""
            insert into seguidores (idSeguidor, idSeguido)
            values (:idSeguidor, :idSeguido);
            """)
    int seguir(@BindBean Seguidor seguidor);

    // Deixar de seguir (remover relação)
    @SqlUpdate("delete from seguidores where idSeguidor = :idSeguidor and idSeguido = :idSeguido;")
    int deixarDeSeguir(@Bind("idSeguidor") Long idSeguidor, @Bind("idSeguido") Long idSeguido);

    // Listar seguidores de um usuário (quem segue este usuário)
    @SqlQuery("""
            select u.* from Usuario u
            inner join Seguidores s on u.idUsuario = s.idSeguidor
            where s.idSeguido = :idUsuario;
            """)
    @RegisterBeanMapper(Usuario.class)
    List<Usuario> listarSeguidores(@Bind("idUsuario") Long idUsuario);

    // Listar quem um usuário segue (os seguidos por ele)
    @SqlQuery("""
            select u.* from usuario u
            inner join seguidores s on u.idUsuario = s.idSeguido
            where s.idSeguidor = :idUsuario;
            """)
    @RegisterBeanMapper(Usuario.class)
    List<Usuario> listarSeguindo(@Bind("idUsuario") Long idUsuario);

    // Contar seguidores
    @SqlQuery("select count(*) from seguidores where idSeguido = :idUsuario;")
    int contarSeguidores(@Bind("idUsuario") Long idUsuario);

    // Contar seguindo
    @SqlQuery("select count(*) from seguidores where idSeguidor = :idUsuario;")
    int contarSeguindo(@Bind("idUsuario") Long idUsuario);
}
