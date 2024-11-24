import { Declaracao, SimboloInterface } from '@designliquido/delegua';

/**
 * Esta declaração apenas diz ao Avaliador Sintático que, ao final
 * da leitura de todos os símbolos, é preciso substituir esta declaração
 * por outra. Em Mapler, os módulos (funções) são declarados ao final
 * do código, e suas respectivas chamadas no ecossistema de Delégua
 * pedem o corpo da função (um objeto do tipo `FuncaoConstruto`).
 */
export class DeclaracaoFutura extends Declaracao {
    identificadorFuturo: string;

    constructor(simboloRelacionado: SimboloInterface) {
        super(simboloRelacionado.linha, simboloRelacionado.hashArquivo);
        this.identificadorFuturo = simboloRelacionado.lexema;
    }

    async aceitar(visitante: any): Promise<never> {
        return Promise.reject(
            'A visita a uma declaração futura nunca deve acontecer. Esta declaração precisa ser substituída na Avaliação Sintática.'
        );
    }
}
