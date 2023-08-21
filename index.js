//modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')
//modulos nativos
const fs = require('fs')

operacoes()

function operacoes() {
    inquirer.prompt([
        {type: 'list',
        name: 'resposta',
        message:'O que você deseja fazer?',
        choices: ["Criar conta","Consultar saldo","Depositar","Sacar", "Sair"]
        },
    ]).then(
        (input) => {
            const action = input['resposta']

            if (action === "Criar conta") {
                CriarConta()
            }else if (action === "Consultar saldo") {
                ResgatarSaldo();
            } else if (action === "Depositar") {
                Depositar();
            } else if (action === "Sacar") {
                Sacar();
            } else if (action === "Sair") {
                console.log(chalk.bgBlackBright.yellow.bold(" Finalizando sessão até breve! :) "))
                process.exit()
            }
        }

    ).catch((err) => {
        console.log(err)
    })
}

function CriarConta() {
    console.log(chalk.bgCyan.white.bold(" Obrigado por escolher nosso banco! "))
    console.log(chalk.cyan.bold(" Forneça alguns dados para iniciar a usar sua conta ")) 
    ResgatarDadosCriacao()
}

function ResgatarDadosCriacao() {
    inquirer.prompt([
        {
            name: 'nomeO',
            message: 'Digite seu nome por gentileza: '
        }
    ]).then((input) => {
        const nomeV = input['nomeO']
//verifica se a conta já existe
        if (fs.existsSync(`Contas/${nomeV}.json`)) {
            console.log(chalk.bgRed.black(" Esta conta já existe! "))
            perguntarIrMenuPrincipal()
            return
        }
//cria um arquivo json com o nome do usuário
        fs.writeFileSync(
            `Contas/${nomeV}.json`,
            '{"Saldo": 0}',
            (err)=>{console.log(err)})
//confirmação
            console.log(chalk.bgGreen(" Conta criada com sucesso! "))
            operacoes()
    }).catch((err)=>{
        console.log(err)
    })
}

// Função para perguntar ao usuário se ele deseja ir para o menu principal na criação de conta
function perguntarIrMenuPrincipal() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'irMenu',
            message: 'A conta já existe. / Y / para ir para o menu principal ou / N / para tentar novamente'
        }
    ]).then((answer) => {
        if (answer.irMenu) {
            // Código para ir ao menu principal
            console.log(' Redirecionando para o menu principal... ');
            operacoes()
        } else {
            // Código para tentar escrever o nome novamente
            console.log(chalk.bgYellow.black.bold(' Vamos tentar novamente... '));
            ResgatarDadosCriacao()
        }
    }).catch((error) => {
        console.error(error);
    });
}

//função para caso não exista a conta no momento do deposito 
function PerguntarCriarContaD() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'irMenu',
            message: 'A conta não existe. / Y / para ir para criar uma nova conta ou / N / para tentar novamente'
        }
    ]).then((answer) => {
        if (answer.irMenu) {
            // Código para ir ao menu principal
            console.log(chalk.bgYellow.black.bold(' Vamos criar uma nova conta então... '));
            ResgatarDadosCriacao()
        } else if(!answer.irMenu){
            // Código para tentar escrever o nome novamente
            console.log(chalk.bgYellow.black.bold(' Vamos tentar novamente... '));
            Depositar()
        }
    }).catch((error) => {
        console.error(error);
    });
}

function PerguntarCriarContaS() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'irMenu',
            message: 'A conta não existe. / Y / para ir para criar uma nova conta ou / N / para tentar novamente'
        }
    ]).then((answer) => {
        if (answer.irMenu) {
            // Código para ir ao menu principal
            console.log(chalk.bgYellow.black.bold(' Vamos criar uma nova conta então... '));
            ResgatarDadosCriacao()
        } else if(!answer.irMenu){
            // Código para tentar escrever o nome novamente
            console.log(chalk.bgYellow.black.bold(' Vamos tentar novamente... '));
            ResgatarSaldo()
        }
    }).catch((error) => {
        console.error(error);
    });
}

