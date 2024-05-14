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
} from '@designliquido/delegua';
import { VisitanteComumInterface } from '@designliquido/delegua/interfaces';
import { ContinuarQuebra, RetornoQuebra, SustarQuebra } from '@designliquido/delegua/quebras';

export class ResolvedorMapler implements VisitanteComumInterface {
    visitarDeclaracaoAleatorio(declaracao: Aleatorio): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoCabecalhoPrograma(declaracao: CabecalhoPrograma): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoClasse(declaracao: Classe): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoComentario(declaracao: Comentario): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoConst(declaracao: Const): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoConstMultiplo(declaracao: ConstMultiplo): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoDeExpressao(declaracao: Expressao): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoDefinicaoFuncao(declaracao: FuncaoDeclaracao): void {
        
    }
    visitarDeclaracaoEnquanto(declaracao: Enquanto): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoEscolha(declaracao: Escolha): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoEscreva(declaracao: Escreva): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoEscrevaMesmaLinha(declaracao: EscrevaMesmaLinha): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoFazer(declaracao: Fazer): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoImportar(declaracao: Importar): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoInicioAlgoritmo(declaracao: InicioAlgoritmo): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoPara(declaracao: Para): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoParaCada(declaracao: ParaCada): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoSe(declaracao: Se): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoTendoComo(declaracao: TendoComo): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoTente(declaracao: Tente): void | Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoVar(declaracao: Var): Promise<any> {
        return Promise.resolve();
    }
    visitarDeclaracaoVarMultiplo(declaracao: VarMultiplo): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoDeAtribuicao(expressao: Atribuir<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoAcessoIndiceVariavel(expressao: AcessoIndiceVariavel<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoAcessoElementoMatriz(expressao: AcessoElementoMatriz<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoAcessoMetodo(expressao: AcessoMetodoOuPropriedade<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoAgrupamento(expressao: Agrupamento): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoAtribuicaoPorIndice(expressao: AtribuicaoPorIndice): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoAtribuicaoPorIndicesMatriz(expressao: AtribuicaoPorIndicesMatriz): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoBinaria(expressao: Binario<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoBloco(declaracao: Bloco): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoContinua(declaracao?: Continua): ContinuarQuebra {
        return Promise.resolve();
    }
    visitarExpressaoDeChamada(expressao: Chamada): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoDefinirValor(expressao: DefinirValor<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoDeleguaFuncao(expressao: FuncaoConstruto): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoDeVariavel(expressao: Variavel<string> | Constante<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoDicionario(expressao: Dicionario): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoExpressaoRegular(expressao: ExpressaoRegular<string>): Promise<RegExp> {
        return Promise.resolve(null);
    }
    visitarExpressaoFalhar(expressao: Falhar): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoFimPara(declaracao: FimPara): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoFormatacaoEscrita(declaracao: FormatacaoEscrita): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoIsto(expressao: Isto): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoLeia(expressao: Leia): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoLeiaMultiplo(expressao: LeiaMultiplo): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoLiteral(expressao: Literal): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoLogica(expressao: Logico<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoRetornar(declaracao: Retorna): Promise<RetornoQuebra> {
        return Promise.resolve(null);
    }
    visitarExpressaoSuper(expressao: Super<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoSustar(declaracao?: Sustar): SustarQuebra {
        return Promise.resolve();
    }
    visitarExpressaoTupla(expressao: Tupla): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoTipoDe(expressao: TipoDe<string>): Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoUnaria(expressao: Unario<string>): void | Promise<any> {
        return Promise.resolve();
    }
    visitarExpressaoVetor(expressao: Vetor): void | Promise<any> {
        return Promise.resolve();
    }
}
