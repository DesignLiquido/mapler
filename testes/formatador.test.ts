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
        console.log(resultado)
        console.log(linhasResultado)
    });
})