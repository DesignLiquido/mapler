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
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

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
        });
    });
});
