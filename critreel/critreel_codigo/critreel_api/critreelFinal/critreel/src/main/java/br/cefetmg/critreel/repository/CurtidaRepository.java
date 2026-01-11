package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.Curtida;
import br.cefetmg.critreel.model.Usuario;

@Repository
@RegisterBeanMapper(Curtida.class)
public interface CurtidaRepository {

    // Verificar se uma crítica já tem curtida do usuário
    @SqlQuery("select count(*) > 0 from curtidacritica where idUsuario = :idUsuario and idCritica = :idCritica;")
    boolean verificarCurtida(@Bind("idUsuario") Long idUsuario, @Bind("idCritica") Long idCritica);

    // Inserir uma nova curtida
    @SqlUpdate("""
            insert into curtidacritica (idUsuario, idCritica)
            values (:idUsuario, :idCritica);
            """)
    int insert(@BindBean Curtida curtida);

    // // Buscar todas as críticas curtidas por um usuário
    // @SqlQuery("""
    //         select c.* from critica c
    //         inner join curtidacritica cur on c.idCritica = cur.idCritica
    //         where cur.idUsuario = :idUsuario;
    //         """)
    // @RegisterBeanMapper(Critica.class)
    // List<Critica> findCriticasByUsuario(@Bind("idUsuario") Long idUsuario);

    // Remover curtida
    @SqlUpdate("delete from curtidacritica where idUsuario = :idUsuario and idCritica = :idCritica;")
    int deleteByUsuarioAndCritica(@Bind("idUsuario") Long idUsuario, @Bind("idCritica") Long idCritica);

    // // Contar curtidas de uma crítica
    // @SqlQuery("select count(*) from curtidacritica where idCritica = :idCritica;")
    // int countCurtidasByCritica(@Bind("idCritica") Long idCritica);
    
    // Buscar usuários que curtiram uma crítica específica
    @SqlQuery("""
            select u.* from usuario u
            inner join curtidacritica cc on u.idUsuario = cc.idUsuario
            where cc.idCritica = :idCritica;
            """)
    @RegisterBeanMapper(Usuario.class)
    List<Usuario> findUsuariosByCritica(@Bind("idCritica") Long idCritica);
}
