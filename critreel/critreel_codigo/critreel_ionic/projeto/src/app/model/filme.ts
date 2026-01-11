export class Filme {
    idFilme: number;
    titulo: string;
    sinopse: string;
    linkTrailer: string;
    fotosCenas: string; //RETIRADO DA IMPLEMENTAÇÃO
    anoLancamento: string;
    idUsuario: number;
    linkAssistir: string;

    constructor() {
        this.idFilme = 0;
        this.titulo = '';
        this.sinopse = '';
        this.linkTrailer = '';
        this.fotosCenas = ''; //RETIRADO DA IMPLEMENTAÇÃO
        this.anoLancamento = '';
        this.idUsuario = 0;
        this.linkAssistir = '';
    }
}
