const axios = require('axios');

const baseUrl = 'http://localhost:3000/graphql';
 

async function criarEnquete(titulo, opcoes) {
    try {
      const response = await axios.post(baseUrl, {
        query: `
          mutation {
            criarEnquete(titulo: "${titulo}", opcoes: ${JSON.stringify(opcoes)})
          }
        `,
      });
      console.log(response.data)
      return response.data.data.criarEnquete;
    } catch (error) {
      console.error('Erro ao criar enquete:', error.message);
      throw new Error('Erro ao criar enquete');
    }
  }

async function votar(enqueteId, opcao) {
  try {
    const response = await axios.post(baseUrl, {
      query: `
        mutation {
          votar(enqueteId: "${enqueteId}", opcao: "${opcao}") {
            id
            titulo
            opcoes
            votos
          }
        }
      `,
    });
    return response.data.data.votar;
  } catch (error) {
    console.error('Erro ao votar:', error.message);
    throw new Error('Erro ao votar na enquete');
  }
} 

async function getEnquete(id) {
  try {
    const response = await axios.post(baseUrl, {
      query: `
        query {
          enquete(id: "${id}") {
            id
            titulo
            opcoes
            votos
          }
        }
      `,
    });
    return response.data.data.enquete;
  } catch (error) {
    console.error('Erro ao obter enquete:', error.message);
    throw new Error('Erro ao obter enquete');
  }
}

module.exports = {
  criarEnquete,
  votar,
  getEnquete,
};