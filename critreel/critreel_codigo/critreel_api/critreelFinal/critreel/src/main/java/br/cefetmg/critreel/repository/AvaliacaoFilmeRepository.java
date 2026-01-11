package br.cefetmg.critreel.repository;

import java.util.List;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import br.cefetmg.critreel.model.AvaliacaoFilme;

@Repository
@RegisterBeanMapper(AvaliacaoFilme.class)
public interface AvaliacaoFilmeRepository {

	// Verifica se já existe avaliação do usuário para o filme
	@SqlQuery("select count(*) > 0 from avaliacaofilme where idUsuario = :idUsuario and idFilme = :idFilme;")
	boolean verificarAvaliacao(@Bind("idUsuario") Long idUsuario, @Bind("idFilme") Long idFilme);

	// Retorna avaliação específica
	@SqlQuery("select * from avaliacaofilme where idUsuario = :idUsuario and idFilme = :idFilme;")
	AvaliacaoFilme findByUsuarioAndFilme(@Bind("idUsuario") Long idUsuario, @Bind("idFilme") Long idFilme);

	// Lista avaliações de um filme
	@SqlQuery("select * from avaliacaofilme where idFilme = :idFilme;")
	List<AvaliacaoFilme> findByFilme(@Bind("idFilme") Long idFilme);

	// Lista avaliações feitas por um usuário
	@SqlQuery("select * from avaliacaofilme where idUsuario = :idUsuario;")
	List<AvaliacaoFilme> findByUsuario(@Bind("idUsuario") Long idUsuario);

	// Insere nova avaliação
	@SqlUpdate("insert into avaliacaofilme (idFilme, idUsuario, nota) values (:idFilme, :idUsuario, :nota);")
	int insert(@BindBean AvaliacaoFilme avaliacao);

	// Atualiza nota existente
	@SqlUpdate("update avaliacaofilme set nota = :nota where idFilme = :idFilme and idUsuario = :idUsuario;")
	int update(@BindBean AvaliacaoFilme avaliacao);

	// Remove avaliação
	@SqlUpdate("delete from avaliacaofilme where idFilme = :idFilme and idUsuario = :idUsuario;")
	int deleteByUsuarioAndFilme(@Bind("idUsuario") Long idUsuario, @Bind("idFilme") Long idFilme);
}
