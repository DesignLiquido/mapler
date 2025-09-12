import * as sistemaOperacional from 'os';

import { AvaliadorSintaticoMapler } from '../fontes/avaliador-sintatico/avaliador-sintatico-mapler';
import { FormatadorMapler } from '../fontes/formatador/formatador-mapler';
import { LexadorMapler } from '../fontes/lexador/lexador-mapler';

describe('Formatadores > Mapler', () => {
    const formatador = new FormatadorMapler(sistemaOperacional.EOL);
    const avaliadorSintatico = new AvaliadorSintaticoMapler();
    const lexador = new LexadorMapler();
    const tamanhoIndentacao = 4


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
        expect(linhasResultado[2]).toBe(`${" ".repeat(tamanhoIndentacao)}escrever "Olá mundo";`)
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
        expect(linhasResultado[1]).toBe(`${" ".repeat(tamanhoIndentacao)}senha: cadeia;`)
        expect(linhasResultado[2]).toBe(`${" ".repeat(tamanhoIndentacao)}senha_correta: cadeia;`)
        expect(linhasResultado[4]).toBe(`${" ".repeat(tamanhoIndentacao)}senha_correta <- "12345";`)
        expect(linhasResultado[5]).toBe(`${" ".repeat(tamanhoIndentacao)}escrever "Digite a senha: ";`)
        expect(linhasResultado[6]).toBe(`${" ".repeat(tamanhoIndentacao)}ler senha`)
        expect(linhasResultado[7]).toBe(`${" ".repeat(tamanhoIndentacao)}se senha = senha_correta entao`)
        expect(linhasResultado[8]).toBe(`${" ".repeat(tamanhoIndentacao * 2)}escrever "Senha correta!";`)
        expect(linhasResultado[9]).toBe(`${" ".repeat(tamanhoIndentacao)}senao`)
        expect(linhasResultado[10]).toBe(`${" ".repeat(tamanhoIndentacao * 2)}escrever "Senha incorreta!";`)
        expect(linhasResultado[11]).toBe(`${" ".repeat(tamanhoIndentacao)}fim se;`)
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

            expect(linhasResultado).toHaveLength(9)
            expect(linhasResultado[1]).toBe(`${" ".repeat(tamanhoIndentacao)}var_inteiro: inteiro;`)
            expect(linhasResultado[2]).toBe(`${" ".repeat(tamanhoIndentacao)}var_real: real;`)
            expect(linhasResultado[4]).toBe(`${" ".repeat(tamanhoIndentacao)}var_inteiro <- -1;`)
            expect(linhasResultado[5]).toBe(`${" ".repeat(tamanhoIndentacao)}var_real <- 2.5;`)
            expect(linhasResultado[6]).toBe(`${" ".repeat(tamanhoIndentacao)}var_real <- 2 + var_inteiro;`)
        });
        it('Booleano', () => {
            const retornoLexador = lexador.mapear([
                'variaveis',
                'var_logico: logico;',
                'inicio',
                'var_logico <- verdadeiro;',
                'escrever var_logico;',
                'var_logico <- 1 >= 2;',
                'escrever var_logico;',
                'var_logico <- nao var_logico;',
                'escrever var_logico;',
                'escrever nao var_logico;',
                'escrever var_logico;',
                'fim'
            ], -1);
            const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);

            const resultado = formatador.formatar(retornoAvaliadorSintatico.declaracoes);
            const linhasResultado = resultado.split(sistemaOperacional.EOL);

            expect(linhasResultado).toHaveLength(13)
            expect(linhasResultado[1]).toBe(`${" ".repeat(tamanhoIndentacao)}var_logico: logico;`)
            expect(linhasResultado[3]).toBe(`${" ".repeat(tamanhoIndentacao)}var_logico <- verdadeiro;`)
            expect(linhasResultado[4]).toBe(`${" ".repeat(tamanhoIndentacao)}escrever var_logico;`)
            expect(linhasResultado[5]).toBe(`${" ".repeat(tamanhoIndentacao)}var_logico <- 1 >= 2;`)
            expect(linhasResultado[6]).toBe(`${" ".repeat(tamanhoIndentacao)}escrever var_logico;`)
            expect(linhasResultado[7]).toBe(`${" ".repeat(tamanhoIndentacao)}var_logico <- nao var_logico;`)
            expect(linhasResultado[8]).toBe(`${" ".repeat(tamanhoIndentacao)}escrever var_logico;`)
            expect(linhasResultado[9]).toBe(`${" ".repeat(tamanhoIndentacao)}escrever nao var_logico;`)
            expect(linhasResultado[10]).toBe(`${" ".repeat(tamanhoIndentacao)}escrever var_logico;`)
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
            expect(linhasResultado[1]).toBe(`${" ".repeat(tamanhoIndentacao)}cidade: cadeia;`)
            expect(linhasResultado[2]).toBe(`${" ".repeat(tamanhoIndentacao)}letra: cadeia;`)
            expect(linhasResultado[4]).toBe(`${" ".repeat(tamanhoIndentacao)}cidade <- "São Luís - MA";`)
            expect(linhasResultado[5]).toBe(`${" ".repeat(tamanhoIndentacao)}letra <- "c";`)
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
            expect(linhasResultado[1]).toBe(`${" ".repeat(tamanhoIndentacao)}var_inteiro: inteiro;`)
            expect(linhasResultado[2]).toBe(`${" ".repeat(tamanhoIndentacao)}var_real: real;`)
            expect(linhasResultado[4]).toBe(`${" ".repeat(tamanhoIndentacao)}para i de 1 ate 5 passo 1 faca`)
            expect(linhasResultado[5]).toBe(`${" ".repeat(tamanhoIndentacao * 2)}escrever i;`)
            expect(linhasResultado[6]).toBe(`${" ".repeat(tamanhoIndentacao)}fim para;`)
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
            expect(linhasResultado[1]).toBe(`${" ".repeat(tamanhoIndentacao)}i: inteiro;`)
            expect(linhasResultado[3]).toBe(`${" ".repeat(tamanhoIndentacao)}i <- 1;`)
            expect(linhasResultado[4]).toBe(`${" ".repeat(tamanhoIndentacao)}enquanto i <= 5 faca`)
            expect(linhasResultado[5]).toBe(`${" ".repeat(tamanhoIndentacao * 2)}escrever i;`)
            expect(linhasResultado[6]).toBe(`${" ".repeat(tamanhoIndentacao * 2)}i <- i + 1;`)
            expect(linhasResultado[7]).toBe(`${" ".repeat(tamanhoIndentacao)}fim enquanto;`)
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
            expect(linhasResultado[1]).toBe(`${" ".repeat(tamanhoIndentacao)}x: inteiro;`)
            expect(linhasResultado[3]).toBe(`${" ".repeat(tamanhoIndentacao)}x <- 1;`)
            expect(linhasResultado[4]).toBe(`${" ".repeat(tamanhoIndentacao)}repita`)
            expect(linhasResultado[5]).toBe(`${" ".repeat(tamanhoIndentacao * 2)}escrever x;`)
            expect(linhasResultado[6]).toBe(`${" ".repeat(tamanhoIndentacao * 2)}x <- x + 1;`)
            expect(linhasResultado[7]).toBe(`${" ".repeat(tamanhoIndentacao)}ate (x <= 5);`)
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
        //TODO - o avaliador retorna undefined(esse "erro" não deverá ser corrigido nessa branch)
        //Bem como a falta de retorno)
        expect(linhasResultado[1]).toContain(`numeros: vetor [undefined..undefined];`)
        expect(linhasResultado[2]).toContain(`i: inteiro;`)
        expect(linhasResultado[4]).toContain(`para i de 1 ate 9 passo 1 faca`)
        expect(linhasResultado[5]).toContain(`numeros[i] <- 4;`)
        expect(linhasResultado[6]).toContain(`fim para;`)
        expect(linhasResultado[7]).toContain(`escrever "Vetor gerado: ";`)
        expect(linhasResultado[8]).toContain(`para i de 1 ate 9 passo 1 faca`)
        expect(linhasResultado[9]).toContain(`escrever "Posição ", i, " = ", numeros[i];`)
        expect(linhasResultado[10]).toContain(`fim para;`)
        expect(linhasResultado[11]).toContain(`i <- 9;`)
        expect(linhasResultado[12]).toContain(`escrever "Vetor gerado invertido: ";`)
        expect(linhasResultado[13]).toContain(`enquanto i >= 1 faca`)
        expect(linhasResultado[14]).toContain(`escrever "Posição ", i, " = ", numeros[i];`)
        expect(linhasResultado[15]).toContain(`i <- i - 1;`)
        expect(linhasResultado[16]).toContain(`fim enquanto;`)
    })
})