import { AcessoIndiceVariavel, Binario, Leia, Variavel } from '@designliquido/delegua/construtos';
import { EscrevaMesmaLinha, Escreva, InicioAlgoritmo } from '@designliquido/delegua/declaracoes';
import { InterpretadorBaseComDepuracao } from '@designliquido/delegua/interpretador/depuracao';
import { ConstrutoInterface } from '@designliquido/delegua/interfaces';

import * as comum from './comum';

/**
 * Interpretador com depuração para o dialeto Mapler.
 */
export class InterpretadorMaplerComDepuracao extends InterpretadorBaseComDepuracao {
    mensagemPrompt: string;

    constructor(diretorioBase: string, funcaoDeRetorno: Function = null, funcaoDeRetornoMesmaLinha: Function = null) {
        super(diretorioBase, funcaoDeRetorno, funcaoDeRetornoMesmaLinha);
        this.mensagemPrompt = '> ';
    }

    override visitarDeclaracaoInicioAlgoritmo(declaracao: InicioAlgoritmo): Promise<any> {
        return Promise.resolve();
    }

    async visitarDeclaracaoEscreva(declaracao: Escreva): Promise<any> {
        return await comum.visitarDeclaracaoEscreva(this, declaracao);
    }

    async visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha): Promise<any> {
        return await comum.visitarDeclaracaoEscrevaMesmaLinha(this, declaracao);
    }

    async atribuirVariavel(expressao: ConstrutoInterface, valor: any): Promise<any> {
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
}
