# Resolvedor

Um resolvedor executa após a avaliação sintática, para: 

- Resolver referências marcadas como futuras;
- Trazer declarações de módulos antes do bloco de execução, antes da interpretação.

Em Mapler, isso acontece porque módulos (funções) são declarados após o bloco principal de execução. Em Delégua, as declarações precisam vir antes da execução propriamente dita. No entanto, não é papel do avaliador sintático colocar isso em ordem, até porque a avaliação sintática serve a diferentes propósitos, como a formatação de código, por exemplo. 