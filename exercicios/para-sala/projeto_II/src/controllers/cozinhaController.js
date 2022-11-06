const mongoose = require("mongoose");
const CozinhaSchema = require("../models/CozinhaSchema");

const criarCozinha = async (request, response) => {
    const { nome, cnpj, iniciativa_privada,
        endereco: { cep, rua, numero, complemento, referencia, estado, cidade, bairro },
        bairros_atuantes, site, atividades_disponiveis, pessoa_responsavel } = request.body;

    //retorna uma array de objetos
    const buscaBairro = await CozinhaSchema.find({ bairro: bairro })
    //filtrei as cozinhas que tem o bairro que a pessoa digitou
    let ExisteBairro = buscaBairro.filter((cozinha) => cozinha.endereco.bairro === bairro)
    //verifiquei se vai encontrar no array do filter UMA cozinha
    let nomeExisteBairro = ExisteBairro.find((cozinha) => cozinha.nome === nome)
    if (nomeExisteBairro) {
        return response.status(404).json({ message: `Não é possível cadastrar a sua cozinha, esse nome já existe neste bairro` });
    }
    const buscaCnpj = await CozinhaSchema.find({ cnpj })
    if (buscaCnpj.length !== 0) {//array zerado ou array encontrado
        return response.status(400).json({ message: `Não é possível cadastrar, esse número de cnpj já existe` });
    }
    try {
        const cozinha = new CozinhaSchema({
            nome: nome,
            cnpj: cnpj,
            iniciativa_privada: iniciativa_privada,
            endereco: {
                cep: cep,
                rua: rua,
                numero: numero,
                complemento: complemento,
                referencia: referencia,
                estado: estado,
                cidade: cidade,
                bairro: bairro
            },
            bairros_atuantes: bairros_atuantes,
            site: site,
            atividades_disponiveis: atividades_disponiveis,
            pessoa_responsavel: pessoa_responsavel
        })
        const salvarCozinha = await cozinha.save();
        response.status(201).json({
            cozinha: salvarCozinha
        })

    } catch (error) {
        response.status(400).json({
            message: error.message
        })

    }

}
module.exports = {
    criarCozinha
}