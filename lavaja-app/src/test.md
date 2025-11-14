1. Capa

nome do sistema: LavaJá

Versão: 1.0

Data: 14/11/2025

2. índice 
(ainda não temos)

3. Introdução rápida

O que é o sistema em uma frase
R: Um Saas, para lava rápidos. Onde temos por parte dos lava rápidos os cadastros de serviços e um painel gerencial e por parte dos clientes, agendamentos visualização de históricos...

Para quem é o manual
r: o manual serve tanto para lava-rápidos que querem entender melhor as funcionalidades do sistema e aprenderem a extrair o máximo que puderem dele, tanto para usuários, que mesmo com a interface mininamalista e intuitiva do sistema, precisem de mais apoio para encontrarem algumas funcionalidades

4. Como acesar
URL do sistema
R: Hoje o sistema está disponível no meu GitHub. Caso queira utilizar é necessário clonar o repositório: https://github.com/Pietro-dev/LavaJa.git. Para rodar o aplicativo é necessário:
- ter uma IDE que execute aplicações Java, recomendo o intelij IDEA community
- instalar o VSCode para rodar o código do front-end
- ter o JDK 22 instalado 
- ter o node v24.11.1
- yarn 1.22.22
- instalar o postgres sql e criar um database chamado lavaja 

com tudo isso instalado, o usuário pode abrir a pasta lavaja-api no intelij e configurar no arquivo application.properties o banco de dados. Passando o usuário que atribuiu na instalação do banco e a senha. Feito isso, basta iniciar a aplicação

com o backend rodando, a pasta lavaja-app deve ser aberta no vscode e no terminal integrado, dentro da pasta, o comando yarn dev iniciará o front end da aplicação