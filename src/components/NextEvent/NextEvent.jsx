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
  try{
  console.log(userData.userId)
  const presenca = await api.get(`PresencaEvento/ListarMinhas/${userData?.userId}`)
  const jaCadastrado = presenca.data.some(p => p.idEvento === idEvent);

    if (jaCadastrado) {
          setNotifyUser({
          titleNote: "Erro",
          textNote: `Você já se conectou a este evento`,
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
          showMessage: true,
        });
}
  else {
    try {
    
    await api.post("/PresencaEvento/Cadastrar", {
      IdEvento: idEvent,
      IdUsuario: userData?.userId,
      Situacao: true
    });
    setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Conectado com sucesso!`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });
  } catch (error) {
            setNotifyUser({
          titleNote: "Erro",
          textNote: `Problemas ao conectar ${error}`,
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
          showMessage: true,
        });
  }
    }
  }
  catch(error){
    
    console.log("Deu erro ou no get ou no post", error);
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
