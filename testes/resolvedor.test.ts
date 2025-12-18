import { LexadorMapler } from '../fontes/lexador';
import { AvaliadorSintaticoMapler } from '../fontes/avaliador-sintatico';
import { ResolvedorMapler } from '../fontes/resolvedor';

describe('Resolvedor (Mapler)', () => {
    let lexadorMapler: LexadorMapler;
    let avaliadorSintaticoMapler: AvaliadorSintaticoMapler;
    let resolvedorMapler: ResolvedorMapler;

    describe('resolver()', () => {
        beforeEach(() => {
            lexadorMapler = new LexadorMapler();
            avaliadorSintaticoMapler = new AvaliadorSintaticoMapler();
            resolvedorMapler = new ResolvedorMapler();
        });

        describe('Cenários de sucesso', () => {
            it('Resolução de módulos', async () => {
                const espiaoVisitarDeclaracaoFutura = jest.spyOn(resolvedorMapler, 'visitarDeclaracaoFutura');

                const retornoLexador = lexadorMapler.mapear([
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

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
                expect(retornoResolvedor).toHaveLength(12);
                expect(espiaoVisitarDeclaracaoFutura).toHaveBeenCalledTimes(4);
            });

            it('Resolução de programa simples sem módulos', async () => {
                const retornoLexador = lexadorMapler.mapear([
                    'variaveis',
                    'nome: cadeia;',
                    'idade: inteiro;',
                    'inicio',
                    'nome <- "Mapler";',
                    'idade <- 10;',
                    'escrever nome;',
                    'escrever idade;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
                expect(retornoResolvedor.length).toBeGreaterThan(0);
            });

            it('Resolução com estruturas de controle', async () => {
                const retornoLexador = lexadorMapler.mapear([
                    'variaveis',
                    'i: inteiro;',
                    'inicio',
                    'i <- 0;',
                    'enquanto i < 5 faca',
                    '    escrever i;',
                    '    i <- i + 1;',
                    'fim enquanto;',
                    'se i = 5 entao',
                    '    escrever "Concluído";',
                    'fim se;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
                expect(retornoResolvedor.length).toBeGreaterThan(0);
            });

            it('Resolução com expressões binárias', async () => {
                const retornoLexador = lexadorMapler.mapear([
                    'variaveis',
                    'resultado: inteiro;',
                    'inicio',
                    'resultado <- 10 + 5 * 2;',
                    'escrever resultado;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
                expect(retornoResolvedor.length).toBeGreaterThan(0);
            });

            it('Resolução com variáveis e literais', async () => {
                const retornoLexador = lexadorMapler.mapear([
                    'variaveis',
                    'texto: cadeia;',
                    'numero: real;',
                    'flag: logico;',
                    'inicio',
                    'texto <- "teste";',
                    'numero <- 3.14;',
                    'flag <- verdadeiro;',
                    'escrever texto, numero, flag;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
                expect(retornoResolvedor.length).toBeGreaterThan(0);
            });

            it('Resolução com expressões lógicas', async () => {
                const retornoLexador = lexadorMapler.mapear([
                    'variaveis',
                    'a, b: logico;',
                    'inicio',
                    'a <- verdadeiro;',
                    'b <- falso;',
                    'se a e nao b entao',
                    '    escrever "Condição atendida";',
                    'fim se;',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
                expect(retornoResolvedor.length).toBeGreaterThan(0);
            });

            it('Resolução com módulo único', async () => {
                const retornoLexador = lexadorMapler.mapear([
                    'variaveis',
                    'saudacao: modulo;',
                    'inicio',
                    'saudacao;',
                    'fim',
                    'modulo saudacao',
                    'escrever "Olá!";',
                    'fim modulo;'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
                expect(retornoResolvedor.length).toBeGreaterThan(0);
            });

            it('Resolução de programa vazio', async () => {
                const retornoLexador = lexadorMapler.mapear([
                    'variaveis',
                    'inicio',
                    'fim'
                ], -1);

                const retornoAvaliadorSintatico = avaliadorSintaticoMapler.analisar(retornoLexador, -1);
                const retornoResolvedor = await resolvedorMapler.resolver(retornoAvaliadorSintatico.declaracoes);

                expect(retornoResolvedor).toBeTruthy();
            });
        })
    })
})