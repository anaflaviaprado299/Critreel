package br.cefetmg.critreel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.critreel.model.AvaliacaoFilme;
import br.cefetmg.critreel.repository.AvaliacaoFilmeRepository;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/avaliacaofilme") // http://localhost:8080/api/v1/avaliacaofilme
public class AvaliacaoFilmeController {

	private final AvaliacaoFilmeRepository avaliacaoFilmeRepository;

	public AvaliacaoFilmeController(AvaliacaoFilmeRepository avaliacaoFilmeRepository) {
		this.avaliacaoFilmeRepository = avaliacaoFilmeRepository;
	}

	// Criar ou atualizar avaliação (upsert simples)
	@PostMapping({"", "/"})
	public ResponseEntity<AvaliacaoFilme> avaliar(@RequestBody AvaliacaoFilme avaliacao) {
		if (avaliacao.getIdUsuario() == null || avaliacao.getIdFilme() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idUsuario e idFilme são obrigatórios");
		}

		boolean existe = avaliacaoFilmeRepository.verificarAvaliacao(avaliacao.getIdUsuario(), avaliacao.getIdFilme());
		int qtd;
		if (existe) {
			qtd = avaliacaoFilmeRepository.update(avaliacao);
			if (qtd == 0) {
				throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Falha ao atualizar avaliação");
			}
		} else {
			qtd = avaliacaoFilmeRepository.insert(avaliacao);
			if (qtd == 0) {
				throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Falha ao inserir avaliação");
			}
		}
		return ResponseEntity.ok(avaliacao);
	}

	// Verificar se existe avaliação
	@GetMapping("/verificar/{idUsuario}/{idFilme}")
	public ResponseEntity<Boolean> verificar(@PathVariable Long idUsuario, @PathVariable Long idFilme) {
		boolean existe = avaliacaoFilmeRepository.verificarAvaliacao(idUsuario, idFilme);
		return ResponseEntity.ok(existe);
	}

	// Obter avaliação específica
	@GetMapping("/{idUsuario}/{idFilme}")
	public ResponseEntity<AvaliacaoFilme> obter(@PathVariable Long idUsuario, @PathVariable Long idFilme) {
		AvaliacaoFilme av = avaliacaoFilmeRepository.findByUsuarioAndFilme(idUsuario, idFilme);
		if (av == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.ok(av);
	}

	// Listar avaliações de um filme
	@GetMapping("/filme/{idFilme}")
	public ResponseEntity<List<AvaliacaoFilme>> listarPorFilme(@PathVariable Long idFilme) {
		List<AvaliacaoFilme> lista = avaliacaoFilmeRepository.findByFilme(idFilme);
		return ResponseEntity.ok(lista);
	}

	// Listar avaliações feitas por um usuário
	@GetMapping("/usuario/{idUsuario}")
	public ResponseEntity<List<AvaliacaoFilme>> listarPorUsuario(@PathVariable Long idUsuario) {
		List<AvaliacaoFilme> lista = avaliacaoFilmeRepository.findByUsuario(idUsuario);
		return ResponseEntity.ok(lista);
	}

	// Remover avaliação
	@DeleteMapping("/{idUsuario}/{idFilme}")
	public ResponseEntity<Void> remover(@PathVariable Long idUsuario, @PathVariable Long idFilme) {
		int qtd = avaliacaoFilmeRepository.deleteByUsuarioAndFilme(idUsuario, idFilme);
		if (qtd == 0) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada");
		}
		return ResponseEntity.ok().build();
	}
}
