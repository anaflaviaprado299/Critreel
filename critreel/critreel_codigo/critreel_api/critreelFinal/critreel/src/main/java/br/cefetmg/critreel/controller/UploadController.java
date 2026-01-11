package br.cefetmg.critreel.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/v1/upload") // http://localhost:8080/api/v1/upload
public class UploadController {

    // Diretório onde as imagens serão salvas
    private static final String UPLOAD_DIR = "C:\\Users\\Usuario\\OneDrive\\Documentos\\PP\\Desenvolvimento\\Imagens\\";

    // URL base para acesso às imagens - ajuste conforme seu servidor
    private static final String BASE_URL = "http://localhost:8080/imagens/";

    // Objeto para resposta da API
    public static class ArquivoResponse {
        private String urlImagem;

        public ArquivoResponse() {
        }

        public ArquivoResponse(String urlImagem) {
            this.urlImagem = urlImagem;
        }

        public String getUrlImagem() {
            return urlImagem;
        }

        public void setUrlImagem(String urlImagem) {
            this.urlImagem = urlImagem;
        }
    }

    // Objeto para requisição de upload
    public static class ArquivoRequest {
        private String imagem;

        public String getImagem() {
            return imagem;
        }

        public void setImagem(String imagem) {
            this.imagem = imagem;
        }
    }

    @PostMapping
    public ResponseEntity<ArquivoResponse> uploadImagem(@RequestBody ArquivoRequest request) {
        try {
            // Verifica se o diretório existe, se não, cria
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            // Extrai a string base64 (remove o prefixo "data:image/jpeg;base64,")
            String base64Image = request.getImagem();
            if (base64Image.contains(",")) {
                base64Image = base64Image.split(",")[1];
            }
            
            // Decodifica a imagem
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            
            // Gera um nome de arquivo único
            String fileName = "img_" + System.currentTimeMillis() + ".jpg";
            
            // Caminho completo do arquivo
            String filePath = UPLOAD_DIR + fileName;
            
            // Salva o arquivo
            Path path = Paths.get(filePath);
            Files.write(path, imageBytes);
            
            // Retorna a URL da imagem
            String imageUrl = BASE_URL + fileName;
            return ResponseEntity.ok(new ArquivoResponse(imageUrl));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(new ArquivoResponse("Erro ao processar o upload: " + e.getMessage()));
        }
    }
}
