#### Cadastro Usuários Microservices - Node.js, MySQL, Redis, JWT, Prometheus e Grafana 🚀 🔄 🌐

Codificação em Javascript com NodeJS 20 para **PeoplePro - Teste Vaga Hospital Sírio Líbanês** de uma aplicação completa de gestão de usuários desenvolvida utilizando tecnologias de ponta como Node.js, MySQL, Redis, JWT, Prometheus e Grafana, alinhada aos princípios de engenharia de software modernos. Nosso foco é fornecer uma aplicação segura, escalável e fácil de manter, incorporando melhores práticas de orientação a objetos, arquitetura limpa, e padrões de design que promovem manutenção eficiente e expansão a longo prazo.


#### Arquitetura da Aplicação

Essa aplicação usa Clean Architecture, também chamada de arquitetura em camadas. Cada pasta representa uma camada ou responsabilidade distinta na aplicação:

- domain: Contém entidades e a lógica de negócio, como os modelos e regras que representam o domínio do sistema.
- infrastructure: Responsável por aspectos externos, como conexão ao banco de dados, serviços de terceiros e implementação de detalhes.
- interfaces: Pode representar os adaptadores para comunicação com a camada de aplicação, incluindo interfaces para uso nos repositórios ou para abstrações de serviços.
- middlewares: Contém funções intermediárias utilizadas para manipulação de requisições, como autenticação e autorização.
- routes: Define as rotas da API, conectando pontos de entrada do sistema com os handlers apropriados.

A aplicação é baseada em uma arquitetura de microserviços distribuídos, utilizando o modelo RESTful para comunicação entre os serviços. Cada componente do sistema segue o princípio de separação de responsabilidades (SRP), promovendo modularidade e escalabilidade.

- **API**: Desenvolvida em Node.js com o framework Express, a API gerencia as operações de autenticação e CRUD de usuários.
- **Banco de Dados**: MySQL é utilizado para persistência dos dados dos usuários, garantindo consistência e flexibilidade no armazenamento.
- **Cache**: Redis é implementado como uma camada de cache para otimizar o acesso aos dados, reduzindo a latência e aumentando o desempenho da aplicação.
- **JWT**: JSON Web Token é utilizado para autenticação e controle de acesso, garantindo segurança e autenticação dos usuários.
- **Monitoramento**: Prometheus coleta métricas para monitorar a saúde da aplicação, enquanto Grafana oferece dashboards visuais para análise.

### Tecnologias Utilizadas

