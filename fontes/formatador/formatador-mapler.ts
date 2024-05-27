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

export class FormatadorMapler implements VisitanteComumInterface {
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
    visitarDeclaracaoEnquanto(declaracao: Enquanto): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoEscolha(declaracao: Escolha): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoEscreva(declaracao: Escreva): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoFazer(declaracao: Fazer): void | Promise<any> {
        throw new Error('Método não implementado.');
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

    visitarDeclaracaoPara(declaracao: Para): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoParaCada(declaracao: ParaCada): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoSe(declaracao: Se): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoTendoComo(declaracao: TendoComo): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarDeclaracaoTente(declaracao: Tente): void | Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarDeclaracaoVar(declaracao: Var): any {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}${declaracao.simbolo.lexema}: ${declaracao.tipo};`;
        this.codigoFormatado += `${this.quebraLinha}`;
    }

    visitarDeclaracaoVarMultiplo(declaracao: VarMultiplo): Promise<any> {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoDeAtribuicao(expressao: Atribuir<string>): void | Promise<any> {
        this.codigoFormatado += `${' '.repeat(this.indentacaoAtual)}`;
        this.codigoFormatado += `${expressao.simbolo.lexema} <- `;
        this.formatarDeclaracaoOuConstruto(expressao.valor);
        this.codigoFormatado += `;${this.quebraLinha}`;
    }

    visitarExpressaoAcessoIndiceVariavel(expressao: AcessoIndiceVariavel<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoAcessoElementoMatriz(expressao: AcessoElementoMatriz<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoAcessoMetodo(expressao: AcessoMetodoOuPropriedade<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoAgrupamento(expressao: Agrupamento): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoAtribuicaoPorIndice(expressao: AtribuicaoPorIndice): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoAtribuicaoPorIndicesMatriz(expressao: AtribuicaoPorIndicesMatriz): Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoBinaria(expressao: Binario<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoBloco(declaracao: Bloco): Promise<any> {
        throw new Error('Método não implementado.');
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
    visitarExpressaoDeVariavel(expressao: Variavel<string> | Constante<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
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
        throw new Error('Método não implementado.');
    }
    visitarExpressaoIsto(expressao: Isto): void | Promise<any> {
        throw new Error('Método não implementado.');
    }
    visitarExpressaoLeia(expressao: Leia): Promise<any> {
        throw new Error('Método não implementado.');
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
    visitarExpressaoUnaria(expressao: Unario<string>): void | Promise<any> {
        throw new Error('Método não implementado.');
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
        }
    }

    formatar(declaracoes: Declaracao[]): string {
        this.indentacaoAtual = 0;
        this.codigoFormatado = `variaveis ${this.quebraLinha}`;
        this.devePularLinha = true;
        this.deveIndentar = true;
        this.indentacaoAtual += this.tamanhoIndentacao;

        for (let declaracao of declaracoes) {
            this.formatarDeclaracaoOuConstruto(declaracao);
        }

        this.indentacaoAtual -= this.tamanhoIndentacao;
        this.codigoFormatado += `fim${this.quebraLinha}`;

        return this.codigoFormatado;
    }
}
