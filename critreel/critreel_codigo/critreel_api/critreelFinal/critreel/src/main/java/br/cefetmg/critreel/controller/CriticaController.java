package br.cefetmg.critreel.controller;

import br.cefetmg.critreel.model.Critica;
import br.cefetmg.critreel.repository.CriticaRepository;
import br.cefetmg.critreel.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/critica") // http://localhost:8080/api/v1/critica
public class CriticaController {

    private final CriticaRepository criticaRepository;
    private final UsuarioRepository usuarioRepository;

    public CriticaController(CriticaRepository criticaRepository, UsuarioRepository usuarioRepository) {
        this.criticaRepository = criticaRepository;
        this.usuarioRepository = usuarioRepository;
    }

     @GetMapping("/{id}")
    public ResponseEntity<Critica> getById(@PathVariable Long id) {
        Critica critica = criticaRepository.findById(id);
        if (critica != null) {
            return ResponseEntity.ok().body(critica);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

     @GetMapping({ "", "/" })
    public ResponseEntity<List<Critica>> getAll() {
        List<Critica> criticas = criticaRepository.findAll();
        return ResponseEntity.ok().body(criticas);
    }

     @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Critica>> getByUsuario(@PathVariable Long idUsuario) {
        List<Critica> criticas = criticaRepository.findByUsuario(idUsuario);
        return ResponseEntity.ok().body(criticas);
    }

     @GetMapping("/filme/{idFilme}")
    public ResponseEntity<List<Critica>> getByFilme(@PathVariable Long idFilme) {
        List<Critica> criticas = criticaRepository.findByFilme(idFilme);
        return ResponseEntity.ok().body(criticas);
    }

     @PostMapping({ "", "/" })
    public ResponseEntity<Critica> create(@RequestBody Critica critica) {
        System.out.println("Criando crítica: " + critica);
        Long id = criticaRepository.insert(critica);
        critica.setIdCritica(id);
        return ResponseEntity.ok().body(critica);
    }

    @PutMapping({ "", "/" })
    public ResponseEntity<Critica> update(@RequestBody Critica critica) {
        
        if (critica.getIdCritica() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica não encontrada");
        }

        // Se fotoCritica vier vazia, preservar a foto existente
        if (critica.getFotoCritica() == null || critica.getFotoCritica().trim().isEmpty()) {
            Critica criticaExistente = criticaRepository.findById(critica.getIdCritica());
            if (criticaExistente != null && criticaExistente.getFotoCritica() != null) {
                critica.setFotoCritica(criticaExistente.getFotoCritica());
                System.out.println("Preservando foto existente: " + criticaExistente.getFotoCritica());
            }
        }

        int qtd = criticaRepository.update(critica);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma crítica alterada");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi alterada mais de 1 crítica.");
        }

        return ResponseEntity.ok().body(critica);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Critica> delete(@PathVariable Long id,
                                          @RequestParam(name = "requesterId", required = false) Long requesterId) {
        if (requesterId == null || !usuarioRepository.isAdmin(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operação permitida apenas para administradores");
        }
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Id da crítica não encontrado");
        }

        Critica critica = criticaRepository.findById(id);
        if (critica == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Crítica não encontrada");
        }

        int qtd = criticaRepository.delete(id);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma crítica excluída.");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi excluída mais de 1 crítica.");
        }

        return ResponseEntity.ok().body(critica);
    }
}
