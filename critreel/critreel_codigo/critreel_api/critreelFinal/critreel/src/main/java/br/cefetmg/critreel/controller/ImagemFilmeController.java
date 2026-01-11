package br.cefetmg.critreel.controller;

import br.cefetmg.critreel.model.ImagemFilme;
import br.cefetmg.critreel.repository.ImagemFilmeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/imagem-filme") // http://localhost:8080/api/v1/imagem-filme
public class ImagemFilmeController {

    private final ImagemFilmeRepository imagemFilmeRepository;

    public ImagemFilmeController(ImagemFilmeRepository imagemFilmeRepository) {
        this.imagemFilmeRepository = imagemFilmeRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImagemFilme> getById(@PathVariable Long id) {
        ImagemFilme imagem = imagemFilmeRepository.findById(id);
        if (imagem != null) {
            return ResponseEntity.ok().body(imagem);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping({ "", "/" })
    public ResponseEntity<List<ImagemFilme>> getAll() {
        List<ImagemFilme> imagens = imagemFilmeRepository.findAll();
        return ResponseEntity.ok().body(imagens);
    }

    @GetMapping("/filme/{idFilme}")
    public ResponseEntity<List<ImagemFilme>> getByFilme(@PathVariable Long idFilme) {
        List<ImagemFilme> imagens = imagemFilmeRepository.findByFilme(idFilme);
        return ResponseEntity.ok().body(imagens);
    }

    @PostMapping({ "", "/" })
    public ResponseEntity<ImagemFilme> create(@RequestBody ImagemFilme imagem) {
        Long id = imagemFilmeRepository.insert(imagem);
        imagem.setIdImagemFilme(id);
        return ResponseEntity.ok().body(imagem);
    }

    @PutMapping({ "", "/" })
    public ResponseEntity<ImagemFilme> update(@RequestBody ImagemFilme imagem) {
        if (imagem.getIdImagemFilme() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem de filme não encontrada");
        }

        int qtd = imagemFilmeRepository.update(imagem);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma imagem alterada");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi alterada mais de uma imagem.");
        }

        return ResponseEntity.ok().body(imagem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ImagemFilme> delete(@PathVariable Long id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Id da imagem não encontrado");
        }

        ImagemFilme imagem = imagemFilmeRepository.findById(id);
        if (imagem == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem não encontrada");
        }

        int qtd = imagemFilmeRepository.delete(id);

        if (qtd == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma imagem excluída.");
        }
        if (qtd > 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Foi excluída mais de uma imagem.");
        }

        return ResponseEntity.ok().body(imagem);
    }
}
