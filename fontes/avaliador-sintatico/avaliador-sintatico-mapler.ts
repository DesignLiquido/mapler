import { RetornoLexador, RetornoAvaliadorSintatico } from '@designliquido/delegua/interfaces/retornos';
import { AvaliadorSintaticoBase } from '@designliquido/delegua/avaliador-sintatico/avaliador-sintatico-base';
import {
    Bloco,
    Declaracao,
    Enquanto,
    Escolha,
    Escreva,
    EscrevaMesmaLinha,
    Expressao,
    Fazer,
    FuncaoDeclaracao,
    InicioAlgoritmo,
    Leia,
    Para,
    Se,
    Sustar,
    Var,
} from '@designliquido/delegua/declaracoes';
import {
    AcessoIndiceVariavel,
    Agrupamento,
    AtribuicaoPorIndice,
    Atribuir,
    Binario,
    Comentario,
    Construto,
    FimPara,
    FormatacaoEscrita,
    FuncaoConstruto,
    Literal,
    Logico,
    Unario,
    Variavel,
} from '@designliquido/delegua/construtos';
import { SimboloInterface } from '@designliquido/delegua/interfaces';

import { DeclaracaoFutura } from '../declaracoes/declaracao-futura';

import tiposDeSimbolos from '../tipos-de-simbolos/lexico-regular';
import { Simbolo } from '@designliquido/delegua';

export class AvaliadorSintaticoMapler extends AvaliadorSintaticoBase {
    lendoModulos: boolean;
    modulos: string[];

    constructor() {
        super();
        this.lendoModulos = false;
        this.modulos = [];
    }

    private criarVetorNDimensional(dimensoes: number[]) {
        if (dimensoes.length > 0) {
            const dimensao = dimensoes[0] + 1;
            const resto = dimensoes.slice(1);
            const novoArray = Array(dimensao);
            for (let i = 0; i <= dimensao; i++) {
                novoArray[i] = this.criarVetorNDimensional(resto);
            }
            return novoArray;
        } else {
            return undefined;
        }
    }

    private validarDimensoesVetor(): number[] {
        let dimensoes = [];
        do {
            const numeroInicial = this.consumir(
                tiposDeSimbolos.NUMERO,
                'Esperado índice inicial para inicialização de dimensão de vetor.'
            );
            this.consumir(
                tiposDeSimbolos.PONTO,
                'Esperado primeiro ponto após índice inicial para inicialização de dimensão de vetor.'
            );
            this.consumir(
                tiposDeSimbolos.PONTO,
                'Esperado segundo ponto após índice inicial para inicialização de dimensão de vetor.'
            );
            const numeroFinal = this.consumir(
                tiposDeSimbolos.NUMERO,
                'Esperado índice final para inicialização de dimensão de vetor.'
            );
            dimensoes.push(Number(numeroFinal.literal) - Number(numeroInicial.literal));
        } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

        return dimensoes;
    }

    private logicaComumParametroMapler(): {
        identificadores: SimboloInterface[];
        tipo: string;
        simbolo: SimboloInterface;
    } {
        const identificadores = [];
        do {
            identificadores.push(this.consumir(tiposDeSimbolos.IDENTIFICADOR, 'Esperado nome de variável.'));
        } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

        this.consumir(tiposDeSimbolos.DOIS_PONTOS, 'Esperado dois-pontos após nome de variável.');

        if (
            !this.verificarSeSimboloAtualEIgualA(
                tiposDeSimbolos.CADEIA,
                tiposDeSimbolos.CARACTERE,
                tiposDeSimbolos.INTEIRO,
                tiposDeSimbolos.LOGICO,
                tiposDeSimbolos.MODULO,
                tiposDeSimbolos.REAL,
                tiposDeSimbolos.VETOR
            )
        ) {
            throw this.erro(this.simbolos[this.atual], 'Tipo de variável não conhecido.');
        }

        const simboloAnterior = this.simbolos[this.atual - 1];
        const tipoVariavel: string = simboloAnterior.tipo;

        return {
            identificadores,
            tipo: tipoVariavel,
            simbolo: simboloAnterior,
        };
    }

