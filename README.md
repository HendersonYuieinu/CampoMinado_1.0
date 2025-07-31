# Campo minado
Um jogo de campo minado simples, utilizando apenas ferramentas de front-end(HTML, CSS, JAVASCRIPT). Nesta primeira versão não tem um menu para selecionar a dificuldade, e nem um banco para guardar recordes e tals, tendo apenas o jogo com uma grade 15x15 com 45 bombas.

# Funcionamento
o jogo consiste em um canva no html, com uma matriz de items em camada, onde temos a primeira camada, onde vai ficar a marcação dos blocos, numeros e bombas. A segunda camada, chamada de lona, é a que vai esconder o conteúdo até ocorrer um evento de click e por ultimo a camada das bandeiras, que serve para marcar onde fica as bandeiras colocadas pelo jogador. Tudo consiste em 0 e 1 em todas as camadas para demarcar ausencia e presenca de algo.

## Camada Table 1
Aqui fica a marcação principal, ou seja, se tem bomba ou não. Primeiro a gente define essa camada, com todos os valores preenchidos com 0 e depois usamos uma função que vai preencher lugares aleatórios dessa matriz com 1, conforme a quantidade de bombas definidas para o jogo.
Depois de definir isso, usamos outra função que vai fazer uma contagem de quantas bombas tem em cada bloco que não seja uma bomba, com isso ele vai no elemento do canva na posição desse bloco e vai escrever o numero da contagem.
Por ultimo utilizo uma função que vai buscar cada bloco marcado com 1 na primeira camada e desenhar o sprite da bomba dentro do bloco no canva.

## Camada 2 Lona
Essa camada vai servir apenas para esconder as bombas e os numeros, então é criado uma matriz do mesmo tamanho da principal, preenchida com 1. O 1 vai marcar onde a lona ainda está ativa e como no inicio toda a table vai está coberta, todos os elementos vão ser 1 até que seja clicado com o botao esquerdo do mouse, o qual vai revelar e mostrar o conteudo dela, caso seja uma bomba, o jogo acaba, caso não for, vai ser revelado normalmente.
Se o local não tiver contabilizado nenhuma bomba próxima, ele vai buscar ao redor outros locais que tambem não contabilizaram e criar um efeito cadeia, revelando varios espaços vazios.

## Camada 3 FlagLayer
Essa camada vai ser usada para marcar as bandeiras postas, iniciando com nenhuma e quando o jogador clicar com o botão direito do mouse, vai ser colocado uma bandeira. Nota que se todos os locais com bomba tiverem uma bandeira no mesmo local, o jogo acaba, sendo o jogador vencedor.

# Pontuacões
O jogo recompensa o jogador com quatro quantidades de pontos: 
### espaço com até 2 bombas ao redor - 50 pontos;
### espaço com até 5 bombas ao redor - 150 pontos;
### espaço com 6 ou mais bombas ao redor - 300 pontos;
### se o espaço não tiver bombas ao redor e fizer o efeito cadeia você recebe 600 pontos;
