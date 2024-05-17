import { AcessoIndiceVariavel, Binario, Construto, Logico, Variavel } from '@designliquido/delegua/construtos';
import { EscrevaMesmaLinha, Escreva, Fazer, Leia } from '@designliquido/delegua/declaracoes';
import { ContinuarQuebra, Quebra } from '@designliquido/delegua/quebras';
import { InterpretadorComDepuracao } from '@designliquido/delegua/interpretador';

import * as comum from './comum';

/**
 * Interpretador com depuração para o dialeto Mapler.
 */
export class InterpretadorMaplerComDepuracao extends InterpretadorComDepuracao {
    mensagemPrompt: string;

    constructor(diretorioBase: string, funcaoDeRetorno: Function = null, funcaoDeRetornoMesmaLinha: Function = null) {
        super(diretorioBase, funcaoDeRetorno, funcaoDeRetornoMesmaLinha);
        this.mensagemPrompt = '> ';
    }

    /**
     * No Mapler, o bloco executa se a condição for falsa.
     * Por isso a reimplementação aqui.
     * @param declaracao A declaração `Fazer`
     * @returns Só retorna em caso de erro na execução, e neste caso, o erro.
     */
    async visitarDeclaracaoFazer(declaracao: Fazer): Promise<any> {
        let retornoExecucao: any;
        do {
            try {
                retornoExecucao = await this.executar(declaracao.caminhoFazer);
                if (retornoExecucao instanceof ContinuarQuebra) {
                    retornoExecucao = null;
                }
            } catch (erro: any) {
                return Promise.reject(erro);
            }
        } while (
            !(retornoExecucao instanceof Quebra) &&
            !this.eVerdadeiro(await this.avaliar(declaracao.condicaoEnquanto))
        );
    }

    async visitarDeclaracaoEscreva(declaracao: Escreva): Promise<any> {
        return await comum.visitarDeclaracaoEscreva(this, declaracao);
    }

    async visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha): Promise<any> {
        return await comum.visitarDeclaracaoEscrevaMesmaLinha(this, declaracao);
    }

    async atribuirVariavel(expressao: Construto, valor: any): Promise<any> {
        if (expressao instanceof Variavel) {
            this.pilhaEscoposExecucao.atribuirVariavel(expressao.simbolo, valor);
            return;
        }

        if (expressao instanceof AcessoIndiceVariavel) {
            const promises = await Promise.all([
                this.avaliar(expressao.entidadeChamada),
                this.avaliar(expressao.indice),
            ]);

            let alvo = promises[0];
            let indice = promises[1];
            if (alvo.hasOwnProperty('valor')) {
                alvo = alvo.valor;
            }

            if (indice.hasOwnProperty('valor')) {
                indice = indice.valor;
            }

            alvo[indice] = valor;
        }
    }

    /**
     * Execução da leitura de valores da entrada configurada no
     * início da aplicação.
     * @param expressao Expressão do tipo Leia
     * @returns Promise com o resultado da leitura.
     */
    async visitarExpressaoLeia(expressao: Leia): Promise<any> {
        for (let argumento of expressao.argumentos) {
            const promessaLeitura: Function = () =>
                new Promise((resolucao) =>
                    this.interfaceEntradaSaida.question(this.mensagemPrompt, (resposta: any) => {
                        this.mensagemPrompt = '> ';
                        resolucao(resposta);
                    })
                );

            const valorLido = await promessaLeitura();
            await this.atribuirVariavel(argumento, valorLido);
        }
    }

    async visitarExpressaoBinaria(expressao: Binario | any): Promise<any> {
        return comum.visitarExpressaoBinaria(this, expressao);
    }

    async visitarExpressaoLogica(expressao: Logico): Promise<any> {
        return comum.visitarExpressaoLogica(this, expressao);
    }
}