    /**
     * Validação do segmento de declaração de variáveis (opcional).
     * @returns Vetor de Construtos para inicialização de variáveis.
     */
    private validarSegmentoVariaveis(): Construto[] | Declaracao[] {
        const inicializacoes = [];

        while (!this.verificarTipoSimboloAtual(tiposDeSimbolos.INICIO)) {
            if (this.simbolos[this.atual].tipo === tiposDeSimbolos.COMENTARIO) {
                inicializacoes.push(this.declaracaoComentario());
                continue;
            }

            const dadosVariaveis = this.logicaComumParametroMapler();
            // Se chegou até aqui, variáveis são válidas.
            // Devem ser declaradas com um valor inicial padrão.
            for (let identificador of dadosVariaveis.identificadores) {
                switch (dadosVariaveis.tipo) {
                    case tiposDeSimbolos.CADEIA:
                    case tiposDeSimbolos.CARACTERE:
                        inicializacoes.push(
                            new Var(
                                identificador,
                                new Literal(this.hashArquivo, Number(dadosVariaveis.simbolo.linha), ''),
                                'texto'
                            )
                        );
                        break;
                    case tiposDeSimbolos.INTEIRO:
                        inicializacoes.push(
                            new Var(
                                identificador,
                                new Literal(this.hashArquivo, Number(dadosVariaveis.simbolo.linha), 0),
                                'inteiro'
                            )
                        );
                        break;
                    case tiposDeSimbolos.REAL:
                        inicializacoes.push(
                            new Var(
                                identificador,
                                new Literal(this.hashArquivo, Number(dadosVariaveis.simbolo.linha), 0),
                                'real'
                            )
                        );
                        break;
                    case tiposDeSimbolos.LOGICO:
                        inicializacoes.push(
                            new Var(
                                identificador,
                                new Literal(this.hashArquivo, Number(dadosVariaveis.simbolo.linha), false),
                                'lógico'
                            )
                        );
                        break;
                    case tiposDeSimbolos.MODULO:
                        // Para efeitos práticos, declarar um módulo (função) como uma
                        // variável apenas serve para dizer ao interpretador que as
                        // declarações das funções propriamente ditas irão ao
                        // final do código.
                        this.modulos.push(identificador.lexema);
                        break;
                    case tiposDeSimbolos.VETOR:
                        // TODO: Validar vetor
                        this.consumir(
                            tiposDeSimbolos.COLCHETE_ESQUERDO,
                            'Esperado colchete esquerdo após palavra reservada "vetor".'
                        );
                        const dimensoes = this.validarDimensoesVetor();
                        this.consumir(
                            tiposDeSimbolos.COLCHETE_DIREITO,
                            'Esperado colchete direito após declaração de dimensões de vetor.'
                        );
                        this.consumir(
                            tiposDeSimbolos.DE,
                            'Esperado palavra reservada "de" após declaração de dimensões de vetor.'
                        );
                        if (
                            !this.verificarSeSimboloAtualEIgualA(
                                tiposDeSimbolos.CARACTERE,
                                tiposDeSimbolos.INTEIRO,
                                tiposDeSimbolos.LOGICO,
                                tiposDeSimbolos.REAL,
                                tiposDeSimbolos.VETOR
                            )
                        ) {
                            throw this.erro(
                                this.simbolos[this.atual],
                                'Tipo de variável não conhecido para inicialização de vetor.'
                            );
                        }
                        inicializacoes.push(
                            new Var(
                                identificador,
                                new Literal(
                                    this.hashArquivo,
                                    Number(dadosVariaveis.simbolo.linha),
                                    this.criarVetorNDimensional(dimensoes)
                                ),
                                'vetor'
                            )
                        );
                        break;
                }
            }

            this.consumir(tiposDeSimbolos.PONTO_VIRGULA, "Esperado ';' após declaração de variável.");
        }

        return inicializacoes;
    }

    estaNoFinal(): boolean {
        return this.atual === this.simbolos.length;
    }

