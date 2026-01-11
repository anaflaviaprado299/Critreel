export class Usuario {
    idUsuario: number;
    username: string;
    senha: string;
    dtNasc: string;
    suspensao: boolean;
    nomeCompleto: string;
    bioPerfil: string;
    fotoPerfil: string;
    email: string;
    admin: boolean;

    constructor() {
        this.idUsuario = 0;
        this.username = '';
        this.senha = '';
        this.dtNasc = '';
        this.suspensao = false;
        this.nomeCompleto = '';
        this.bioPerfil = '';
        this.fotoPerfil = '';
        this.email = '';
        this.admin = false;
    }
}
