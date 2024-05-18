import { Binario, Construto, ExpressaoRegular, Logico, Variavel } from '@designliquido/delegua/construtos';
import { Aleatorio, Const, Escreva, EscrevaMesmaLinha, Fazer, Leia } from '@designliquido/delegua/declaracoes';
import { InterpretadorBase } from '@designliquido/delegua/interpretador';
import { ContinuarQuebra, Quebra } from '@designliquido/delegua/quebras';

import * as comum from './comum';

export class InterpretadorMapler extends InterpretadorBase {
    mensagemPrompt: string;

    constructor(
        diretorioBase: string,
        performance = false,
        funcaoDeRetorno: Function = null,
        funcaoDeRetornoMesmaLinha: Function = null
    ) {
        super(diretorioBase, performance, funcaoDeRetorno, funcaoDeRetornoMesmaLinha);
        this.mensagemPrompt = '> ';
    }

    visitarExpressaoExpressaoRegular(expressao: ExpressaoRegular): Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoAleatorio(declaracao: Aleatorio): Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        throw new Error('Método não implementado.');
    }

    async visitarDeclaracaoEscreva(declaracao: Escreva): Promise<any> {
        return await comum.visitarDeclaracaoEscreva(this, declaracao);
    }

    async visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha): Promise<any> {
        return await comum.visitarDeclaracaoEscrevaMesmaLinha(this, declaracao);
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
            this.pilhaEscoposExecucao.atribuirVariavel((<Variavel>argumento).simbolo, valorLido);
        }
    }

    async visitarExpressaoBinaria(expressao: Binario | any): Promise<any> {
        return comum.visitarExpressaoBinaria(this, expressao);
    }
}