    primario(): Construto {
        const simboloAtual = this.simbolos[this.atual];

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.FALSO))
            return new Literal(this.hashArquivo, Number(simboloAtual.linha), false);
        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VERDADEIRO))
            return new Literal(this.hashArquivo, Number(simboloAtual.linha), true);

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.IDENTIFICADOR)) {
            const simboloIdentificador = this.simbolos[this.atual - 1];
            if (this.modulos.includes(simboloIdentificador.lexema)) {
                // TODO: Chamar função
                return new DeclaracaoFutura(simboloIdentificador);
                // return new Expressao(new Chamada(simboloAtual.hashArquivo, funcaoDeclaracao.funcao, null, []))
            }

            return new Variavel(this.hashArquivo, simboloIdentificador);
        }

        if (
            this.verificarSeSimboloAtualEIgualA(
                tiposDeSimbolos.NUMERO,
                tiposDeSimbolos.CADEIA,
                tiposDeSimbolos.CARACTERE
            )
        ) {
            const simboloAnterior: SimboloInterface = this.simbolos[this.atual - 1];
            return new Literal(this.hashArquivo, Number(simboloAnterior.linha), simboloAnterior.literal);
        }

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PARENTESE_ESQUERDO)) {
            const expressao = this.expressao();
            this.consumir(tiposDeSimbolos.PARENTESE_DIREITO, "Esperado ')' após a expressão.");

            return new Agrupamento(this.hashArquivo, Number(simboloAtual.linha), expressao);
        }

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PONTO_VIRGULA)) {
            return null;
        }

        throw this.erro(this.simbolos[this.atual], 'Esperado expressão.');
    }

    comparacaoIgualdade(): Construto {
        let expressao = this.comparar();

        while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.DIFERENTE, tiposDeSimbolos.IGUAL)) {
            const simboloAnterior = this.simbolos[this.atual - 1];
            const direito = this.comparar();
            expressao = new Binario(this.hashArquivo, expressao, simboloAnterior, direito);
        }

        return expressao;
    }

    ou(): Construto {
        let expressao = this.e();

        while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.OU)) {
            const operador = this.simbolos[this.atual - 1];
            const direito = this.e();
            expressao = new Logico(this.hashArquivo, expressao, operador, direito);
        }

        return expressao;
    }

    /**
     * Método que resolve atribuições.
     * @returns Um construto do tipo `Atribuir`, `Conjunto` ou `AtribuicaoPorIndice`.
     */
    atribuir(): Construto {
        const expressao = this.ou();

        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.SETA_ATRIBUICAO)) {
            const setaAtribuicao = this.simbolos[this.atual - 1];
            const valor = this.atribuir();

            if (expressao instanceof Variavel) {
                return new Atribuir(this.hashArquivo, expressao, valor);
            } 
            
            if (expressao instanceof AcessoIndiceVariavel) {
                return new AtribuicaoPorIndice(
                    this.hashArquivo,
                    expressao.linha,
                    expressao.entidadeChamada,
                    expressao.indice,
                    valor
                );
            }

            this.erro(setaAtribuicao, 'Tarefa de atribuição inválida');
        }

        return expressao;
    }

    expressao(): Construto {
        if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.LER)) return this.declaracaoLeia();
        return this.atribuir();
    }

    blocoEscopo(): any[] {
        const declaracoes = [];

        while (this.simbolos[this.atual].tipo !== tiposDeSimbolos.FIM) {
            declaracoes.push(this.resolverDeclaracaoForaDeBloco());
        }

        return declaracoes.filter((d) => d);
    }

    chamar(): Construto {
        let expressao = this.primario();

        while (true) {
            if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PARENTESE_ESQUERDO)) {
                expressao = this.finalizarChamada(expressao);
            } else if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.COLCHETE_ESQUERDO)) {
                const indices = [];
                do {
                    indices.push(this.expressao());
                } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

                const indice = indices[0];
                const simboloFechamento = this.consumir(
                    tiposDeSimbolos.COLCHETE_DIREITO,
                    "Esperado ']' após escrita do indice."
                );
                expressao = new AcessoIndiceVariavel(this.hashArquivo, expressao, indice, simboloFechamento);
            } else {
                break;
            }
        }

        return expressao;
    }

    corpoDaFuncao(tipo: string): FuncaoConstruto {
        const simboloAnterior = this.simbolos[this.atual - 1];

        // TODO: Verificar como Mapler lida com varíaveis em módulos.
        // this.validarSegmentoVariaveis();

        const corpo = this.blocoEscopo();

        this.consumir(tiposDeSimbolos.FIM, `Isso nunca dá erro.`);
        this.consumir(
            tipo,
            `Esperado palavra reservada "${tipo.toLowerCase()}" após palavra reservada "fim" para finalização da declaração.`
        );
        this.consumir(
            tiposDeSimbolos.PONTO_VIRGULA,
            `Esperado ponto-e-vírgula após palavras reservadas "fim ${tipo.toLowerCase()}."`
        );

        return new FuncaoConstruto(this.hashArquivo, Number(simboloAnterior.linha), [], corpo);
    }

    declaracaoComentario(): Comentario {
        const simboloComentario = this.avancarEDevolverAnterior();
        return new Comentario(simboloComentario.hashArquivo, simboloComentario.linha, simboloComentario.literal, false);
    }

    declaracaoEnquanto(): Enquanto {
        const simboloAtual = this.avancarEDevolverAnterior();

        const condicao = this.expressao();

        this.consumir(
            tiposDeSimbolos.FACA,
            "Esperado paravra reservada 'faca' após condição de continuidade em declaracão 'enquanto'."
        );

        const declaracoes = [];
        do {
            declaracoes.push(this.resolverDeclaracaoForaDeBloco());
        } while (
            ![tiposDeSimbolos.FIM].includes(this.simbolos[this.atual].tipo) &&
            ![tiposDeSimbolos.ENQUANTO].includes(this.simbolos[this.atual + 1].tipo)
        );

        this.consumir(
            tiposDeSimbolos.FIM,
            "Esperado palavra-chave 'fim' para iniciar o fechamento de declaração 'enquanto'."
        );

        this.consumir(
            tiposDeSimbolos.ENQUANTO,
            "Esperado palavra-chave 'enquanto' para o fechamento de declaração 'enquanto'."
        );

        this.consumir(
            tiposDeSimbolos.PONTO_VIRGULA,
            "Esperado palavra-chave ';' para o fechamento de declaração 'enquanto'."
        );

        return new Enquanto(
            condicao,
            new Bloco(
                simboloAtual.hashArquivo,
                Number(simboloAtual.linha),
                declaracoes.filter((d) => d)
            )
        );
    }

    declaracaoEscolha(): Escolha {
        throw new Error('Método não implementado.');
    }

    private logicaComumEscreva(): FormatacaoEscrita[] {
        const simboloAtual = this.simbolos[this.atual];
        const argumentos: FormatacaoEscrita[] = [];

        do {
            const valor = this.resolverDeclaracaoForaDeBloco();

            argumentos.push(new FormatacaoEscrita(this.hashArquivo, Number(simboloAtual.linha), valor));
        } while (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.VIRGULA));

        this.consumir(
            tiposDeSimbolos.PONTO_VIRGULA,
            "Esperado quebra de linha após fechamento de parênteses pós instrução 'escreva'."
        );

        return argumentos;
    }

    declaracaoEscreva(): Escreva {
        const simboloAtual = this.avancarEDevolverAnterior();

        const argumentos = this.logicaComumEscreva();

        return new Escreva(Number(simboloAtual.linha), this.hashArquivo, argumentos);
    }

    declaracaoEscrevaMesmaLinha(): EscrevaMesmaLinha {
        const simboloAtual = this.avancarEDevolverAnterior();

        const argumentos = this.logicaComumEscreva();

        return new EscrevaMesmaLinha(Number(simboloAtual.linha), this.hashArquivo, argumentos);
    }

    /**
     * Criação de declaração "repita".
     * @returns Um construto do tipo Fazer
     */
    declaracaoFazer(): Fazer {
        const simboloAtual = this.avancarEDevolverAnterior();

        const declaracoes = [];
        do {
            declaracoes.push(this.resolverDeclaracaoForaDeBloco());
        } while (![tiposDeSimbolos.ATE].includes(this.simbolos[this.atual].tipo));

        this.consumir(
            tiposDeSimbolos.ATE,
            "Esperado palavra-chave 'ate' após declaração de bloco em instrução 'repita'."
        );

        const condicao = this.expressao();

        // this.consumir(
        //     tiposDeSimbolos.QUEBRA_LINHA,
        //     "Esperado quebra de linha após condição de continuidade em instrução 'repita'."
        // );

        return new Fazer(
            this.hashArquivo,
            Number(simboloAtual.linha),
            new Bloco(
                this.hashArquivo,
                Number(simboloAtual.linha),
                declaracoes.filter((d) => d)
            ),
            condicao
        );
    }

    /**
     * Criação de declaração "interrompa".
     * Em Mapler, "sustar" é chamada de "interrompa".
     * @returns Uma declaração do tipo Sustar.
     */
    private declaracaoInterrompa(): Sustar {
        const simboloAtual = this.avancarEDevolverAnterior();

        // TODO: Contar blocos para colocar esta condição de erro.
        /* if (this.blocos < 1) {
            this.erro(this.simbolos[this.atual - 1], "'interrompa' deve estar dentro de um laço de repetição.");
        } */

        return new Sustar(simboloAtual);
    }

    /**
     * Análise de uma declaração `leia()`. No Mapler, `leia()` aceita 1..N argumentos.
     * @returns Uma declaração `Leia`.
     */
    declaracaoLeia(): Leia {
        const simboloAtual = this.avancarEDevolverAnterior();

        const argumentos = [];
        do {
            argumentos.push(this.resolverDeclaracaoForaDeBloco());
        } while (!this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.PONTO_VIRGULA));

        return new Leia(simboloAtual, argumentos);
    }

    /**
     * Um módulo em Mapler nada mais é do que uma função.
     * Um módulo aparentemente não especifica tipo de retorno.
     * @returns Uma declaração de função.
     */
    protected declaracaoModulo(): FuncaoDeclaracao {
        const simboloModulo = this.avancarEDevolverAnterior();
        const simboloNomeModulo = this.consumir(
            tiposDeSimbolos.IDENTIFICADOR,
            `Esperado nome do módulo após palavra reservada "modulo".`
        );

        return new FuncaoDeclaracao(simboloNomeModulo, this.corpoDaFuncao(simboloModulo.tipo), null, []);
    }

    declaracaoPara(): Para {
        const simboloPara: SimboloInterface = this.avancarEDevolverAnterior();

        const simboloVariavelIteracao: SimboloInterface = this.consumir(
            tiposDeSimbolos.IDENTIFICADOR,
            `Esperado identificador após palavra reservada "para".`
        );
        this.consumir(tiposDeSimbolos.DE, `Esperado paravra reservada "de" após identificador em declaração "para".`);
        const literalOuVariavelInicio = this.expressao();
        this.consumir(
            tiposDeSimbolos.ATE,
            `Esperado paravra reservada "ate" após literal ou identificador de estado inicial em declaração "para".`
        );
        const literalOuVariavelFim = this.expressao();
        this.consumir(
            tiposDeSimbolos.PASSO,
            `Esperado paravra reservada "passo" após literal ou identificador de estado final em declaração "para".`
        );

        let operadorCondicao = new Simbolo(
            tiposDeSimbolos.MENOR_IGUAL,
            '<=',
            null,
            Number(simboloPara.linha),
            this.hashArquivo
        );
        let operadorCondicaoIncremento = new Simbolo(
            tiposDeSimbolos.MENOR,
            '<',
            null,
            Number(simboloPara.linha),
            this.hashArquivo
        );

        // Se o valor do passo é uma variável, o passo só pode ser resolvido em
        // tempo de execução.
        let passo: Construto;
        let resolverIncrementoEmExecucao = false;
        if (literalOuVariavelInicio instanceof Literal && literalOuVariavelFim instanceof Literal) {
            passo = this.unario();
            if (passo.hasOwnProperty('operador') && (passo as Unario).operador.tipo === tiposDeSimbolos.SUBTRACAO) {
                operadorCondicao = new Simbolo(
                    tiposDeSimbolos.MAIOR_IGUAL,
                    '>=',
                    null,
                    Number(simboloPara.linha),
                    this.hashArquivo
                );
                operadorCondicaoIncremento = new Simbolo(
                    tiposDeSimbolos.MAIOR,
                    '>',
                    null,
                    Number(simboloPara.linha),
                    this.hashArquivo
                );
            }
        } else {
            // Passo e operador de condição precisam ser resolvidos em tempo de execução.
            passo = undefined;
            operadorCondicao = undefined;
            operadorCondicaoIncremento = undefined;
            resolverIncrementoEmExecucao = true;
        }

        this.consumir(
            tiposDeSimbolos.FACA,
            `Esperado palavra reservada "faca" após literal ou identificador de estado inicial em declaração "para".`
        );

        const declaracoesBlocoPara = [];
        let simboloAtualBlocoPara: SimboloInterface = this.simbolos[this.atual];
        while (simboloAtualBlocoPara.tipo !== tiposDeSimbolos.FIM) {
            declaracoesBlocoPara.push(this.resolverDeclaracaoForaDeBloco());
            simboloAtualBlocoPara = this.simbolos[this.atual];
        }

        this.consumir(tiposDeSimbolos.FIM, '');
        this.consumir(
            tiposDeSimbolos.PARA,
            "Esperado palavra reservada 'para' após palavra reservada 'fim' para encerrar declaração 'para'."
        );
        this.consumir(
            tiposDeSimbolos.PONTO_VIRGULA,
            "Esperado ponto-e-vírgula após palavra reservada 'para' para encerrar declaração 'para'."
        );

        const corpo = new Bloco(
            this.hashArquivo,
            Number(simboloPara.linha) + 1,
            declaracoesBlocoPara.filter((d) => d)
        );

        const declaracaoPara = new Para(
            this.hashArquivo,
            Number(simboloPara.linha),
            // Inicialização.
            new Atribuir(
                this.hashArquivo, 
                new Variavel(this.hashArquivo, simboloVariavelIteracao, 'inteiro'), 
                literalOuVariavelInicio
            ),
            // Condição.
            new Binario(
                this.hashArquivo,
                new Variavel(this.hashArquivo, simboloVariavelIteracao),
                operadorCondicao,
                literalOuVariavelFim
            ),
            // Incremento, feito em construto especial `FimPara`.
            new FimPara(
                this.hashArquivo,
                Number(simboloPara.linha),
                new Binario(
                    this.hashArquivo,
                    new Variavel(this.hashArquivo, simboloVariavelIteracao),
                    operadorCondicaoIncremento,
                    literalOuVariavelFim
                ),
                new Expressao(
                    new Atribuir(
                        this.hashArquivo,
                        new Variavel(this.hashArquivo, simboloVariavelIteracao, 'inteiro'),
                        new Binario(
                            this.hashArquivo,
                            new Variavel(this.hashArquivo, simboloVariavelIteracao),
                            new Simbolo(tiposDeSimbolos.ADICAO, '', null, Number(simboloPara.linha), this.hashArquivo),
                            passo
                        )
                    )
                )
            ),
            corpo
        );

        declaracaoPara.resolverIncrementoEmExecucao = resolverIncrementoEmExecucao;
        return declaracaoPara;
    }

    declaracaoSe(): Se {
        const simboloSe: SimboloInterface = this.avancarEDevolverAnterior();

        const condicao = this.expressao();

        this.consumir(tiposDeSimbolos.ENTAO, "Esperado palavra reservada 'entao' após condição em declaração 'se'.");

        const declaracoes = [];
        let caminhoSenao = null;

        do {
            declaracoes.push(this.resolverDeclaracaoForaDeBloco());

            if (this.verificarSeSimboloAtualEIgualA(tiposDeSimbolos.SENAO)) {
                const simboloSenao = this.simbolos[this.atual - 1];
                const declaracoesSenao = [];

                do {
                    declaracoesSenao.push(this.resolverDeclaracaoForaDeBloco());
                } while (
                    ![tiposDeSimbolos.FIM].includes(this.simbolos[this.atual].tipo) &&
                    ![tiposDeSimbolos.SE].includes(this.simbolos[this.atual + 1].tipo)
                );

                caminhoSenao = new Bloco(
                    this.hashArquivo,
                    Number(simboloSenao.linha),
                    declaracoesSenao.filter((d) => d)
                );
            }
        } while (
            ![tiposDeSimbolos.FIM].includes(this.simbolos[this.atual].tipo) &&
            ![tiposDeSimbolos.SE].includes(this.simbolos[this.atual + 1].tipo)
        );

        this.consumir(
            tiposDeSimbolos.FIM,
            "Esperado palavra-chave 'fim' para iniciar o fechamento de declaração 'se'."
        );

        this.consumir(tiposDeSimbolos.SE, "Esperado palavra-chave 'se' para o fechamento de declaração 'se'.");

        this.consumir(
            tiposDeSimbolos.PONTO_VIRGULA,
            "Esperado palavra-chave ';' para o fechamento de declaração 'se'."
        );

        return new Se(
            condicao,
            new Bloco(
                this.hashArquivo,
                Number(simboloSe.linha),
                declaracoes.filter((d) => d)
            ),
            [],
            caminhoSenao
        );
    }

    resolverDeclaracaoForaDeBloco(): Declaracao | Declaracao[] | Construto | Construto[] | any {
        const simboloAtual = this.simbolos[this.atual];
        switch (simboloAtual.tipo) {
            case tiposDeSimbolos.COMENTARIO:
                return this.declaracaoComentario();
            case tiposDeSimbolos.ENQUANTO:
                return this.declaracaoEnquanto();
            case tiposDeSimbolos.ESCREVER:
                return this.declaracaoEscreva();
            case tiposDeSimbolos.FIM:
                this.lendoModulos = true;
                this.avancarEDevolverAnterior();
                return null;
            case tiposDeSimbolos.LER:
                return this.declaracaoLeia();
            case tiposDeSimbolos.MODULO:
                if (!this.lendoModulos) {
                    throw this.erro(simboloAtual, 'Esperado instrução "FIM" antes de começar a ler módulos.');
                }

                return this.declaracaoModulo();
            case tiposDeSimbolos.PARA:
                return this.declaracaoPara();
            // case tiposDeSimbolos.PARENTESE_DIREITO:
            //     throw new Error('Não deveria estar caindo aqui.');
            case tiposDeSimbolos.REPITA:
                return this.declaracaoFazer();
            case tiposDeSimbolos.SE:
                return this.declaracaoSe();
            default:
                return this.expressao();
        }
    }

    /**
     * No Mapler, há uma determinada cadência de validação de símbolos.
     * @param retornoLexador Os símbolos entendidos pelo Lexador.
     * @param hashArquivo Obrigatório por interface mas não usado aqui.
     */
    analisar(
        retornoLexador: RetornoLexador<SimboloInterface>,
        hashArquivo: number
    ): RetornoAvaliadorSintatico<Declaracao> {
        this.erros = [];
        this.atual = 0;
        this.blocos = 0;
        this.lendoModulos = false;
        this.modulos = [];

        this.hashArquivo = hashArquivo || 0;
        this.simbolos = retornoLexador?.simbolos || [];

        let declaracoes = [];
        while (this.simbolos[this.atual].tipo === tiposDeSimbolos.COMENTARIO) {
            declaracoes.push(this.declaracaoComentario());
        }

        this.consumir(tiposDeSimbolos.VARIAVEIS, "Esperado expressão 'variaveis' para inicializar programa.");
        declaracoes = declaracoes.concat(this.validarSegmentoVariaveis());
        const simboloInicio = this.consumir(
            tiposDeSimbolos.INICIO,
            `Esperado expressão 'inicio' para marcar o início do programa.`
        );
        declaracoes.push(new InicioAlgoritmo(simboloInicio.linha, simboloInicio.hashArquivo));

        while (!this.estaNoFinal()) {
            declaracoes.push(this.resolverDeclaracaoForaDeBloco());
        }

        return {
            declaracoes: declaracoes.filter((d) => d),
            erros: this.erros,
        } as RetornoAvaliadorSintatico<Declaracao>;
    }
}
