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

        it('Sucesso - Olá Mundo', () => {
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
    });
});
