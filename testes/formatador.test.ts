import * as sistemaOperacional from 'os';

import { AvaliadorSintaticoMapler } from '../fontes/avaliador-sintatico/avaliador-sintatico-mapler';
import { FormatadorMapler } from '../fontes/formatador/formatador-mapler';
import { LexadorMapler } from '../fontes/lexador/lexador-mapler';

describe('Formatadores > Portugol Studio', () => {
    const formatador = new FormatadorMapler(sistemaOperacional.EOL);
    const avaliadorSintatico = new AvaliadorSintaticoMapler();
    const lexador = new LexadorMapler();


    it('Olá Mundo', () => {
        const retornoLexador = lexador.mapear([
            'variaveis',
            'inicio',
            'escrever "Olá mundo";',
            'fim'
        ], -1);
        const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

        const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
        const linhasResultado = resultado.split(sistemaOperacional.EOL);

        expect(linhasResultado).toHaveLength(5)
    });
    it('Se - senao', () => {
        const retornoLexador = lexador.mapear([
            'variaveis',
                'senha: cadeia;',
                'senha_correta: cadeia;',
            'inicio',
                'senha_correta <- "12345";',
                'escrever "Digite a senha: ";',
                'ler senha;',

                'se senha = senha_correta entao',
                    'escrever "Senha correta!";',
                'senao',
                    'escrever "Senha incorreta!";',
                'fim se;',
            'fim'
        ], -1);
        const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

        const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
        const linhasResultado = resultado.split(sistemaOperacional.EOL);

        expect(linhasResultado).toHaveLength(14)
    });

    describe('Tipos de dados', () => {
        it('Numéricos', () => {
            const retornoLexador = lexador.mapear([
                'variaveis',
                    'var_inteiro: inteiro;',
                    'var_real: real;',
                'inicio',
                    'var_inteiro <- -1;',
                    'var_real <- 2.5;',
                    'var_real <- 2.0 + var_inteiro;',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

            const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
            const linhasResultado = resultado.split(sistemaOperacional.EOL);

            expect(linhasResultado).toHaveLength(10)
        });
        it('Booleano', () => {
            const retornoLexador = lexador.mapear([
                'variaveis',
                    'var_logico: logico;',
                'inicio',
                    'var_logico <- verdadeiro;',
                    'escrever var_logico;',

                    // Falso
                    'var_logico <- 1 >= 2;',
                    'escrever var_logico;',

                    // Verdadeiro
                    'var_logico <- nao var_logico;',
                    'escrever var_logico;',

                    // Falso
                    'escrever nao var_logico;',
                    // Verdadeiro
                    'escrever var_logico;',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

            const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
            const linhasResultado = resultado.split(sistemaOperacional.EOL);

            expect(linhasResultado).toHaveLength(15)
        });
        it('Literais', () => {
            const retornoLexador = lexador.mapear([
                'variaveis',
                    'cidade: cadeia;',
                    'letra: caractere;',
                'inicio',
                    'cidade <- "São Luís - MA";',
                    'letra <- "c";',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

            const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
            const linhasResultado = resultado.split(sistemaOperacional.EOL);

            expect(linhasResultado).toHaveLength(8)
        });
    })

    describe('Estrutura de repetições', () => {
        it('Para', () => {
            const retornoLexador = lexador.mapear([
                'variaveis',
                    'var_inteiro: inteiro;',
                    'var_real: real;',
                'inicio',
                    'para i de 1 ate 5 passo 1 faca',
                        'escrever i;',
                    'fim para;',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

            const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
            const linhasResultado = resultado.split(sistemaOperacional.EOL);

            expect(linhasResultado).toHaveLength(9)
        });
        it('Enquanto', () => {
            const retornoLexador = lexador.mapear([
                'variaveis',
                    'i: inteiro;',
                'inicio',
                    'i <- 1;',
                    'enquanto i <= 5 faca',
                        'escrever i;',
                        'i <- i + 1;',
                    'fim enquanto;',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

            const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
            const linhasResultado = resultado.split(sistemaOperacional.EOL);

            expect(linhasResultado).toHaveLength(10)
        });
        it('Repita', () => {
            const retornoLexador = lexador.mapear([
                'variaveis',
                    'x: inteiro;',
                'inicio',
                    'x<-1;',
                    'repita',
                        'escrever x;',
                        'x<- x+1;',
                    'ate (x <= 5);',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

            const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
            const linhasResultado = resultado.split(sistemaOperacional.EOL);

            expect(linhasResultado).toHaveLength(10)
        });
    })

    it('Vetor', () => {
        const retornoLexador = lexador.mapear([
            'variaveis',
                'numeros: vetor [1..9] de inteiro;',
                'i: inteiro;',
            'inicio',
                'para i de 1 ate 9 passo 1 faca',
                    'numeros[i] <- 4;',
                'fim para;',

                'escrever "Vetor gerado: ";',
                'para i de 1 ate 9 passo 1 faca',
                    'escrever "Posição ", i, " = ", numeros[i];',
                'fim para;',

                'i <- 9;',
                'escrever "Vetor gerado invertido: ";',
                'enquanto i >= 1 faca',
                    'escrever "Posição ", i, " = ", numeros[i];',
                    'i <- i-1;',
                'fim enquanto;',
            'fim'
        ], -1);
        const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

        const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
        const linhasResultado = resultado.split(sistemaOperacional.EOL);

        expect(linhasResultado).toHaveLength(19)
    })
})