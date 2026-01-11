import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { firstValueFrom } from 'rxjs';
import { Arquivo } from '../model/arquivo';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {
  private apiUrl: string = 'http://localhost:8080/api/v1/upload';

  constructor(private http: HttpClient,private usuarioService: UsuarioService) {
  }

  public async capturar(): Promise<Arquivo> {
    let arquivo = new Arquivo();
    const camera = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      quality: 50
    });

    arquivo.imagem = 'data:image/jpeg;base64,' + camera.base64String;
    return arquivo;
  }

  async upload(arquivo: Arquivo): Promise<string> {
    const resultado = await firstValueFrom(
      this.http.post<any>(this.apiUrl, JSON.stringify(arquivo), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
    return resultado.urlImagem; // retorna apenas a string
  }
}
