export class DenunciaCritica {
    idDenunciaCritica: number;
    motivo: string;
    descricao: string;
    dataDenuncia: string;
    status: string;
    idUsuarioDenunciante: number;
    idCriticaDenunciada: number;

    constructor() {
        this.idDenunciaCritica = 0;
        this.motivo = '';
        this.descricao = '';
        this.dataDenuncia = '';
        this.status = '';
        this.idUsuarioDenunciante = 0;
        this.idCriticaDenunciada = 0;
    }
}
