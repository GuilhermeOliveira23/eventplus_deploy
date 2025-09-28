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

// URLs da API - usa externa por padrão, local como fallback
const apiUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_API_URL;

const api = axios.create({
    baseURL: apiUrl
});
// Adiciona um interceptador que será executado ANTES de cada requisição
api.interceptors.request.use(
    async (config) => {
        // Tenta pegar os dados do usuário do localStorage
        // A chave "user" deve ser a mesma que você usa para salvar no AuthContext
        const userData = localStorage.getItem("token");

        if (userData) {
            // Se encontrou os dados, converte para objeto
            const user = JSON.parse(userData);
            
            // Adiciona o token no cabeçalho Authorization
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        
        // Retorna a configuração da requisição (agora com o token, se houver)
        return config;
    },
    (error) => {
        // Se der erro, rejeita a promise
        return Promise.reject(error);
    }
);



export default api;