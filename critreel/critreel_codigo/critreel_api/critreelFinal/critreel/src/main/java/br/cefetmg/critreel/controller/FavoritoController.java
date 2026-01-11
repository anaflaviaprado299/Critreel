package br.cefetmg.critreel.controller;

import br.cefetmg.critreel.model.Favorito;
import br.cefetmg.critreel.model.Filme;
import br.cefetmg.critreel.repository.FavoritoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/favoritos") // http://localhost:8080/api/v1/favoritos
public class FavoritoController {

    private final FavoritoRepository favoritoRepository;

    public FavoritoController(FavoritoRepository favoritoRepository) {
        this.favoritoRepository = favoritoRepository;
    }

    // Adicionar filme aos favoritos
    @PostMapping({ "", "/" })
    public ResponseEntity<Favorito> adicionarFavorito(@RequestBody Favorito favorito) {
        System.out.println("Adicionando favorito: " + favorito);

        // Verificar se já existe o favorito
        boolean jaExiste = favoritoRepository.verificarFavorito(favorito.getIdUsuario(), favorito.getIdFilme());
        if (jaExiste) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Filme já está nos favoritos");
        }

        int resultado = favoritoRepository.insert(favorito); // ← Mudança aqui
        if (resultado == 0) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao inserir favorito");
        }

        return ResponseEntity.ok().body(favorito);
    }

    // Remover filme dos favoritos
    @DeleteMapping("/{idUsuario}/{idFilme}")
    public ResponseEntity<Favorito> removerFavorito(@PathVariable Long idUsuario, @PathVariable Long idFilme) {
        if (idUsuario == null || idFilme == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IDs do usuário e filme são obrigatórios");
        }

        int qtd = favoritoRepository.deleteByUsuarioAndFilme(idUsuario, idFilme);
        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum favorito removido");
        }

        return ResponseEntity.ok().build();
    }

    // Buscar todos os filmes favoritos de um usuário
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Filme>> buscarFavoritosPorUsuario(@PathVariable Long idUsuario) {
        List<Filme> filmesFavoritos = favoritoRepository.findFilmesByUsuario(idUsuario);
        return ResponseEntity.ok().body(filmesFavoritos);
    }
}
