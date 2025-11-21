import {
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
    AcessoMetodo,
    AcessoPropriedade,
    ArgumentoReferenciaFuncao,
    ReferenciaFuncao,
    ComentarioComoConstruto,
    Separador,
} from '@designliquido/delegua';
import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';
import { ContinuarQuebra, RetornoQuebra, SustarQuebra } from '@designliquido/delegua/quebras';
import { ReferenciaFutura } from '../construtos/referencia-futura';

/**
 * Um resolvedor executa após a avaliação sintática, para:
 * - Resolver referências marcadas como futuras;
 * - Trazer declarações de módulos antes do bloco de execução, antes da interpretação.
 *
 * Em Mapler, isso acontece porque módulos (funções) são declarados após o bloco principal de execução.
 * Em Delégua, as declarações precisam vir antes da execução propriamente dita.
 * No entanto, não é papel do avaliador sintático colocar isso em ordem, até porque a avaliação sintática
 * serve a diferentes propósitos, como a formatação de código, por exemplo.
 */
export class ResolvedorMapler implements VisitanteComumInterface {
    declaracoesModulos: { [nome: string]: FuncaoDeclaracao };

    constructor() {
        this.declaracoesModulos = {};
    }

    visitarExpressaoComentario(expressao: ComentarioComoConstruto): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoSeparador(expressao: Separador): Promise<any> | void {
        throw new Error('Método não implementado.');
    }

    visitarExpressaoFuncaoConstruto(expressao: FuncaoConstruto): Promise<any> | void {
        return Promise.resolve(expressao);
    }

    visitarExpressaoArgumentoReferenciaFuncao(expressao: ArgumentoReferenciaFuncao): Promise<any> | void {
        return Promise.resolve(expressao);
    }

    visitarExpressaoReferenciaFuncao(expressao: ReferenciaFuncao): Promise<any> | void {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAcessoMetodo(expressao: AcessoMetodo): Promise<any> | void {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAcessoPropriedade(expressao: AcessoPropriedade): Promise<any> | void {
        return Promise.resolve(expressao);
    }

    visitarDeclaracaoCabecalhoPrograma(declaracao: CabecalhoPrograma): Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoClasse(declaracao: Classe): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoComentario(declaracao: Comentario): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoConstMultiplo(declaracao: ConstMultiplo): Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoDeExpressao(declaracao: Expressao): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoDefinicaoFuncao(declaracao: FuncaoDeclaracao): void {}

    visitarDeclaracaoEnquanto(declaracao: Enquanto): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoEscolha(declaracao: Escolha): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoEscreva(declaracao: Escreva): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    async visitarDeclaracaoFazer(declaracao: Fazer): Promise<any> {
        declaracao.condicaoEnquanto = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.condicaoEnquanto);
        declaracao.caminhoFazer = await this.visitarExpressaoBloco(declaracao.caminhoFazer);
        return declaracao;
    }

    async visitarDeclaracaoFutura(declaracao: ReferenciaFutura): Promise<any> {
        const declaracaoModuloCorrespondente = this.declaracoesModulos[declaracao.identificadorFuturo];
        return Promise.resolve(
            new Expressao(new Chamada(declaracao.hashArquivo, declaracaoModuloCorrespondente.funcao, []))
        );
    }

    visitarDeclaracaoImportar(declaracao: Importar): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoInicioAlgoritmo(declaracao: InicioAlgoritmo): Promise<any> {
        return Promise.resolve(declaracao);
    }

    async visitarDeclaracaoPara(declaracao: Para): Promise<any> {
        if (declaracao.inicializador) {
            declaracao.inicializador = await this.resolverDeclaracaoOuConstrutoForaDeBloco(
                declaracao.inicializador as Declaracao
            );
        }

        declaracao.condicao = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.condicao);

        return declaracao;
    }

    visitarDeclaracaoParaCada(declaracao: ParaCada): Promise<any> {
        return Promise.resolve(declaracao);
    }