function PerguntarCriarContaR() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'irMenu',
            message: 'A conta não existe. / Y / para ir para criar uma nova conta ou / N / para tentar novamente'
        }
    ]).then((answer) => {
        if (answer.irMenu) {
            // Código para ir ao menu principal
            console.log(chalk.bgYellow.black.bold(' Vamos criar uma nova conta então... '));
            ResgatarDadosCriacao()
        } else if(!answer.irMenu){
            // Código para tentar escrever o nome novamente
            console.log(chalk.bgYellow.black.bold(' Vamos tentar novamente... '));
            Sacar()
        }
    }).catch((error) => {
        console.error(error);
    });
}

function Depositar() {
    inquirer.prompt([{
        name: 'nomeTitular',
        message: 'Qual nome do titular da conta?'
    }]).then((nomeInput) =>{
            const nomeD = nomeInput['nomeTitular']
//se a conta não existir 
            if(!ChecarExistenciaConta(nomeD)){
                return PerguntarCriarContaD()
            }
//Perguntar ao cliente qual valor a ser inserido
inquirer.prompt([
    {
    name : 'valor',
    message: 'Qual valor gostaria de depositar'
    }
]).then((input) =>{
    const valor = input['valor']

    adicionarValor(nomeInput.nomeTitular, valor);
    operacoes()
})
    }).catch(
        (err)=>{
            console.log(err)
        })
}

function ChecarExistenciaConta(nomeInput) {
    if (!fs.existsSync(`Contas/${nomeInput}.json`)) {
        console.log(chalk.bgRed.black(" Essa conta não existe! "))
        return false
    }
        return true
}

function adicionarValor(nomeInput1,valor) {
    const objConta = ResgatarDados(nomeInput1);
    if (!valor || isNaN(valor)) {
        console.log(chalk.bgRed.black(" Valor inválido "));
        return;
    }
    
//adicionando o valor
    objConta.Saldo = parseFloat(valor) + parseFloat(objConta.Saldo)
    fs.writeFileSync(
        `Contas/${nomeInput1}.json`,
        JSON.stringify(objConta)
    )
    console.log(chalk.bgGreen(` Sr(a). ${nomeInput1} foi depositado R$${valor} em sua conta `))
}

function ResgatarDados(nomeInput) {
    const contaJson = fs.readFileSync(`Contas/${nomeInput}.json`,{
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(contaJson)
}

function ResgatarSaldo() {
    inquirer.prompt([
        {
            name: 'titular',
            message: 'Confirme seu nome por favor: '
        }
    ]).then((nomeInput2)=>
        {
            const nomeS = nomeInput2['titular']

            if(!ChecarExistenciaConta(nomeS)){
                return PerguntarCriarContaS()
            }

            const dadosConta = ResgatarDados(nomeS)

            console.log(chalk.bgCyan.black.bold(` Olá Sr(a). ${nomeS} seu saldo atual é de R$${dadosConta.Saldo}  `))
            operacoes()
        })
    .catch(
        (err) => {
            console.error(err);
        }
    )
}

function Sacar() {
    inquirer.prompt([
        {
            name: 'TitularSaque',
            message: 'Qual nome do titular'
        }
    ]).then((nomeInput3) => {
        const TitularSaque = nomeInput3['TitularSaque'];

        if (!ChecarExistenciaConta(TitularSaque)) {
            return PerguntarCriarContaR();
        }

        const mensagem = `Sr(a) ${TitularSaque}, qual valor deseja sacar?`;

        inquirer.prompt([
            {
                name: 'ValorSaque',
                message: mensagem
            }
        ]).then((valorInput) => {
//Pegar o valor e remover da conta
            const valorDesejado = valorInput['ValorSaque'];
            RemoverValor(TitularSaque,valorDesejado);

        }).catch((error) => {
            console.error(error);
        });
    }).catch((error) => {
        console.error(error);
    });
}

function RemoverValor(nomeInput5,valor) {
    const objConta = ResgatarDados(nomeInput5);
    if (!valor || isNaN(valor)) {
        console.log(chalk.bgRed.black(" Valor inválido Tente novamente "));
        return operacoes();
    }
    
    if ( objConta.Saldo < valor) {
        console.log(chalk.bgRed.black(" Saldo insuficiente tente novamente "));
        operacoes()
    } else {
        //removendo o valor desejado
        objConta.Saldo = parseFloat(objConta.Saldo) - parseFloat(valor) 
        fs.writeFileSync(`Contas/${nomeInput5}.json`,JSON.stringify(objConta))

        console.log(chalk.bgGreen(` Sr(a). ${nomeInput5} foi retirado R$${valor} de sua conta `))
        operacoes()
    }
}

