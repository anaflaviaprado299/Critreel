package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.Usuario;

@Repository
@RegisterBeanMapper(Usuario.class)
public interface UsuarioRepository {

    @SqlQuery("select * from usuario;")
    List<Usuario> findAll();

    @SqlQuery("select * from usuario where idUsuario = :idUsuario;")
    Usuario findById(@Bind("idUsuario") Long idUsuario);

    @SqlQuery("select * from usuario where email = :email and senha = :senha;")
    Usuario findByEmailAndSenha(@Bind("email") String email, @Bind("senha") String senha);

    @SqlUpdate("""
                insert into usuario (username, senha, dtNasc, suspensao, nomeCompleto, bioPerfil, fotoPerfil, email, admin)
                values (:username, :senha, :dtNasc, :suspensao, :nomeCompleto, :bioPerfil, :fotoPerfil, :email, 0);
            """)
    @GetGeneratedKeys
    Long insert(@BindBean Usuario usuario);

    @SqlUpdate("""
                update usuario
                set username = :username,
                    senha = :senha,
                    dtNasc = :dtNasc,
                    suspensao = :suspensao,
                    nomeCompleto = :nomeCompleto,
                    bioPerfil = :bioPerfil,
                    fotoPerfil = :fotoPerfil,
                    email = :email,
                    admin = :admin
                where idUsuario = :idUsuario;
            """)
    int update(@BindBean Usuario usuario);

    @SqlUpdate("""
                delete from usuario where idUsuario = :idUsuario;
            """)
    int delete(@Bind("idUsuario") Long idUsuario);

    // Retorna se o usuário é admin
    @SqlQuery("select admin from usuario where idUsuario = :idUsuario;")
    boolean isAdmin(@Bind("idUsuario") Long idUsuario);

    // KPIs
    @SqlQuery("select count(*) from usuario;")
    long countAll();
}
