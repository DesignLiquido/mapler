import {
    Aleatorio,
    CabecalhoPrograma,
    Classe,
    Comentario,
    Const,
    ConstMultiplo,
    Expressao,
    FuncaoDeclaracao,
    Enquanto,
    Escolha,
    Escreva,
    EscrevaMesmaLinha,
    Fazer,
    Importar,
    InicioAlgoritmo,
    Para,
    ParaCada,
    Se,
    TendoComo,
    Tente,
    Var,
    VarMultiplo,
    Atribuir,
    AcessoIndiceVariavel,
    AcessoElementoMatriz,
    AcessoMetodoOuPropriedade,
    Agrupamento,
    AtribuicaoPorIndice,
    AtribuicaoPorIndicesMatriz,
    Binario,
    Bloco,
    Continua,
    Chamada,
    DefinirValor,
    FuncaoConstruto,
    Variavel,
    Constante,
    Dicionario,
    ExpressaoRegular,
    Falhar,
    FimPara,
    FormatacaoEscrita,
    Isto,
    Leia,
    LeiaMultiplo,
    Literal,
    Logico,
    Retorna,
    Super,
    Sustar,
    Tupla,
    TipoDe,
    Unario,
    Vetor,
    Declaracao,
    Construto,
} from '@designliquido/delegua';
import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';
import { ContinuarQuebra, RetornoQuebra, SustarQuebra } from '@designliquido/delegua/quebras';
import tiposDeDadosComum from "../tipos-de-dados/comum"
import tiposDeDadosMapler from "../tipos-de-dados/mapler"
import tiposDeSimbolos from "../tipos-de-simbolos/lexico-regular"
import { PilhaEscoposFormatacao } from './pilha-escopos-formatacao';


export class FormatadorMapler implements VisitanteComumInterface {
    pilhaEscoposFormatacao: PilhaEscoposFormatacao;
    eEstruturaPara: boolean;
    indentacaoAtual: number;
    quebraLinha: string;
    tamanhoIndentacao: number;
    codigoFormatado: string;
    devePularLinha: boolean;
    deveIndentar: boolean;

    constructor(quebraLinha: string, tamanhoIndentacao: number = 4) {
        this.quebraLinha = quebraLinha;
        this.tamanhoIndentacao = tamanhoIndentacao;

        this.indentacaoAtual = 0;
        this.codigoFormatado = '';
        this.devePularLinha = true;
        this.deveIndentar = true;
        this.eEstruturaPara = false;
    }

