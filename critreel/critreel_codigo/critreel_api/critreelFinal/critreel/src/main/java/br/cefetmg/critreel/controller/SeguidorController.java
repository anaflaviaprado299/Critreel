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

import br.cefetmg.critreel.model.Seguidor;
import br.cefetmg.critreel.model.Usuario;
import br.cefetmg.critreel.repository.SeguidorRepository;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/seguidores") // http://localhost:8080/api/v1/seguidores
public class SeguidorController {

    private final SeguidorRepository seguidorRepository;

    public SeguidorController(SeguidorRepository seguidorRepository) {
        this.seguidorRepository = seguidorRepository;
    }

    // Alternar seguir / deixar de seguir
    @PostMapping({ "", "/" })
    public ResponseEntity<Object> alternarSeguir(@RequestBody Seguidor seguidor) {
        if (seguidor.getIdSeguidor() == null || seguidor.getIdSeguido() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IDs de seguidor e seguido são obrigatórios");
        }

        // Impedir seguir a si mesmo
        if (seguidor.getIdSeguidor().equals(seguidor.getIdSeguido())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Um usuário não pode seguir a si mesmo");
        }

        boolean jaSegue = seguidorRepository.verificarSeguimento(seguidor.getIdSeguidor(), seguidor.getIdSeguido());
        if (jaSegue) {
            int qtd = seguidorRepository.deixarDeSeguir(seguidor.getIdSeguidor(), seguidor.getIdSeguido());
            if (qtd == 0) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao deixar de seguir");
            }
            return ResponseEntity.ok().body(false); // agora não segue mais
        } else {
            int res = seguidorRepository.seguir(seguidor);
            if (res == 0) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao seguir usuário");
            }
            return ResponseEntity.ok().body(true); // agora segue
        }
    }

    // Deixar de seguir explicitamente
    @DeleteMapping("/{idSeguidor}/{idSeguido}")
    public ResponseEntity<Void> deixarDeSeguir(@PathVariable Long idSeguidor, @PathVariable Long idSeguido) {
        if (idSeguidor == null || idSeguido == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IDs de seguidor e seguido são obrigatórios");
        }
        int qtd = seguidorRepository.deixarDeSeguir(idSeguidor, idSeguido);
        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma relação de seguimento removida");
        }
        return ResponseEntity.ok().build();
    }

    // Verificar se segue
    @GetMapping("/verificar/{idSeguidor}/{idSeguido}")
    public ResponseEntity<Boolean> verificar(@PathVariable Long idSeguidor, @PathVariable Long idSeguido) {
        boolean segue = seguidorRepository.verificarSeguimento(idSeguidor, idSeguido);
        return ResponseEntity.ok().body(segue);
    }

    // Listar seguidores (quem segue este usuário)
    @GetMapping("/{idUsuario}/seguidores")
    public ResponseEntity<List<Usuario>> listarSeguidores(@PathVariable Long idUsuario) {
        List<Usuario> usuarios = seguidorRepository.listarSeguidores(idUsuario);
        return ResponseEntity.ok().body(usuarios);
    }

    // Listar seguindo (quem este usuário segue)
    @GetMapping("/{idUsuario}/seguindo")
    public ResponseEntity<List<Usuario>> listarSeguindo(@PathVariable Long idUsuario) {
        List<Usuario> usuarios = seguidorRepository.listarSeguindo(idUsuario);
        return ResponseEntity.ok().body(usuarios);
    }

    // Contar seguidores
    @GetMapping("/{idUsuario}/contar/seguidores")
    public ResponseEntity<Integer> contarSeguidores(@PathVariable Long idUsuario) {
        int qtd = seguidorRepository.contarSeguidores(idUsuario);
        return ResponseEntity.ok().body(qtd);
    }

    // Contar seguindo
    @GetMapping("/{idUsuario}/contar/seguindo")
    public ResponseEntity<Integer> contarSeguindo(@PathVariable Long idUsuario) {
        int qtd = seguidorRepository.contarSeguindo(idUsuario);
        return ResponseEntity.ok().body(qtd);
    }
}
