import { ReferenciaFutura } from '../fontes/construtos/referencia-futura';
import { SimboloInterface } from '@designliquido/delegua/interfaces';

describe('ReferenciaFutura', () => {
    let simbolo: SimboloInterface;
    let referenciaFutura: ReferenciaFutura;

    beforeEach(() => {
        simbolo = {
            tipo: 'IDENTIFICADOR',
            lexema: 'minhaFuncao',
            literal: null,
            linha: 10,
            hashArquivo: 12345
        };
        referenciaFutura = new ReferenciaFutura(simbolo);
    });

    it('Deve criar ReferenciaFutura com dados do símbolo', async () => {
        expect(referenciaFutura.linha).toBe(10);
        expect(referenciaFutura.hashArquivo).toBe(12345);
        expect(referenciaFutura.identificadorFuturo).toBe('minhaFuncao');
    });

    it('Método aceitar deve rejeitar com erro', async () => {
        await expect(referenciaFutura.aceitar(null)).rejects.toContain('nunca deve acontecer');
    });

    it('Método paraTexto deve retornar formatação', async () => {
        const resultado = referenciaFutura.paraTexto();
        expect(resultado).toBe('<referência-futura />');
    });

    it('Método paraTextoSaida deve lançar erro', async () => {
        expect(() => referenciaFutura.paraTextoSaida()).toThrow('Método não implementado');
    });

    it('Deve preservar informações de diferentes símbolos', async () => {
        const outroSimbolo: SimboloInterface = {
            tipo: 'IDENTIFICADOR',
            lexema: 'outraFuncao',
            literal: null,
            linha: 25,
            hashArquivo: 67890
        };
        const outraReferencia = new ReferenciaFutura(outroSimbolo);

        expect(outraReferencia.linha).toBe(25);
        expect(outraReferencia.hashArquivo).toBe(67890);
        expect(outraReferencia.identificadorFuturo).toBe('outraFuncao');
    });
});
