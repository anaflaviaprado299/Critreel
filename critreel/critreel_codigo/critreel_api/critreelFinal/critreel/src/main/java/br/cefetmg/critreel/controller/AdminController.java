package br.cefetmg.critreel.controller;

import br.cefetmg.critreel.repository.CriticaRepository;
import br.cefetmg.critreel.repository.FilmeRepository;
import br.cefetmg.critreel.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin // CORS global já cobre, mas deixamos aberto
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final FilmeRepository filmeRepository;
    private final CriticaRepository criticaRepository;

    public AdminController(UsuarioRepository usuarioRepository,
                           FilmeRepository filmeRepository,
                           CriticaRepository criticaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.filmeRepository = filmeRepository;
        this.criticaRepository = criticaRepository;
    }

    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Long>> kpis(@RequestParam(name = "requesterId", required = false) Long requesterId) {
        if (requesterId == null || !usuarioRepository.isAdmin(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Operação permitida apenas para administradores");
        }

        Map<String, Long> body = new HashMap<>();
        body.put("totalUsuarios", usuarioRepository.countAll());
        body.put("totalFilmes", filmeRepository.countAll());
        body.put("totalCriticas", criticaRepository.countAll());
        return ResponseEntity.ok(body);
    }
}
