import { AvaliadorSintaticoMapler } from '../fontes/avaliador-sintatico';
import { InterpretadorMapler } from "../fontes/interpretador";
import { LexadorMapler } from '../fontes/lexador';
import { ResolvedorMapler } from '../fontes/resolvedor';

describe('Interpretador', () => {
    describe('interpretar()', () => {
        let lexador: LexadorMapler;
        let avaliadorSintatico: AvaliadorSintaticoMapler;
        let resolvedor: ResolvedorMapler;
        let interpretador: InterpretadorMapler;

        let _saidas: string[] = [];
        const funcaoSaida = (texto: string) => {
            _saidas.push(texto);
        }

        beforeEach(() => {
            lexador = new LexadorMapler();
            avaliadorSintatico = new AvaliadorSintaticoMapler();
            resolvedor = new ResolvedorMapler();
            interpretador = new InterpretadorMapler(process.cwd(), false, funcaoSaida, funcaoSaida);
        });

        describe('Cenários de sucesso', () => {
            it('Trivial', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'fim'
                ], -1);
                
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Trivial mesma linha', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis inicio escrever "olá mundo"; fim',
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Escrever simples', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever "olá mundo";',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Escrever com variável', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'idade: inteiro;',
                    'nome, sobrenome: cadeia;',
                    'inicio',
                    'idade <- 10;',
                    'escrever "Minha idade é: ", idade;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Escrever lógicos e outros textos', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever "";',
                    'escrever "Mapler1 ", "Mapler2";',
                    'escrever "Mapler3 ", 10.2;',
                    'escrever verdadeiro;',
                    'escrever falso;',
                    'escrever nao verdadeiro;',
                    'escrever nao falso;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Enquanto', async () => {
                const retornoLexador = lexador.mapear([
                    "variaveis",
                    "i: inteiro;",
                    "inicio",
                    "i <- 1;",
                    "enquanto i <= 5 faca",
                    "escrever i;",
                    "i <- i + 1;",
                    "fim enquanto;",
                    "fim"
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Se', async () => {
                const retornoLexador = lexador.mapear([
                    "variaveis",
                    "inicio",
                    "se 10 > 5 entao",
                    "escrever \"Olá\";",
                    "fim se;",
                    "fim",
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Se/Senao', async () => {
                const retornoLexador = lexador.mapear([
                    "variaveis",
                    "inicio",
                    "se 10 > 5 entao",
                    "escrever \"10 é maior que 5\";",
                    "senao",
                    "escrever \"10 não é maior que 5\";",
                    "fim se;",
                    "fim",
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });

            it('Modulo', async () => {
                let _saidas = "";
                interpretador.funcaoDeRetorno = (saida: string) => {
                    _saidas += saida;
                }

                const retornoLexador = lexador.mapear([
                    "variaveis",
                    "dizerOla: modulo;",
                    "inicio",
                    "dizerOla;",
                    "fim",
                    "modulo dizerOla",
                    "escrever \"Olá, mundo!\";",
                    "fim modulo;"
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toBe('Olá, mundo!');
            });

            it('Operadores de comparação', async () => {
                _saidas = [];
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever 10 > 5;',
                    'escrever 10 >= 10;',
                    'escrever 5 < 10;',
                    'escrever 5 <= 5;',
                    'escrever 5 <> 10;',
                    'escrever 10 = 10;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(6);
            });

            it('Divisão e subtração', async () => {
                _saidas = [];
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'resultado: inteiro;',
                    'inicio',
                    'resultado <- 20 / 4;',
                    'escrever resultado;',
                    'resultado <- 10 - 3;',
                    'escrever resultado;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('5');
                expect(_saidas[1]).toBe('7');
            });

            it('Multiplicação de texto por número', async () => {
                _saidas = [];
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever "abc" * 3;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('abcabcabc');
            });

            it('Multiplicação de número por texto', async () => {
                _saidas = [];
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever 2 * "xyz";',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('xyzxyz');
            });

            it('Operações aritméticas básicas', async () => {
                _saidas = [];
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever 10 + 5;',
                    'escrever 10 - 5;',
                    'escrever 10 * 2;',
                    'escrever 10 / 2;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas).toHaveLength(4);
                expect(_saidas[0]).toBe('15');
                expect(_saidas[1]).toBe('5');
                expect(_saidas[2]).toBe('20');
                expect(_saidas[3]).toBe('5');
            });

            it('Concatenação de texto com adição', async () => {
                _saidas = [];
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever "Olá " + "Mundo";',
                    'escrever "Número: " + 42;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
                expect(_saidas[0]).toBe('Olá Mundo');
                expect(_saidas[1]).toBe('Número: 42');
            });

            it('Declaração InicioAlgoritmo', async () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedor.resolver(retornoAvaliadorSintatico.declaracoes);
                const retornoInterpretador = await interpretador.interpretar(retornoResolvedor);

                expect(retornoInterpretador.erros).toHaveLength(0);
            });
        });
    });
});
