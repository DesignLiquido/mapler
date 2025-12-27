import { AvaliadorSintaticoMapler, LexadorMapler } from "../fontes";
import { InterpretadorMaplerComDepuracao } from "../fontes/interpretador";

describe('Interpretador com Depuração (Mapler)', () => {
    let lexador: LexadorMapler;
    let avaliadorSintatico: AvaliadorSintaticoMapler;
    let interpretador: InterpretadorMaplerComDepuracao;

    describe('interpretar()', () => {
        beforeEach(() => {
            lexador = new LexadorMapler();
            avaliadorSintatico = new AvaliadorSintaticoMapler();
        });

        describe('Sem pontos de parada', () => {
            let _saidas: string[] = [];
            const funcaoSaida = (texto: string) => {
                _saidas.push(texto);
            }

            beforeEach(() => {
                _saidas = [];
                interpretador = new InterpretadorMaplerComDepuracao(
                    process.cwd(),
                    funcaoSaida,
                    funcaoSaida
                );
            });

            it('Trivial', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever "olá mundo";',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                let execucaoFinalizada: boolean = false;
                interpretador.finalizacaoDaExecucao = () => {
                    execucaoFinalizada = true;
                }

                interpretador.prepararParaDepuracao(retornoAvaliadorSintatico.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(interpretador.pontoDeParadaAtivo).toBe(false);
                expect(execucaoFinalizada).toBe(true);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toContain("olá mundo");
            });

            it('Múltiplos escrever', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever "linha 1";',
                    'escrever "linha 2";',
                    'escrever "linha 3";',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                let execucaoFinalizada: boolean = false;
                interpretador.finalizacaoDaExecucao = () => {
                    execucaoFinalizada = true;
                }

                interpretador.prepararParaDepuracao(retornoAvaliadorSintatico.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(execucaoFinalizada).toBe(true);
                expect(_saidas.length).toBe(3);
                expect(_saidas[0]).toBe('linha 1');
                expect(_saidas[1]).toBe('linha 2');
                expect(_saidas[2]).toBe('linha 3');
            });

            it('Operações binárias', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'resultado: inteiro;',
                    'inicio',
                    'resultado <- 10 + 5;',
                    'escrever resultado;',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                let execucaoFinalizada: boolean = false;
                interpretador.finalizacaoDaExecucao = () => {
                    execucaoFinalizada = true;
                }

                interpretador.prepararParaDepuracao(retornoAvaliadorSintatico.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(execucaoFinalizada).toBe(true);
                expect(_saidas).toHaveLength(1);
                expect(_saidas[0]).toBe('15');
            });

            it('Atribuição de variável simples', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'nome: cadeia;',
                    'inicio',
                    'nome <- "Mapler";',
                    'escrever nome;',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                let execucaoFinalizada: boolean = false;
                interpretador.finalizacaoDaExecucao = () => {
                    execucaoFinalizada = true;
                }

                interpretador.prepararParaDepuracao(retornoAvaliadorSintatico.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(execucaoFinalizada).toBe(true);
                expect(_saidas[0]).toBe('Mapler');
            });

            it('Acesso a índice de vetor', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'numeros: vetor [0..2] de inteiro;',
                    'i: inteiro;',
                    'inicio',
                    'numeros[0] <- 10;',
                    'numeros[1] <- 20;',
                    'escrever numeros[0];',
                    'escrever numeros[1];',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                let execucaoFinalizada: boolean = false;
                interpretador.finalizacaoDaExecucao = () => {
                    execucaoFinalizada = true;
                }

                interpretador.prepararParaDepuracao(retornoAvaliadorSintatico.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(execucaoFinalizada).toBe(true);
            });

            it('Declaração InicioAlgoritmo', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = await avaliadorSintatico.analisar(retornoLexador, -1);

                let execucaoFinalizada: boolean = false;
                interpretador.finalizacaoDaExecucao = () => {
                    execucaoFinalizada = true;
                }

                interpretador.prepararParaDepuracao(retornoAvaliadorSintatico.declaracoes);
                await interpretador.instrucaoContinuarInterpretacao();

                expect(execucaoFinalizada).toBe(true);
            });
        });
    });
});
