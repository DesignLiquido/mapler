import { LexadorMapler } from '../fontes/lexador';

import tiposDeSimbolos from "../fontes/tipos-de-simbolos/lexico-regular";

describe('Lexador (Mapler)', () => {
    describe('mapear()', () => {
        let lexador: LexadorMapler;

        beforeEach(() => {
            lexador = new LexadorMapler();
        });

        describe('Cenários de sucesso', () => {
            it('Sucesso - Código vazio', () => {
                const resultado = lexador.mapear([''], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(0);
            });

            it('Sucesso - estrutura mínima', () => {
                const resultado = lexador.mapear([
                    "variaveis",
                    "inicio",
                    "fim"
                ], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(3);
                expect(resultado.simbolos).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ tipo: tiposDeSimbolos.VARIAVEIS }),
                        expect.objectContaining({ tipo: tiposDeSimbolos.INICIO }),
                        expect.objectContaining({ tipo: tiposDeSimbolos.FIM }),
                    ])
                );
            });

            it('Sucesso - código com comentários', () => {
                const resultado = lexador.mapear([
                    '// Estrutura Básica:',
                    'variaveis',
                    '    // Nesta área declaramos as variáveis',
                    '    // utilizadas no algoritmo',
                    '    var_nome: cadeia;',
                    'inicio // A partir daqui começa o algoritmo',
                    '    escrever "Digite seu nome:";',
                    '    ler var_nome;',
                    '    escrever "Olá ", var_nome;',
                    'fim // Esta instrução indica o fim do algoritmo'
                ], -1);

                expect(resultado).toBeTruthy();
                expect(resultado.simbolos).toHaveLength(23);
                const comentarios = resultado.simbolos.filter(s => s.tipo === tiposDeSimbolos.COMENTARIO);
                expect(comentarios).toHaveLength(5);
            });
        });
    });
});
