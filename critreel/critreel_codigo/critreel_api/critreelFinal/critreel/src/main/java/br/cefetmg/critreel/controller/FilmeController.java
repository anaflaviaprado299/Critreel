package br.cefetmg.critreel.controller;

import br.cefetmg.critreel.model.Filme;
import br.cefetmg.critreel.repository.FilmeRepository;
import br.cefetmg.critreel.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/filme") // http://localhost:8080/api/v1/filme
public class FilmeController {

    private final FilmeRepository filmeRepository;
    private final UsuarioRepository usuarioRepository;

    public FilmeController(FilmeRepository filmeRepository, UsuarioRepository usuarioRepository) {
        this.filmeRepository = filmeRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filme> getById(@PathVariable Long id) {
        Filme filme = filmeRepository.findById(id);
        if (filme != null) {
            return ResponseEntity.ok().body(filme);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping({ "", "/" })
    public ResponseEntity<List<Filme>> getAll() {
        List<Filme> filmes = filmeRepository.findAll();
        return ResponseEntity.ok().body(filmes);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Filme>> getByUsuario(@PathVariable Long idUsuario) {
        List<Filme> filmes = filmeRepository.findByUsuario(idUsuario);
        return ResponseEntity.ok().body(filmes);
    }

    @PostMapping({ "", "/" })
    public ResponseEntity<Filme> create(@RequestBody Filme filme) {
        System.out.println("funcionando ou não:"+ filme);
        Long id = filmeRepository.insert(filme);
        filme.setIdFilme(id);
        return ResponseEntity.ok().body(filme);
    }

    @PutMapping({ "", "/" })
    public ResponseEntity<Filme> update(@RequestBody Filme filme) {
        if (filme.getIdFilme() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Filme not found");
        }

        int qtd = filmeRepository.update(filme);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum Filme alterado");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi alterado mais de 1 Filme.");
        }

        return ResponseEntity.ok().body(filme);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Filme> delete(@PathVariable Long id,
                                        @RequestParam(name = "requesterId", required = false) Long requesterId) {
        if (requesterId == null || !usuarioRepository.isAdmin(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operação permitida apenas para administradores");
        }
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Id do Filme nao encontrado");
        }

        Filme filme = filmeRepository.findById(id);
        if (filme == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Filme nao encontrado");
        }

        int qtd = filmeRepository.delete(id);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum Filme excluido.");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi excluido mais de 1 Filme.");
        }

        return ResponseEntity.ok().body(filme);
    }
}
