import { Construto, SimboloInterface } from '@designliquido/delegua';

/**
 * Este construto apenas diz ao Avaliador Sintático que, ao final
 * da leitura de todos os símbolos, é preciso substituir este construto
 * por outro. Em Mapler, os módulos (funções) são declarados ao final
 * do código, e suas respectivas chamadas no ecossistema de Delégua
 * pedem o corpo da função (um objeto do tipo `FuncaoConstruto`).
 */
export class ReferenciaFutura implements Construto {
    linha: number;
    hashArquivo: number;
    identificadorFuturo: string;

    constructor(simboloRelacionado: SimboloInterface) {
        this.linha = simboloRelacionado.linha;
        this.hashArquivo = simboloRelacionado.hashArquivo;
        this.identificadorFuturo = simboloRelacionado.lexema;
    }

    async aceitar(visitante: any): Promise<never> {
        return Promise.reject(
            'A visita a uma referência futura nunca deve acontecer. Este construto precisa ser substituído na etapa de resolução.'
        );
    }

    paraTexto(): string {
        return `<referência-futura />`;
    }

    paraTextoSaida(): string {
        throw new Error('Método não implementado.');
    }
}
