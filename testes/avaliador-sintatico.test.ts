import { LexadorMapler } from '../fontes/lexador';
import { AvaliadorSintaticoMapler } from '../fontes/avaliador-sintatico';

describe('Avaliador sintático (Mapler)', () => {
    describe('analisar()', () => {
        let lexador: LexadorMapler;
        let avaliadorSintatico: AvaliadorSintaticoMapler;

        beforeEach(() => {
            lexador = new LexadorMapler();
            avaliadorSintatico = new AvaliadorSintaticoMapler();
        });

        describe('Casos de Sucesso', () => {
            it('Enquanto', () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    '    i: inteiro;',
                    'inicio',
                    '    i <- 1;',
                    '    // Enquanto essa condição for verdadeira',
                    '    enquanto i <= 5 faca',
                    '        // Execute esse trecho de código',
                    '        escrever i;',
                    '        i <- i + 1;',
                    '    fim enquanto;',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
    
                expect(retornoAvaliadorSintatico).toBeTruthy();
                expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
            });

            it('Olá Mundo', () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    'inicio',
                    'escrever "Olá mundo";',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
    
                expect(retornoAvaliadorSintatico).toBeTruthy();
                expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(1);
            });

            it('Código com comentários', () => {
                const retornoLexador = lexador.mapear([
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

                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
    
                expect(retornoAvaliadorSintatico).toBeTruthy();
                expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(9);
            });

            it('Módulos', () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    '    criarConta: modulo;',
                    '    depositar: modulo;',
                    '    sacar: modulo;',
                    '    deposito: real;',
                    '    verificarSaldo: modulo;',
                    '    saldo: real;',
                    '    saque: real;',
                    '    titular: cadeia;',
                    '    escolha: inteiro;',
                    'inicio',
                    '    escrever "Bem vindo ao sistema bancário em portugol: ";',
                    '    repita',
                    '        escrever "Escolha uma operação: ";',
                    '        escrever "1. Criar conta: ";',
                    '        escrever "2. Depositar: ";',
                    '        escrever "3. Sacar: ";',
                    '        escrever "4. Verificar saldo: ";',
                    '        escrever "0. Sair: ";',
                    '        escrever "Escolha uma operação: ";',
                    '        ler escolha;',
                    '        se escolha = 1 entao',
                    '            criarConta;',
                    '        fim se;',
                    '        se escolha = 2 entao',
                    '            depositar;',
                    '        fim se;',
                    '        se escolha = 3 entao',
                    '            sacar;',
                    '        fim se;',
                    '        se escolha = 4 entao',
                    '            verificarSaldo;',
                    '        fim se;',
                    '        se escolha = 0 entao',
                    '            escrever "Saindo...";',
                    '        fim se;',
                    '    ate (escolha > 0 e escolha < 4);',
                    'fim',
                    'modulo criarConta',
                    '    saldo <- 0.0;',
                    '    escrever "Insira o nome do títular";',
                    '    ler titular;',
                    '    escrever "Insira o saldo inicial da conta";',
                    '    ler saldo;',
                    '    escrever "Nome do titular: ", titular,"Saldo inicial: ", saldo;',
                    'fim modulo;',
                    'modulo depositar',
                    '    escrever "Insira o valor a ser depositado";',
                    '    ler deposito;',
                    '    saldo <- saldo + deposito;',
                    '    escrever "Saldo pós deposito: ", saldo;',
                    'fim modulo;',
                    'modulo sacar',
                    '    escrever "Insira o valor a ser sacado";',
                    '    ler saque;',
                    '    se saque > saldo entao',
                    '        escrever "Impossível sacar mais do que o valor do saldo: ";',
                    '    senao',
                    '        saldo <- saldo - saque;',
                    '        escrever "Saldo pos saque: ", saldo;',
                    '    fim se;',
                    'fim modulo;',
                    'modulo verificarSaldo',
                    '    escrever "Valor atual do saldo: ", saldo;',
                    'fim modulo;'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
    
                expect(retornoAvaliadorSintatico).toBeTruthy();
                expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(11);
            });

            it('Para', () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    '    i: inteiro;',
                    'inicio',
                    '    para i de 0 ate 10 passo 1 faca',
                    '        escrever i;',
                    '    fim para;',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
    
                expect(retornoAvaliadorSintatico).toBeTruthy();
                expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(2);
            });
    
            it('Repita', () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    '    x:inteiro;',
                    'inicio',
                    '    x<-1;',
                    '    // Executa o trecho de código primeiro',
                    '    // Depois repete enquanto a condição for verdadeira',
                    '    repita',
                    '        escrever x;',
                    '        x<- x+1;',
                    '    ate (x <= 5);',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
    
                expect(retornoAvaliadorSintatico).toBeTruthy();
                expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
            });

            it('Se', () => {
                const retornoLexador = lexador.mapear([
                    'variaveis',
                    '    idade: inteiro;',
                    'inicio',
                    '    idade <- 17;',
                    '    se idade >= 16 entao',
                    '        escrever "Pode votar!";',
                    '        se idade >= 18 entao',
                    '            escrever "Pode votar e dirigir também!";',
                    '        senao',
                    '            escrever "Pode votar, mas não dirigir!";',
                    '        fim se;',
                    '    senao',
                    '        escrever "Não pode votar, nem dirigir!";',
                    '    fim se;',
                    'fim'
                ], -1);
                const retornoAvaliadorSintatico = avaliadorSintatico.analisar(retornoLexador, -1);
    
                expect(retornoAvaliadorSintatico).toBeTruthy();
                expect(retornoAvaliadorSintatico.declaracoes).toHaveLength(3);
            });
        });
    });
});
