export class login{
    email: string = "";
    password: string = "";
}

export class createPropriedade{
    nome: string = "";
    numero: string = "";
    logradouro: string = "";
    bairro: string = "";
    cidade: string = "";
    estado: string = "";
    complemento: string = "";
    cep: string = "";
    proprietario: string = "";
}

export class updatePropriedade{
    nome?: string = "";
    numero?: string = "";
    logradouro?: string = "";
    bairro?: string = "";
    cidade?: string = "";
    estado?: string = "";
    complemento?: string = "";
    cep?: string = "";
    proprietario?: string = "";
}

export class createTipoItem{
    descricao: string = "";
    linha: string = "";
    excluido: boolean = false;
    grupo_id: string = "";
}

export class createTipoItemAtributo{
    descricao: string = "";
    selecionavel: string = "";
    unidade: string = "";
    sigla: string = "";
    excluido: boolean = false;
    tipo_item_id: string = "";
}

export class createTipoItemValor {
    valor: number | null = null;
    excluido: boolean = false;
    tipo_item_atributo_id: string = "";
}

export class createProprietario{
    tipo_pessoa: string = "";
    nome: string = "";
    cpf_cnpj: string = "";
    email: string = "";
    celular: string = "";
}

export class updateProprietario{
    tipo_pessoa?: string = "";
    nome?: string = "";
    cpf_cnpj?: string = "";
    email?: string = "";
    celular?: string = "";
}

export class createUser{
    name: string = "";
    telefone: string = "";
    email: string = "";
    password: string = "";
    cpf: string = "";
}

export class updateUser{
    name?: string = "";
    telefone?: string = "";
    email?: string = "";
    password?: string = "";
    cpf?: string = "";
}

export class createGrupo{
    descricao: string = "";
    excluido: boolean = false;
    grupo_id?: string = "";
}

export class createEdificio{
    nome: string = ""
    descricao: string = ""
    largura!: number
    comprimento!: number
    pavimento!: number
    subsolo!: number
    propriedade_id: string = ""
}

export class createComparitmento{
    descricao: string = "";
    largura!: number;
    comprimento!: number;
    andar_compartimento!: number;
    edificio?: string = "";
}

export class updateComparitmento{
    descricao?: string = "";
    largura?: number;
    comprimento?: number;
    andar_compartimento?: number;
    edificio?: string = "";
}

export class createQuadro{
    quadro_descricao?: string = "";
    tipo_qgbt?: string = "";
    tamanho_qgbt?: string = "";
    quantidade_circuito?: number;
    monofasico?: number;
    bifasico?: number;
    trifasico?: number;
    disjuntor_principal?: string = "";
    polos?: string = "";
    possui_dps?: string = "";
    quantidade_dps?: string = "";
    tipo_dps?: string = "";
    compartimento_id?: string = "";
    dps_tipo_id?: string = ""
}

export class createDPS{
    classe: string = "";
    corrente: string = "";
    tensao: string = "";
    quadro_id: string = "";
}

export class item{
    descricao: string = "";
    quantidade!: number | null;
    compartimento_id: string = "";
    tipoItem_id: string = "";
}

export class itemValue{
    valor?: string = "";
}
  