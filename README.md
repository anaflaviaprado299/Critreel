Vídeo de demonstração do projeto CritReel:
https://github.com/anaflaviaprado299/Critreel/blob/main/critreel/critreel_video/critreel_video.mp4 

O CritReel é um sistema desenvolvido com o objetivo de divulgar, avaliar e criticar produções cinematográficas amadoras. Os usuários podem visualizar os filmes cadastrados, cadastrar novos, curtir, avaliar e criticar. É possível criticar filmes que estejam ou não cadastrados na plataforma.
O projeto é composto por três partes principais: projeto Ionic (critreel_ionic), API Java (critreel_api) e banco de dados (critreel_bd), que funcionam de forma integrada. Nesse repositório, também há a documentação do sistema (critreel_documentacao) e um vídeo mostrando todas as funcionalidades desenvolvidas (critreel_video).
O projeto utiliza as seguintes tecnologias:

Ionic com Angular no frontend


Java com Spring Boot no backend (API)


Banco de dados relacional, com scripts SQL para criação das tabelas


Para executar o projeto, é necessário inicialmente configurar o banco de dados utilizando os scripts SQL disponíveis na pasta critreel_bd, criando o banco e suas tabelas no. Em seguida, deve-se acessar a pasta critreel_api e executar a API Java, garantindo que o arquivo de configuração esteja corretamente ajustado com as informações do banco de dados; para isso, é necessário ter o Java e o Maven instalados e iniciar a aplicação com o comando mvn spring-boot:run. Por fim, o frontend Ionic pode ser executado acessando a pasta critreel_ionic, instalando as dependências do projeto com o comando npm install e, após a conclusão, iniciando a aplicação com o comando ionic serve, o que permitirá o acesso ao sistema pelo navegador. O funcionamento completo do projeto depende da execução conjunta do banco de dados, da API Java e do frontend Ionic.