- **Node.js**: Para desenvolvimento backend e controle dos endpoints RESTful.
- **MySQL**: Banco de dados relacional para armazenamento de informações dos usuários.
- **Redis**: Cache distribuído para melhorar a performance das requisições de leitura.
- **JWT**: Para autenticação segura dos usuários.
- **Prometheus & Grafana**: Para coleta de métricas e visualização da saúde da aplicação.
- **Ubuntu 24.04 e WSL2**: Aplicação está configurada para rodar dentro do WSL2 com Ubuntu 24.04 e com Docker Desktop no Windows.

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
[![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
![Redis](https://img.shields.io/badge/-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
[![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
![Prometheus](https://img.shields.io/badge/-Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/-Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)

### Estrutura de Padrões de Projeto e Práticas de Engenharia

#### Orientação a Objetos (OO)

O sistema é implementado seguindo práticas de orientação a objetos, garantindo uma organização clara do código, reuso e manutenção. Cada entidade possui uma classe específica que encapsula lógicas relacionadas.

- **Classes e Instâncias**: As classes são utilizadas para representar as diferentes partes do sistema, como `AuthController`, `UsuarioController`, e diferentes `UseCases` para facilitar a separação de lógica.
- **Injeção de Dependência**: Os repositórios são passados como dependências para os casos de uso, facilitando a troca e reutilização de componentes.

#### Princípios SOLID

- **Single Responsibility Principle (SRP)**: Cada classe é responsável por uma única tarefa. O `AuthController` é responsável pela autenticação, enquanto os `UseCases` cuidam das lógicas específicas de cada operação de usuário.
- **Open/Closed Principle (OCP)**: As classes estão abertas para extensão, mas fechadas para modificação. Novos recursos podem ser adicionados sem alterar os módulos existentes.
- **Liskov Substitution Principle (LSP)**: Os `UseCases` garantem que qualquer caso de uso de usuário pode ser substituído por outro que implemente a mesma interface, sem quebrar a aplicação.
- **Interface Segregation Principle (ISP)**: Cada classe depende apenas dos métodos que realmente utiliza. Os casos de uso utilizam interfaces específicas do repositório.
- **Dependency Inversion Principle (DIP)**: Os `UseCases` não dependem diretamente dos repositórios, mas sim de abstrações, facilitando testes e modificações futuras.

#### Padrões de Projeto Utilizados

- **Repository Pattern**: O padrão de repositório foi utilizado para abstrair o acesso aos dados, facilitando futuras trocas de banco de dados ou integrações.
- **Controller-Service-Repository**: Cada camada tem uma responsabilidade clara: controladores para lidar com as requisições HTTP, casos de uso (serviços) para aplicar a lógica de negócio, e repositórios para interagir com a camada de dados.
- **Cache Pattern**: Redis é utilizado como cache de dados para reduzir a latência e melhorar a eficiência do sistema.

### Como Funciona Cada Parte do Código

#### Autenticação com JWT

- **Login**: O `AuthController` gerencia a autenticação dos usuários. Quando um usuário faz login, o sistema verifica as credenciais e, se forem válidas, gera um token JWT com informações do usuário e um tempo de expiração configurado.
- **Middleware de Autenticação**: O `authMiddleware` verifica os tokens enviados nas requisições e garante que o acesso seja permitido apenas a usuários autenticados.

### Controladores e Casos de Uso

- **UsuarioController**: O controlador é responsável por lidar com as requisições HTTP e encaminhá-las para o respectivo caso de uso.
- **UseCases**: Cada operação (“GetUsuarioUseCase”, “UpdateUsuarioUseCase”, etc.) tem uma classe dedicada para garantir que as responsabilidades estejam bem divididas e o código seja fácil de testar e manter.

### Camada de Cache com Redis

- **CacheProvider**: Implementação que interage com o Redis para armazenar em cache as informações dos usuários mais solicitadas, como listas de usuários e informações de perfil. Isso melhora significativamente o tempo de resposta.
- **Invalidando Cache**: Sempre que um usuário é atualizado ou removido, o cache correspondente é invalidado para garantir consistência dos dados.

### Monitoramento e Observabilidade

- **Prometheus**: Coleta métricas da aplicação, como o uso de CPU, memória, e o número de requisições. O Prometheus é configurado para acessar endpoints que expõem métricas de forma automatizada.
- **Grafana**: Utilizado para criar dashboards que facilitam a visualização das métricas coletadas, ajudando a monitorar o desempenho e a saúde da aplicação.

### Como Executar a Aplicação

#### Dependências

- Node.js (v20+)
- MySQL
- Redis
- Docker (opcional, recomendado para executar Prometheus e Grafana)

#### Passos para Instalação


1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/emersonamorim-dev/cadastro-usuarios-microservices.git
   
   cd cadastro-usuarios-microservices
   ```

2. **Instalar Dependências**:
   ```bash
   npm install
   ```
   ```
   npm install bcrypt
   ```

   ```
   npm install module-alias
   ```

   - Instalar todos pacotes necessários para rodar aplicação
   ```
   npm install bcrypt@^5.1.1 body-parser@^1.20.3 dotenv@^16.4.5 express@^4.21.1 jsonwebtoken@^9.0.2 module-alias@^2.2.3 mysql2@^3.11.3 redis@^4.7.0 uuid@^10.0.0
   ```



   - Comando para gerar um JWT SECRET via terminal rodando no Ubuntu 24.04
   ```
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```


3. **Configurar Variáveis de Ambiente**:
   - Configure o`.env` e preencha os valores necessários (credenciais de banco de dados, secret do JWT, etc.).

4. **Executar o Banco de Dados e Redis**:
   - Inicie o MySQL e o Redis.
   - Certifique-se de que as credenciais estão configuradas corretamente no `.env`.

5. **Iniciar a Aplicação**:
   - Aplicação está toda configurada para subir Via Docker Desktop no Windows dentro do WSL2 com Ubuntu 24.04

   - Configure seu usuário do WSL2 ou Ubuntu no arquivo docker-compose.yml em:

   ```
   build: /home/seu-usuario/cadastro-usuarios-microservices/
   ```

6. **Rodar Aplicação via Docker ou de forma Automatizada**:

    
    - Comando para rodar de forma automatizada rode no Ubuntu 24.04 com Docker Desktop no Windows
    ```
    chmod +x run_app.sh
    ```

    ```
    ./run_app.sh
    ```

   ##### Ou rode do jeito tradicional:
   
   ``` 
   docker build -t cadastro-usuarios-microservices:latest .
   ``` 


   ##### Subir Aplicação via Docker

   ``` 
   docker-compose up --build

   ```

7. **Acessar Endpoints**:
   ##### Segue o endpoint para requisição Post no Postman
   - http://localhost:3018/auth/register

```
{
  "cpf": "18689699518",
  "nome": "Emerson Amorim",
  "senha": "180281XP",
  "dataNascimento": "1981-02-18",
  "endereco": {
    "rua": "Rua das Palmeiras",
    "numero": "1914",
    "complemento": "Apto 18",
    "bairro": "Barra Funda",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01000-000"
  }
}
```


- Retorno da Requisição:
```
{
    "message": "Usuário registrado com sucesso.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiY3BmIjoiMTg2ODk2OTk1MTgiLCJpYXQiOjE3Mjk5NTIzNjUsImV4cCI6MTczMDAzODc2NX0.tLLyZX1mJ7QXbZDlcmfai0e0UayZwh4o0rhqBZ9PVoY",
    "user": {
        "id": 9,
        "cpf": "18689699518",
        "nome": "Emerson Amorim"
    }
}
```


   ##### Segue o endpoint para requisição Post no Postman
   - http://localhost:3018/auth/login

```
{
  "cpf": "18775699021",
  "password": "180281XP"
}
```


- Retorno da Requisição:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiY3BmIjoiMTg3NzU2OTkwMjEiLCJpYXQiOjE3Mjk5NTIzMjUsImV4cCI6MTczMDAzODcyNX0.b7WQrQM-4ycfnFCJDMaiXfBiRct97J_bee12jjlaQKY",
    "user": {
        "id": 2,
        "cpf": "18775699021",
        "nome": "Emerson Amorim"
    }
}
```

  ##### Segue o endpoint para requisição GET para listar por ID no Postman
   - Necessário configurar o Token gerado ao fazer logar ou registrar para realizar a consulta
   - Vai na aba Authorization e em Auto Type selecione por Bearer Token e cole o token gerado ou em login ou register no campo Token
   - http://localhost:3018/api/usuarios/2



- Retorno da Requisição:
```
{
    "user": {
        "id": 2,
        "cpf": "18775699021",
        "nome": "Emerson Amorim",
        "dataNascimento": "1981-02-18T00:00:00.000Z",
        "endereco": {
            "rua": "Rua das Palmeiras",
            "numero": "1914",
            "complemento": "Apto 18",
            "bairro": "Centro",
            "cidade": "São Paulo",
            "estado": "SP",
            "cep": "01018-081"
        },
        "status": "Ativo",
        "createdAt": "2024-10-26T10:45:45.000Z",
        "createdBy": "system",
        "updatedAt": "2024-10-26T10:48:59.000Z",
        "updatedBy": "2",
        "deletedAt": null,
        "deletedBy": null
    }
}
```


  ##### Segue o endpoint para requisição GET para listar todos usuários no Postman
   - Necessário configurar o Token gerado ao fazer logar ou registrar para realizar a consulta
   - Vai na aba Authorization e em Auto Type selecione por Bearer Token e cole o token gerado ou em login ou register no campo Token
   - http://localhost:3018/api/usuarios



- Retorno da Requisição quando cadastrado vários usuários
```
{
    "users": [
        {
            "id": 1,
            "cpf": "18775608021",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Flores",
                "numero": "123",
                "complemento": "Apto 45",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01000-000"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T10:41:17.000Z",
            "createdBy": "system",
            "updatedAt": "2024-10-26T10:43:06.000Z",
            "updatedBy": "1",
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 2,
            "cpf": "18775699021",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Palmeiras",
                "numero": "1914",
                "complemento": "Apto 18",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01018-081"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T10:45:45.000Z",
            "createdBy": "system",
            "updatedAt": "2024-10-26T10:48:59.000Z",
            "updatedBy": "2",
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 3,
            "cpf": "18793699021",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua Palestra Italia",
                "numero": "1914",
                "complemento": "Apto 18",
                "bairro": "Barra Funda",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01018-081"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T11:45:15.000Z",
            "createdBy": "system",
            "updatedAt": "2024-10-26T14:19:41.000Z",
            "updatedBy": "9",
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 4,
            "cpf": "18093699021",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Palmeiras",
                "numero": "1914",
                "complemento": "Apto 18",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01000-000"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T12:52:06.000Z",
            "createdBy": "system",
            "updatedAt": null,
            "updatedBy": null,
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 5,
            "cpf": "18093699018",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Palmeiras",
                "numero": "1914",
                "complemento": "Apto 18",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01000-000"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T13:00:06.000Z",
            "createdBy": "system",
            "updatedAt": null,
            "updatedBy": null,
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 6,
            "cpf": "18099699018",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Palmeiras",
                "numero": "1914",
                "complemento": "Apto 45",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01000-000"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T13:05:03.000Z",
            "createdBy": "system",
            "updatedAt": null,
            "updatedBy": null,
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 7,
            "cpf": "18089699018",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Palmeiras",
                "numero": "1914",
                "complemento": "Apto 18",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01000-000"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T13:53:26.000Z",
            "createdBy": "system",
            "updatedAt": null,
            "updatedBy": null,
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 8,
            "cpf": "18089699518",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Palmeiras",
                "numero": "1914",
                "complemento": "Apto 18",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01000-000"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T14:11:48.000Z",
            "createdBy": "system",
            "updatedAt": null,
            "updatedBy": null,
            "deletedAt": null,
            "deletedBy": null
        },
        {
            "id": 9,
            "cpf": "18689699518",
            "nome": "Emerson Amorim",
            "dataNascimento": "1981-02-18T00:00:00.000Z",
            "endereco": {
                "rua": "Rua das Palmeiras",
                "numero": "1914",
                "complemento": "Apto 18",
                "bairro": "Centro",
                "cidade": "São Paulo",
                "estado": "SP",
                "cep": "01000-000"
            },
            "status": "Ativo",
            "createdAt": "2024-10-26T14:19:25.000Z",
            "createdBy": "system",
            "updatedAt": null,
            "updatedBy": null,
            "deletedAt": null,
            "deletedBy": null
        }
    ]
}
```


  ##### Segue o endpoint para requisição PUT para atualizar dados de usuário no Postman
   - Necessário configurar o Token gerado ao fazer logar ou registrar para realizar a consulta
   - Vai na aba Authorization e em Auto Type selecione por Bearer Token e cole o token gerado ou em login ou register no campo Token
   - http://localhost:3018/api/usuarios/3



- Segue a requisição Put para atualização de dados especificos

```
{
  "nome": "Emerson Amorim",
  "dataNascimento": "1981-02-18",
  "endereco": {
    "rua": "Rua Palestra Italia",
    "numero": "1914",
    "complemento": "Apto 18",
    "bairro": "Barra Funda",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01018-081"
  }
}
```


- O retorno da requisição atualizada dados do usuário

```
{
    "user": {
        "id": 3,
        "cpf": "18793699021",
        "nome": "Emerson Amorim",
        "dataNascimento": "1981-02-18T00:00:00.000Z",
        "endereco": {
            "rua": "Rua Palestra Italia",
            "numero": "1914",
            "complemento": "Apto 18",
            "bairro": "Barra Funda",
            "cidade": "São Paulo",
            "estado": "SP",
            "cep": "01018-081"
        },
        "status": "Ativo",
        "createdAt": "2024-10-26T11:45:15.000Z",
        "createdBy": "system",
        "updatedAt": "2024-10-26T14:19:41.000Z",
        "updatedBy": "9",
        "deletedAt": null,
        "deletedBy": null
    }
}
```

#### Comando para rodar os Testes em Jest

```
npm run test
```
#### Print dos Testes
![](https://raw.githubusercontent.com/emersonamorim-dev/cadastro-usuarios-microservices/refs/heads/main/print-testes-jest.jpg)


#### Comandos para acessar o Container do MySQL ou da Aplicação:

- Comando para acessar o container do MYSQL via root
```
docker ps
```

```
docker exec -it seu-id-container-mysql mysql -u root -p
```

- Comando para garantir todos previlégios usuário root
```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'sua-senha';
```
```
FLUSH PRIVILEGES;
```

- Comando está concedendo todas as permissões possíveis ao usuário 'root', para todos os bancos de dados e todas as tabelas
```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
```

```
FLUSH PRIVILEGES;
```

- Comando concede todas as permissões ao usuário 'root' para todos os bancos de dados e tabelas e permite que o 'root' repasse esses privilégios para outros usuários.
```
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
```

- Comando altera a senha do usuário 'root' para 'sua-senha', permitindo que 'root' se conecte ao servidor MySQL de qualquer endereço IP ('%').
```
ALTER USER 'root'@'%' IDENTIFIED BY 'sua-senha';
```

- Comando para instalar pacotes dentro container MYSQL
```
apt-get update && apt-get install -y netcat-openbsd
```

- Comando do Netcat usado para testar a conectividade de uma porta em um host
```
nc -zv mysql-db 3306
```

- Comando seleciona o Banco de dados dentro do container
```
USE usuariodb;
```

- Comando SHOW TABLES; irá listar todas as tabelas no banco de dados usuariodb.
```
SHOW TABLES;
```
- Comando é útil para visualizar o esquema da tabela e obter informações sobre suas colunas e como os dados são armazenados.
DESCRIBE usuarios;


#### Funcionalidades e Aspectos Técnicos

A aplicação desenvolvida segue rigorosamente os princípios da Engenharia de Software, utilizando conceitos de Arquitetura Orientada a Objetos, princípios SOLID e Design Patterns para garantir um sistema escalável, modular e de fácil manutenção. Abaixo, listamos as principais funcionalidades e alguns dos aspectos técnicos mais importantes que compõem a arquitetura e o funcionamento da aplicação:

#### Segurança e Boas Práticas:

Autenticação e Autorização: Implementado com tokens JWT, garantindo que apenas usuários autenticados possam acessar os recursos da aplicação.

Hash de Senhas: As senhas dos usuários são criptografadas com bcrypt, garantindo a proteção contra vazamento de senhas.

Variáveis de Ambiente: Utilização do .env para proteger informações sensíveis como chaves secretas e credenciais do banco de dados, seguindo boas práticas de segurança.


### Conclusão

Esta solução foi desenvolvida com foco em escalabilidade, segurança e facilidade de manutenção, utilizando Node.js com MySQL, Redis, JWT para autenticação, e ferramentas de monitoramento como Prometheus e Grafana para assegurar uma visão clara do estado da aplicação. Implementando padrões de design, práticas SOLID e orientação a objetos, o projeto garante uma base sólida para expansão e manutenção futura. Esperamos que esta arquitetura forneça a base para soluções empresariais robustas e fáceis de manter.

### Desenvolvido por:
Emerson Amorim [@emerson-amorim-dev](https://www.linkedin.com/in/emerson-amorim-dev/)

