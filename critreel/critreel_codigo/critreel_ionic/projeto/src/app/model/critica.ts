export class Critica {
    idCritica: number;
    tituloFilme: string;
    texto: string;
    idUsuario: number;
    idFilme: number | null;
    dataCriacao: string;
    fotoCritica: string;

    constructor() {
        this.idCritica = 0;
        this.tituloFilme = '';
        this.texto = '';
        this.idUsuario = 0;
        this.idFilme = 0;
        this.dataCriacao = '';
        this.fotoCritica = '';
    }
}
