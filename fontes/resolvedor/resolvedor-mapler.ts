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
import { DeclaracaoFutura } from '../declaracoes/declaracao-futura';

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
    declaracoesModulos: { [nome: string]: FuncaoDeclaracao }

    constructor() {
        this.declaracoesModulos = {};
    }
    
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

    async visitarDeclaracaoFazer(declaracao: Fazer): Promise<any> {
        declaracao.condicaoEnquanto = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.condicaoEnquanto);
        declaracao.caminhoFazer = await this.visitarExpressaoBloco(declaracao.caminhoFazer);
        return declaracao;
    }

    async visitarDeclaracaoFutura(declaracao: DeclaracaoFutura): Promise<any> {
        const declaracaoModuloCorrespondente = this.declaracoesModulos[declaracao.identificadorFuturo];
        return Promise.resolve(
            new Expressao(
                new Chamada(declaracao.hashArquivo, declaracaoModuloCorrespondente.funcao, null, [])
            )
        );
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

    async visitarDeclaracaoSe(declaracao: Se): Promise<any> {
        declaracao.condicao = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.condicao);
        declaracao.caminhoEntao = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.caminhoEntao);

        if (declaracao.caminhoSenao) {
            declaracao.caminhoSenao = await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao.caminhoSenao);
        }
        
        return declaracao;
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

    async visitarExpressaoBloco(declaracao: Bloco): Promise<any> {
        const declaracoesResolvidas = [];
        for (let blocoDeclaracao of declaracao.declaracoes) {
            declaracoesResolvidas.push(await this.resolverDeclaracaoOuConstrutoForaDeBloco(blocoDeclaracao));
        }

        declaracao.declaracoes = declaracoesResolvidas;
        return declaracao;
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
        return Promise.resolve(declaracao);
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

    protected async resolverDeclaracaoOuConstrutoForaDeBloco(declaracaoOuConstruto: Declaracao | Construto) {
        switch (declaracaoOuConstruto.constructor.name) {
            case 'Bloco':
                return this.visitarExpressaoBloco(declaracaoOuConstruto as Bloco);
            case 'DeclaracaoFutura':
                return this.visitarDeclaracaoFutura(declaracaoOuConstruto as DeclaracaoFutura);
            case 'Enquanto':
                return this.visitarDeclaracaoEnquanto(declaracaoOuConstruto as Enquanto);
            case 'Escreva':
                return this.visitarDeclaracaoEscreva(declaracaoOuConstruto as Escreva);
            case 'Leia':
                return this.visitarExpressaoLeia(declaracaoOuConstruto as Leia);
            case 'FuncaoDeclaracao':
                return this.visitarDeclaracaoDefinicaoFuncao(declaracaoOuConstruto as FuncaoDeclaracao);
            case 'Para':
                return this.visitarDeclaracaoPara(declaracaoOuConstruto as Para);
            case 'Fazer':
                return this.visitarDeclaracaoFazer(declaracaoOuConstruto as Fazer);
            case 'Se':
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
        for (let declaracaoModulo of declaracoes.filter(declaracao => declaracao instanceof FuncaoDeclaracao)) {
            const declaracaoModuloTipada = declaracaoModulo as FuncaoDeclaracao;
            this.declaracoesModulos[declaracaoModuloTipada.simbolo.lexema] = declaracaoModuloTipada;
            declaracoesResolvidas.push(declaracaoModuloTipada);
        }

        for (let declaracao of declaracoes) {
            declaracoesResolvidas.push(
                await this.resolverDeclaracaoOuConstrutoForaDeBloco(declaracao)
            );
        }

        return declaracoesResolvidas.filter(d => d);
    }
}
