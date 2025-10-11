import React from "react";
import "./NextEvent.css";
import api from "../../Services/Service.js";
import { Tooltip } from "react-tooltip";
import { UserContext } from "../../context/AuthContext.js"
import { useContext } from "react";
import Notification from "../Notification/Notification.js";

// importar a função lá do arquivo stringFunction (destructuring)
import { dateFormatDbToView } from "../../Utils/stringFunctions";

const NextEvent = ({ title, description, eventDate, idEvent }) => {
  const [notifyUser, setNotifyUser] = React.useState({}); //Componente Notification
  const { userData } = useContext(UserContext);

async function conectar() {

  if (!userData || !userData.userId) {
      setNotifyUser({
        titleNote: "Aviso",
        textNote: "Você precisa estar logado para se conectar a um evento.\nClique em Login no canto superior direito de sua tela!",
        imgIcon: "warning",
        imgAlt: "Imagem de ilustração de aviso.",
        showMessage: true,
      });
      return;
    }
    
    else if(userData.role === "Administrador"){
      setNotifyUser({
        titleNote: "Aviso",
        textNote: "Administradores não podem se conectar a eventos.",
        imgIcon: "warning",
        imgAlt: "Imagem de ilustração de aviso.",
        showMessage: true,
      });
      return;
    }
    
     try {
      // Verifica se o usuário já está cadastrado no evento
      const presenca = await api.get(`/PresencaEvento/ListarMinhas/${userData.userId}`);
      const jaCadastrado = presenca.data.some(p => p.idEvento === idEvent);

      if (jaCadastrado) {
        setNotifyUser({
          titleNote: "Aviso",
          textNote: "Você já está conectado a este evento.",
          imgIcon: "warning",
          imgAlt: "Imagem de ilustração de aviso.",
          showMessage: true,
        });
      } else {
        // Tenta cadastrar a presença
        await api.post("/PresencaEvento/Cadastrar", {
          idEvento: idEvent,
          idUsuario: userData.userId,
          situacao: true,
        });

        setNotifyUser({
          titleNote: "Sucesso",
          textNote: "Conectado com sucesso!",
          imgIcon: "success",
          imgAlt: "Imagem de ilustração de sucesso.",
          showMessage: true,
        });
      }
    } catch (error) {
      // 3. Tratamento de Erro Genérico e Inteligente
      console.error("Erro ao tentar conectar ao evento:", error);
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Não foi possível conectar. Tente novamente. (Erro: ${error.response?.status || 'desconhecido'})`,
        imgIcon: "danger",
        imgAlt: "Imagem de ilustração de erro.",
        showMessage: true,
      });
    }


 }
  return (
    <>
    <article className="event-card">
      <h2 className="event-card__title">{title}</h2>

      <p
        className="event-card__description"
        
        data-tooltip-id={idEvent}
        data-tooltip-content={description}
        data-tooltip-place="top"
      >
        <Tooltip id={idEvent} className="tooltip" />
        {description.substr(0, 15)} ...
      </p>

      <p className="event-card__description">
        {/* aplicar a função pra converter a data */}
        {dateFormatDbToView(eventDate)}
      </p>

      <a
        onClick={() => {
          conectar(idEvent);
        }}
        className="event-card__connect-link"
      >
        Conectar
      </a>
    </article>
    <Notification {...notifyUser} setNotifyUser={setNotifyUser} />
    </>
    
  );
};

export default NextEvent;
