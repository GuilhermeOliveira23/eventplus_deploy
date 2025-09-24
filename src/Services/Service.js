import axios from 'axios';

/**
 * Módulo para trabalhar com apis. Disponibiliza as rotas da api bem como o serviço com a biblioteca axios
 */



/**
 * Rota para o recurso Evento
 */
export const eventsResource = '/Evento/Listar';
/**
 * Rota para o recurso Listar Minhas Presenças
 */
export const myEventsResource = '/PresencaEvento/ListarMinhas';
/**
 * Rota para o recurso Presenças Evento
 */
export const presencesEventResource = '/PresencaEvento/Cadastrar';
/**
 * Rota para o recurso Presenças Evento
 */
export const commentaryEventResource = '/ComentarioEvento';

/**
 * Rota para o recurso Próximos Eventos
 */
export const nextEventResource = '/Evento/Listar';
/**
 * Rota para o recurso Tipos de Eventos
 */
export const eventsTypeResource = '/TipoEvento';
/**
 * Rota para o recurso Instituição
 */
export const institutionResource = '/Instituicao';
/**
 * Rota para o recurso Login
 */
export const loginResource = '/Login';

const apiPort = '7209';
const localApiUri = `https://localhost:${apiPort}/api`;
const externallApiUri = 'https://eventplusapi-h9dmetekh6ehbqdc.brazilsouth-01.azurewebsites.net/api';
// const externalApiUri = null;

const api = axios.create({
    baseURL: externallApiUri
});



export default api;