    async visitarDeclaracaoSe(declaracao: Se): Promise<any> {
        declaracao.condicao = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.condicao);
        declaracao.caminhoEntao = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.caminhoEntao);

        if (declaracao.caminhoSenao) {
            declaracao.caminhoSenao = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.caminhoSenao);
        }

        return declaracao;
    }

    visitarDeclaracaoTendoComo(declaracao: TendoComo): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoTente(declaracao: Tente): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoVar(declaracao: Var): Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarDeclaracaoVarMultiplo(declaracao: VarMultiplo): Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarExpressaoDeAtribuicao(expressao: Atribuir<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAcessoIndiceVariavel(expressao: AcessoIndiceVariavel<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAcessoElementoMatriz(expressao: AcessoElementoMatriz<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAcessoMetodoOuPropriedade(expressao: AcessoMetodoOuPropriedade<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAgrupamento(expressao: Agrupamento): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAtribuicaoPorIndice(expressao: AtribuicaoPorIndice): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoAtribuicaoPorIndicesMatriz(expressao: AtribuicaoPorIndicesMatriz): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoBinaria(expressao: Binario<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    async visitarExpressaoBloco(declaracao: Bloco): Promise<any> {
        const declaracoesResolvidas = [];
        for (let blocoDeclaracao of declaracao.declaracoes) {
            declaracoesResolvidas.push(await this.resolverDeclaracaoOuConstrutoForaDeBloco(blocoDeclaracao));
        }

        declaracao.declaracoes = declaracoesResolvidas;
        return declaracao;
    }

    visitarExpressaoContinua(declaracao?: Continua): ContinuarQuebra {
        return new ContinuarQuebra();
    }

    visitarExpressaoDeChamada(expressao: Chamada): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoDefinirValor(expressao: DefinirValor<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoDeVariavel(expressao: Variavel<string> | Constante<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoDicionario(expressao: Dicionario): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoExpressaoRegular(expressao: ExpressaoRegular<string>): Promise<RegExp> {
        return Promise.resolve(null);
    }

    visitarExpressaoFalhar(expressao: Falhar): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoFimPara(declaracao: FimPara): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarExpressaoFormatacaoEscrita(declaracao: FormatacaoEscrita): void | Promise<any> {
        return Promise.resolve(declaracao);
    }

    visitarExpressaoIsto(expressao: Isto): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoLeia(expressao: Leia): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoLiteral(expressao: Literal): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoLogica(expressao: Logico<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoRetornar(declaracao: Retorna): Promise<RetornoQuebra> {
        return Promise.resolve(declaracao as any);
    }

    visitarExpressaoSuper(expressao: Super<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoSustar(declaracao?: Sustar): SustarQuebra {
        return new SustarQuebra();
    }

    visitarExpressaoTupla(expressao: Tupla): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoTipoDe(expressao: TipoDe<string>): Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoUnaria(expressao: Unario<string>): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    visitarExpressaoVetor(expressao: Vetor): void | Promise<any> {
        return Promise.resolve(expressao);
    }

    protected async resolverDeclaracaoOuConstrutoForaDeBloco(declaracaoOuConstruto: Declaracao | Construto) {
        switch (declaracaoOuConstruto.constructor) {
            case Bloco:
                return this.visitarExpressaoBloco(declaracaoOuConstruto as Bloco);
            case Enquanto:
                return this.visitarDeclaracaoEnquanto(declaracaoOuConstruto as Enquanto);
            case Escreva:
                return this.visitarDeclaracaoEscreva(declaracaoOuConstruto as Escreva);
            case Fazer:
                return this.visitarDeclaracaoFazer(declaracaoOuConstruto as Fazer);
            case FuncaoDeclaracao:
                return this.visitarDeclaracaoDefinicaoFuncao(declaracaoOuConstruto as FuncaoDeclaracao);
            case Leia:
                return this.visitarExpressaoLeia(declaracaoOuConstruto as Leia);
            case Para:
                return this.visitarDeclaracaoPara(declaracaoOuConstruto as Para);
            case ReferenciaFutura:
                return this.visitarDeclaracaoFutura(declaracaoOuConstruto as ReferenciaFutura);
            case Se:
                return this.visitarDeclaracaoSe(declaracaoOuConstruto as Se);
            default:
                return Promise.resolve(declaracaoOuConstruto);
        }
    }

    /**
     * Resolve referências futuras e reordena declarações para
     * correta execução pelo interpretador.
     * @param declaracoes O vetor original de declarações vindo da avaliação sintática.
     * @returns Um novo vetor de declarações, preparado para interpretação.
     */
    async resolver(declaracoes: Declaracao[]): Promise<Declaracao[]> {
        const declaracoesResolvidas = [];
        for (let declaracaoModulo of declaracoes.filter((declaracao) => declaracao instanceof FuncaoDeclaracao)) {
            const declaracaoModuloTipada = declaracaoModulo as FuncaoDeclaracao;
            this.declaracoesModulos[declaracaoModuloTipada.simbolo.lexema] = declaracaoModuloTipada;
            declaracoesResolvidas.push(declaracaoModuloTipada);
        }

        for (let declaracao of declaracoes) {
            declaracoesResolvidas.push(await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao));
        }

        return declaracoesResolvidas.filter((d) => d);
    }
}
