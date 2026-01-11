export class AvaliacaoFilme {
  idUsuario: number;
  idFilme: number;
  nota: number; // intervalo esperado 1..5

  constructor() {
    this.idUsuario = 0;
    this.idFilme = 0;
    this.nota = 0; // 0 indica ausência de avaliação
  }
}