    visitarDeclaracaoAleatorio(declaracao: Aleatorio): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoCabecalhoPrograma(declaracao: CabecalhoPrograma): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoClasse(declaracao: Classe): void | Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoComentario(declaracao: Comentario): void {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}// `;
        this.codigoFormatado += (declaracao.conteudo as string).replace(/\s+/g, ' ');
        this.codigoFormatado += `${this.quebraLinha}`;
    }

    visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoConstMultiplo(declaracao: ConstMultiplo): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoDeExpressao(declaracao: Expressao): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoDefinicaoFuncao(declaracao: FuncaoDeclaracao): void {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoEnquanto(declaracao: Enquanto) {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}enquanto `;
        this.formatarDeclaracaoOuConstruto(declaracao.condicao);
        this.codigoFormatado += ` faca`;
        this.codigoFormatado += this.quebraLinha;

        this.formatarDeclaracaoOuConstruto(declaracao.corpo);
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim enquanto`;
        this.codigoFormatado += this.quebraLinha;
    }
    visitarDeclaracaoEscolha(declaracao: Escolha): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoEscreva(declaracao: Escreva): void | Promise<any> {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}escrever `;
        this.deveIndentar = false
        for (let argumento of declaracao.argumentos) {
            this.formatarDeclaracaoOuConstruto(argumento);
            this.codigoFormatado += `, `;
        }
        this.deveIndentar = true

        if (declaracao.argumentos.length > 0) {
            this.codigoFormatado = this.codigoFormatado.slice(0, -2);
        }

        this.codigoFormatado += `${this.quebraLinha}`;
    }
    visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoFazer(declaracao: Fazer) {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}repita${this.quebraLinha}`;
        this.formatarDeclaracaoOuConstruto(declaracao.caminhoFazer);
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}ate `;
        this.formatarDeclaracaoOuConstruto(declaracao.condicaoEnquanto);
        this.codigoFormatado += this.quebraLinha
    }
    visitarDeclaracaoImportar(declaracao: Importar): void | Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoInicioAlgoritmo(declaracao: InicioAlgoritmo): any {
        this.indentacaoAtual -= this.tamanhoIndentacao;
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}inicio `;
        this.codigoFormatado += `${this.quebraLinha}`;
        this.indentacaoAtual += this.tamanhoIndentacao;
    }

    visitarDeclaracaoPara(declaracao: Para): any {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}para `;
        this.devePularLinha = false;
        this.eEstruturaPara = true;
        if (declaracao.inicializador) {
            this.deveIndentar = false;
            if (Array.isArray(declaracao.inicializador)) {
                for (let declaracaoInicializador of declaracao.inicializador) {
                    this.formatarDeclaracaoOuConstruto(declaracaoInicializador);
                }
            } else {
                this.formatarDeclaracaoOuConstruto(declaracao.inicializador);
            }
            this.deveIndentar = true;
        }

        if (declaracao.condicao instanceof Binario) this.codigoFormatado += ` ate ${declaracao.condicao.direita.valor}`;
        else this.formatarDeclaracaoOuConstruto(declaracao.condicao);

        this.codigoFormatado += ` faca${this.quebraLinha}`;
        this.formatarDeclaracaoOuConstruto(declaracao.incrementar);

        this.formatarBlocoOuVetorDeclaracoes(declaracao.corpo.declaracoes);

        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim para${this.quebraLinha}`;
        this.devePularLinha = true;
        this.eEstruturaPara = false;
    }
    visitarDeclaracaoParaCada(declaracao: ParaCada): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoSe(declaracao: Se) {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}se `;
        this.formatarDeclaracaoOuConstruto(declaracao.condicao);
        this.codigoFormatado += ` entao${this.quebraLinha}`;

        this.indentacaoAtual += this.tamanhoIndentacao;
        for (let declaracaoBloco of (declaracao.caminhoEntao as Bloco).declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracaoBloco);
        }

        this.indentacaoAtual -= this.tamanhoIndentacao;
        if (declaracao.caminhoSenao) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)} senao ${this.quebraLinha}`;
            this.formatarDeclaracaoOuConstruto(declaracao.caminhoSenao);
        }
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}fim se${this.quebraLinha}`;
    }
    visitarDeclaracaoTendoComo(declaracao: TendoComo): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoTente(declaracao: Tente): void | Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoVar(declaracao: Var): any {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}${declaracao.simbolo.lexema}: `;
        switch (declaracao.tipo) {
            case tiposDeDadosComum.TEXTO:
                this.codigoFormatado += tiposDeDadosMapler.CADEIA
                break;
            case tiposDeDadosComum.LOGICO:
            case 'lógico':
                this.codigoFormatado += tiposDeDadosMapler.LOGICO
                break;
            case 'vetor':
                if (Array.isArray(declaracao.inicializador.valor)) {
                    const tamanhoVetor = declaracao.inicializador.valor.length
                    this.codigoFormatado += `[${declaracao.inicializador.valor[0]}..${declaracao.inicializador.valor[tamanhoVetor - 1]}]`
                }
                break;
            default:
                this.codigoFormatado += declaracao.tipo
                console.log(declaracao.tipo)
                break;
        }
        this.codigoFormatado += `;${this.quebraLinha}`;
    }

    visitarDeclaracaoVarMultiplo(declaracao: VarMultiplo): Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoDeAtribuicao(expressao: Atribuir<string>): void | Promise<any> {
        if (this.deveIndentar) {
            this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        }
        if (this.eEstruturaPara) {
            this.codigoFormatado += `${expressao.simbolo.lexema} de `;
        } else {
            this.codigoFormatado += `${expressao.simbolo.lexema} <- `;
        }
        this.formatarDeclaracaoOuConstruto(expressao.valor);
        if (this.devePularLinha) {
            this.codigoFormatado += `;${this.quebraLinha}`;
        }
    }

    visitarExpressaoAcessoIndiceVariavel(expressao: AcessoIndiceVariavel<string>): void | Promise<any> {
        if (this.deveIndentar) {
            this.codigoFormatado += `${" ".repeat(this.indentacaoAtual)}`
        }
        let variavel
        let valor
        if (expressao.entidadeChamada instanceof Variavel) {
            variavel = expressao.entidadeChamada.simbolo.lexema
        } else {
            variavel = expressao.entidadeChamada.valor
        }

        if (expressao.indice instanceof Variavel) {
            valor = expressao.indice.simbolo.lexema
        } else {
            valor = expressao.indice.valor
        }
        this.codigoFormatado += `${variavel}[${valor}]`

    }
    visitarExpressaoAcessoElementoMatriz(expressao: AcessoElementoMatriz<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoAcessoMetodo(expressao: AcessoMetodoOuPropriedade<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoAgrupamento(expressao: Agrupamento): any {
        this.codigoFormatado += '(';
        this.formatarDeclaracaoOuConstruto(expressao.expressao);
        this.codigoFormatado += ')';
    }
    visitarExpressaoAtribuicaoPorIndice(expressao: AtribuicaoPorIndice): any {
        const variavel = expressao.objeto as Variavel
        let posicao;
        let valor
        if (expressao.indice instanceof Variavel) {
            posicao = expressao.indice.simbolo.lexema
        } else if (expressao.indice instanceof Literal) {
            posicao = expressao.indice.valor
        }

        if (expressao.valor instanceof Variavel) {
            valor = expressao.valor.simbolo.lexema
        } else if (expressao.valor instanceof Literal) {
            valor = expressao.valor.valor
        }

        this.codigoFormatado += `${" ".repeat(this.indentacaoAtual)}${variavel.simbolo.lexema}[${posicao}] <- ${valor}${this.quebraLinha}`
    }
    visitarExpressaoAtribuicaoPorIndicesMatriz(expressao: AtribuicaoPorIndicesMatriz): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoBinaria(expressao: Binario) {
        this.formatarDeclaracaoOuConstruto(expressao.esquerda);
        switch (expressao.operador.tipo) {
            case tiposDeSimbolos.ADICAO:
                this.codigoFormatado += ' + ';
                break;
            case tiposDeSimbolos.DIVISAO:
                this.codigoFormatado += ' / ';
                break;
            case tiposDeSimbolos.IGUAL:
                this.codigoFormatado += ' = ';
                break;
            case tiposDeSimbolos.MAIOR:
                this.codigoFormatado += ' > ';
                break;
            case tiposDeSimbolos.MAIOR_IGUAL:
                this.codigoFormatado += ' >= ';
                break;
            case tiposDeSimbolos.MENOR:
                this.codigoFormatado += '<';
                break;
            case tiposDeSimbolos.MENOR_IGUAL:
                this.codigoFormatado += ' <= ';
                break;
            case tiposDeSimbolos.SUBTRACAO:
                this.codigoFormatado += ` - `;
                break;
            case tiposDeSimbolos.MULTIPLICACAO:
                this.codigoFormatado += ` * `;
                break;
            case tiposDeSimbolos.MODULO:
                this.codigoFormatado += ` % `;
                break;
            default:
                console.log(expressao.operador.tipo);
                break;
        }
        this.formatarDeclaracaoOuConstruto(expressao.direita);
    }
    visitarExpressaoBloco(declaracao: Bloco): any {
        this.formatarBlocoOuVetorDeclaracoes(declaracao.declaracoes);
    }
    visitarExpressaoContinua(declaracao?: Continua): ContinuarQuebra {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoDeChamada(expressao: Chamada): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoDefinirValor(expressao: DefinirValor<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoDeleguaFuncao(expressao: FuncaoConstruto): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoDeVariavel(expressao: Variavel) {
        this.codigoFormatado += expressao.simbolo.lexema;
    }
    visitarExpressaoDicionario(expressao: Dicionario): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoExpressaoRegular(expressao: ExpressaoRegular<string>): Promise<RegExp> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoFalhar(expressao: Falhar): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoFimPara(declaracao: FimPara): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoFormatacaoEscrita(declaracao: FormatacaoEscrita): void | Promise<any> {
        this.formatarDeclaracaoOuConstruto(declaracao.expressao)
    }
    visitarExpressaoIsto(expressao: Isto): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoLeia(expressao: Leia): any {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}ler `;
        for (let argumento of expressao.argumentos) {
            this.formatarDeclaracaoOuConstruto(argumento);
            this.codigoFormatado += `, `;
        }

        if (expressao.argumentos.length > 0) {
            this.codigoFormatado = this.codigoFormatado.slice(0, -2);
        }

        this.codigoFormatado += `${this.quebraLinha}`;
    }
    visitarExpressaoLeiaMultiplo(expressao: LeiaMultiplo): Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoLiteral(expressao: Literal): any {
        if (typeof expressao.valor === 'string') {
            this.codigoFormatado += `"${expressao.valor}"`;
            return;
        }
        if (typeof expressao.valor === 'boolean') {
            switch (expressao.valor) {
                case true:
                    this.codigoFormatado += 'verdadeiro';
                    break;
                default:
                    this.codigoFormatado += 'falso';
                    break;
            }
            return;
        }

        this.codigoFormatado += `${expressao.valor}`;
    }

    visitarExpressaoLogica(expressao: Logico<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoRetornar(declaracao: Retorna): Promise<RetornoQuebra> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoSuper(expressao: Super<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoSustar(declaracao?: Sustar): SustarQuebra {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoTupla(expressao: Tupla): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoTipoDe(expressao: TipoDe<string>): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoUnaria(expressao: Unario) {
        let operador: string;
        switch (expressao.operador.tipo) {
            case tiposDeSimbolos.SUBTRACAO:
                operador = `-`;
                break;
            case tiposDeSimbolos.ADICAO:
                operador = `+`;
                break;
            case tiposDeSimbolos.NEGACAO:
                operador = `nao `;
        }

        switch (expressao.incidenciaOperador) {
            case 'ANTES':
                this.codigoFormatado += operador;
                this.formatarDeclaracaoOuConstruto(expressao.operando);
                break;
            case 'DEPOIS':
                this.formatarDeclaracaoOuConstruto(expressao.operando);
                this.codigoFormatado += operador;
                break;
        }

        if (this.devePularLinha) {
            this.codigoFormatado += this.quebraLinha;
        }
        console.log(this.devePularLinha)
    }
    visitarExpressaoVetor(expressao: Vetor): void | Promise<any> {
        throw new Error('Método não implementado.');
    }

    formatarDeclaracaoOuConstruto(declaracaoOuConstruto: Declaracao | Construto): void {
        switch (declaracaoOuConstruto.constructor.name) {
            case 'Atribuir':
                this.visitarExpressaoDeAtribuicao(declaracaoOuConstruto as Atribuir);
                break;
            case 'Binario':
                this.visitarExpressaoBinaria(declaracaoOuConstruto as Binario);
                break;
            case 'Comentario':
                this.visitarDeclaracaoComentario(declaracaoOuConstruto as Comentario);
                break;
            case 'InicioAlgoritmo':
                this.visitarDeclaracaoInicioAlgoritmo(declaracaoOuConstruto as Var);
                break;
            case 'Literal':
                this.visitarExpressaoLiteral(declaracaoOuConstruto as Literal);
                break;
            case 'Var':
                this.visitarDeclaracaoVar(declaracaoOuConstruto as Var);
                break;
            case 'Variavel':
                this.visitarExpressaoDeVariavel(declaracaoOuConstruto as Variavel);
                break;
            case 'Escreva':
                this.visitarDeclaracaoEscreva(declaracaoOuConstruto as Escreva)
                break;
            case 'FormatacaoEscrita':
                this.visitarExpressaoFormatacaoEscrita(declaracaoOuConstruto as FormatacaoEscrita)
                break;
            case 'Leia':
                this.visitarExpressaoLeia(declaracaoOuConstruto as Leia)
                break;
            case 'Se':
                this.visitarDeclaracaoSe(declaracaoOuConstruto as Se)
                break;
            case 'Bloco':
                this.visitarExpressaoBloco(declaracaoOuConstruto as Bloco)
                break;
            case 'Unario':
                this.visitarExpressaoUnaria(declaracaoOuConstruto as Unario)
                break;
            case 'Para':
                this.visitarDeclaracaoPara(declaracaoOuConstruto as Para)
                break;
            case 'Enquanto':
                this.visitarDeclaracaoEnquanto(declaracaoOuConstruto as Enquanto)
                break;
            case 'Fazer':
                this.visitarDeclaracaoFazer(declaracaoOuConstruto as Fazer)
                break;
            case 'Agrupamento':
                this.visitarExpressaoAgrupamento(declaracaoOuConstruto as Agrupamento)
                break;
            case 'AtribuicaoPorIndice':
                this.visitarExpressaoAtribuicaoPorIndice(declaracaoOuConstruto as AtribuicaoPorIndice)
                break;
            case 'AcessoIndiceVariavel':
                this.visitarExpressaoAcessoIndiceVariavel(declaracaoOuConstruto as AcessoIndiceVariavel)
                break;
            default:
                console.log(declaracaoOuConstruto.constructor.name)
                break;
        }
    }

    private formatarBlocoOuVetorDeclaracoes(declaracoes: Declaracao[]) {
        this.indentacaoAtual += this.tamanhoIndentacao;
        this.pilhaEscoposFormatacao.empilharDeclaracoes(declaracoes);
        for (let declaracaoBloco of declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracaoBloco);
            this.pilhaEscoposFormatacao.topoDaPilha().declaracaoAtual++;
        }

        this.pilhaEscoposFormatacao.removerUltimo();
        this.indentacaoAtual -= this.tamanhoIndentacao;
    }

    formatar(declaracoes: Declaracao[]): string {
        this.pilhaEscoposFormatacao = new PilhaEscoposFormatacao();
        this.pilhaEscoposFormatacao.empilharDeclaracoes(declaracoes);
        const escopoInicialFormatacao = this.pilhaEscoposFormatacao.topoDaPilha();


        this.indentacaoAtual = 0;
        this.codigoFormatado = `variaveis ${this.quebraLinha}`;
        this.devePularLinha = true;
        this.deveIndentar = true;
        this.indentacaoAtual += this.tamanhoIndentacao;

        for (let declaracao of declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracao);
            escopoInicialFormatacao.declaracaoAtual++;
        }

        this.indentacaoAtual -= this.tamanhoIndentacao;
        this.codigoFormatado += `fim${this.quebraLinha}`;

        return this.codigoFormatado;
    }
}
