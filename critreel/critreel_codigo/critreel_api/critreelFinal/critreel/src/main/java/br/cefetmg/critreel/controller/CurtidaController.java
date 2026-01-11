package br.cefetmg.critreel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.cefetmg.critreel.model.Curtida;
import br.cefetmg.critreel.model.Usuario;
import br.cefetmg.critreel.repository.CurtidaRepository;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/curtidas") // http://localhost:8080/api/v1/curtidas
public class CurtidaController {

    private final CurtidaRepository curtidaRepository;

    public CurtidaController(CurtidaRepository curtidaRepository) {
        this.curtidaRepository = curtidaRepository;
    }

    // Alternar curtida (curtir ou descurtir)
    @PostMapping({ "", "/" })
    public ResponseEntity<Object> alternarCurtida(@RequestBody Curtida curtida) {
        System.out.println("Alternando curtida: " + curtida);

        // Verificar se já existe a curtida
        boolean jaExiste = curtidaRepository.verificarCurtida(curtida.getIdUsuario(), curtida.getIdCritica());
        
        // Se já existe, descurtir (remover)
        if (jaExiste) {
            int qtd = curtidaRepository.deleteByUsuarioAndCritica(curtida.getIdUsuario(), curtida.getIdCritica());
            if (qtd == 0) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao remover curtida");
            }
            return ResponseEntity.ok().body(false); // Retorna false indicando que descurtiu
        } 
        // Se não existe, curtir (inserir)
        else {
            int resultado = curtidaRepository.insert(curtida);
            if (resultado == 0) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao inserir curtida");
            }
            return ResponseEntity.ok().body(true); // Retorna true indicando que curtiu
        }
    }
    
    // Verificar se crítica está curtida pelo usuário
    // @GetMapping("/verificar/{idUsuario}/{idCritica}")
    // public ResponseEntity<Boolean> verificarCurtida(@PathVariable Long idUsuario, @PathVariable Long idCritica) {
    //     boolean isCurtido = curtidaRepository.verificarCurtida(idUsuario, idCritica);
    //     return ResponseEntity.ok().body(isCurtido);
    // }

    // Buscar críticas curtidas por usuário
    // @GetMapping("/usuario/{idUsuario}")
    // public ResponseEntity<List<Critica>> buscarCriticasCurtidasPorUsuario(@PathVariable Long idUsuario) {
    //     List<Critica> criticasCurtidas = curtidaRepository.findCriticasByUsuario(idUsuario);
    //     return ResponseEntity.ok().body(criticasCurtidas);
    // }

    // Buscar usuários que curtiram uma crítica
    @GetMapping("/critica/{idCritica}")
    public ResponseEntity<List<Usuario>> buscarUsuariosPorCritica(@PathVariable Long idCritica) {
        List<Usuario> usuarios = curtidaRepository.findUsuariosByCritica(idCritica);
        return ResponseEntity.ok().body(usuarios);
    }
}
