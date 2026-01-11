package br.cefetmg.critreel.controller;

import br.cefetmg.critreel.model.LoginRequest;
import br.cefetmg.critreel.model.Usuario;
import br.cefetmg.critreel.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/usuario") // http://localhost:8080/api/usuario
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id);
        if (usuario != null) {
            return ResponseEntity.ok().body(usuario);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping({ "", "/" })
    public ResponseEntity<List<Usuario>> getAll() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok().body(usuarios);
    }

    @PostMapping({ "", "/" })
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario) {
        Long idUsuario = usuarioRepository.insert(usuario);
        usuario.setIdUsuario(idUsuario);
        return ResponseEntity.ok().body(usuario);
    }

    @PostMapping("/autenticar")
    public ResponseEntity<Usuario> autenticar(@RequestBody LoginRequest loginRequest) {
        // Usa o novo método do repositório para buscar o usuário
        Usuario usuario = usuarioRepository.findByEmailAndSenha(loginRequest.getEmail(), loginRequest.getSenha());

        if (usuario != null) {
            // Se o usuário foi encontrado, a autenticação foi bem-sucedida.
            return ResponseEntity.ok().body(usuario);
        } else {
            // Se o usuário não foi encontrado, as credenciais estão incorretas.
            return ResponseEntity.status(401).build(); // Retorna 401 Unauthorized
        }
    }

    @PutMapping({ "", "/" })
    public ResponseEntity<Usuario> update(@RequestBody Usuario usuario) {
        if (usuario.getIdUsuario() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário not found");
        }

        int qtd = usuarioRepository.update(usuario);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum Usuario alterado");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi alterado mais de 1 Usuario.");
        }

        return ResponseEntity.ok().body(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Usuario> delete(@PathVariable Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário not found");
        }

        Usuario usuario = usuarioRepository.findById(id);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário nao encontrado");
        }

        int qtd = usuarioRepository.delete(id);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhum Usuário excluido.");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi excluido mais de 1 Usuário.");
        }

        return ResponseEntity.ok().body(usuario);
    }
}