export class DenunciaFilme {
    idDenunciaFilme: number;
    motivo: string;
    descricao: string;
    dataDenuncia: string;
    status: string;
    idUsuarioDenunciante: number;
    idFilmeDenunciado: number;

    constructor() {
        this.idDenunciaFilme = 0;
        this.motivo = '';
        this.descricao = '';
        this.dataDenuncia = '';
        this.status = '';
        this.idUsuarioDenunciante = 0;
        this.idFilmeDenunciado = 0;
    }
}
