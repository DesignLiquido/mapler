import { Escreva, EscrevaMesmaLinha } from '@designliquido/delegua';
import { Binario, Construto } from '@designliquido/delegua/construtos';
import { VisitanteComumInterface, SimboloInterface, VariavelInterface } from '@designliquido/delegua/interfaces';
import { ErroEmTempoDeExecucao } from '@designliquido/delegua/excecoes';
import { inferirTipoVariavel } from '@designliquido/delegua/interpretador/inferenciador';

import { InterpretadorMapler } from './interpretador-mapler';

import tiposDeSimbolos from '../tipos-de-simbolos/lexico-regular';

async function avaliar(visitante: VisitanteComumInterface, expressao: Construto): Promise<any> {
    return await expressao.aceitar(visitante);
}

async function avaliarArgumentosEscrevaMapler(
    interpretador: InterpretadorMapler,
    argumentos: Construto[]
): Promise<string> {
    let formatoTexto: string = '';

    for (const argumento of argumentos) {
        const resultadoAvaliacao = await interpretador.avaliar(argumento);
        let valor = resultadoAvaliacao?.hasOwnProperty('valor') ? resultadoAvaliacao.valor : resultadoAvaliacao;

        formatoTexto += `${interpretador.paraTexto(valor)}`;
    }

    return formatoTexto;
}

function eIgual(esquerda: VariavelInterface | any, direita: VariavelInterface | any): boolean {
    if (esquerda === null && direita === null) return true;
    if (esquerda === null) return false;
    return esquerda === direita;
}

function eVerdadeiro(objeto: any): boolean {
    if (objeto === null) return false;
    if (typeof objeto === 'boolean') return Boolean(objeto);
    if (objeto.hasOwnProperty('valor')) {
        return Boolean(objeto.valor);
    }

    return true;
}

function verificarOperandosNumeros(
    operador: SimboloInterface,
    direita: VariavelInterface | any,
    esquerda: VariavelInterface | any
): void {
    const tipoDireita: string = direita.tipo ? direita.tipo : typeof direita === 'number' ? 'número' : String(NaN);
    const tipoEsquerda: string = esquerda.tipo ? esquerda.tipo : typeof esquerda === 'number' ? 'número' : String(NaN);
    const tiposNumericos = ['inteiro', 'numero', 'número', 'real'];
    if (tiposNumericos.includes(tipoDireita.toLowerCase()) && tiposNumericos.includes(tipoEsquerda.toLowerCase())) return;
    throw new ErroEmTempoDeExecucao(operador, 'Operadores precisam ser números.', operador.linha);
}

/**
 * Método de visita de expressão binária.
 * Reintroduzido pelas particularidades do VisuAlg.
 * @param expressao A expressão binária.
 * @returns O resultado da resolução da expressão.
 */
export async function visitarExpressaoBinaria(
    visitante: VisitanteComumInterface,
    expressao: Binario | any
): Promise<any> {
    try {
        const esquerda: VariavelInterface | any = await avaliar(visitante, expressao.esquerda);
        const direita: VariavelInterface | any = await avaliar(visitante, expressao.direita);

        let valorEsquerdo: any = esquerda?.hasOwnProperty('valor') ? esquerda.valor : esquerda;
        let valorDireito: any = direita?.hasOwnProperty('valor') ? direita.valor : direita;

        // No VisuAlg, uma variável pode resolver para função porque funções não precisam ter parênteses.
        // Esta parte evita o problema.
        if (valorEsquerdo && valorEsquerdo.hasOwnProperty('funcao')) {
            valorEsquerdo = valorEsquerdo.funcao();
        }

        if (valorDireito && valorDireito.hasOwnProperty('funcao')) {
            valorDireito = valorDireito.funcao();
        }

        const tipoEsquerdo: string = esquerda?.hasOwnProperty('tipo') ? esquerda.tipo : inferirTipoVariavel(esquerda);
        const tipoDireito: string = direita?.hasOwnProperty('tipo') ? direita.tipo : inferirTipoVariavel(direita);

        switch (expressao.operador.tipo) {
            case tiposDeSimbolos.MAIOR:
                verificarOperandosNumeros(expressao.operador, esquerda, direita);
                return Number(valorEsquerdo) > Number(valorDireito);

            case tiposDeSimbolos.MAIOR_IGUAL:
                verificarOperandosNumeros(expressao.operador, esquerda, direita);
                return Number(valorEsquerdo) >= Number(valorDireito);

            case tiposDeSimbolos.MENOR:
                verificarOperandosNumeros(expressao.operador, esquerda, direita);
                return Number(valorEsquerdo) < Number(valorDireito);

            case tiposDeSimbolos.MENOR_IGUAL:
                verificarOperandosNumeros(expressao.operador, esquerda, direita);
                return Number(valorEsquerdo) <= Number(valorDireito);

            case tiposDeSimbolos.SUBTRACAO:
                verificarOperandosNumeros(expressao.operador, esquerda, direita);
                return Number(valorEsquerdo) - Number(valorDireito);

            case tiposDeSimbolos.ADICAO:
                if (tipoEsquerdo === 'número' && tipoDireito === 'número') {
                    return Number(valorEsquerdo) + Number(valorDireito);
                } else {
                    return String(valorEsquerdo) + String(valorDireito);
                }

            case tiposDeSimbolos.DIVISAO:
                verificarOperandosNumeros(expressao.operador, esquerda, direita);
                return Number(valorEsquerdo) / Number(valorDireito);

            case tiposDeSimbolos.MULTIPLICACAO:
                if (tipoEsquerdo === 'texto' || tipoDireito === 'texto') {
                    // Sem ambos os valores resolvem como texto, multiplica normal.
                    // Se apenas um resolve como texto, o outro repete o
                    // texto n vezes, sendo n o valor do outro.
                    if (tipoEsquerdo === 'texto' && tipoDireito === 'texto') {
                        return Number(valorEsquerdo) * Number(valorDireito);
                    }

                    if (tipoEsquerdo === 'texto') {
                        return valorEsquerdo.repeat(Number(valorDireito));
                    }

                    return valorDireito.repeat(Number(valorEsquerdo));
                }

                return Number(valorEsquerdo) * Number(valorDireito);

            case tiposDeSimbolos.MODULO:
                verificarOperandosNumeros(expressao.operador, esquerda, direita);
                return Number(valorEsquerdo) % Number(valorDireito);

            case tiposDeSimbolos.DIFERENTE:
                return !eIgual(valorEsquerdo, valorDireito);

            case tiposDeSimbolos.IGUAL:
                return eIgual(valorEsquerdo, valorDireito);
        }
    } catch (erro: any) {
        return Promise.reject(erro);
    }
}

/**
 * Execução de uma escrita na saída padrão, sem quebras de linha.
 * Implementada para alguns dialetos, como Mapler.
 *
 * Como `readline.question` sobrescreve o que foi escrito antes, aqui
 * definimos `this.mensagemPrompt` para uso com `leia`.
 * No Mapler é muito comum usar `escreva()` seguido de `leia()` para
 * gerar um prompt na mesma linha.
 * @param declaracao A declaração.
 * @returns Sempre nulo, por convenção de visita.
 */
export async function visitarDeclaracaoEscrevaMesmaLinha(
    interpretador: InterpretadorMapler,
    declaracao: EscrevaMesmaLinha
): Promise<any> {
    try {
        const formatoTexto: string = await avaliarArgumentosEscrevaMapler(interpretador, declaracao.argumentos);
        this.mensagemPrompt = formatoTexto;
        interpretador.funcaoDeRetornoMesmaLinha(formatoTexto);
        return null;
    } catch (erro: any) {
        interpretador.erros.push(erro);
    }
}

/**
 * Execução de uma escrita na saída configurada, que pode ser `console` (padrão) ou
 * alguma função para escrever numa página Web.
 * @param declaracao A declaração.
 * @returns Sempre nulo, por convenção de visita.
 */
export async function visitarDeclaracaoEscreva(
    interpretador: InterpretadorMapler,
    declaracao: Escreva
): Promise<any> {
    try {
        const formatoTexto: string = await avaliarArgumentosEscrevaMapler(interpretador, declaracao.argumentos);
        interpretador.funcaoDeRetorno(formatoTexto);
        return null;
    } catch (erro: any) {
        interpretador.erros.push(erro);
    }
}
