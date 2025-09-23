import React from "react";
import "./NextEvent.css";
import api from "../../Services/Service.js";
import { Tooltip } from "react-tooltip";
import { UserContext } from "../../context/AuthContext.js"
import { useContext } from "react";

// importar a função lá do arquivo stringFunction (destructuring)
import { dateFormatDbToView } from "../../Utils/stringFunctions";

const NextEvent = ({ title, description, eventDate, idEvent }) => {
  const { userData } = useContext(UserContext);

async function conectar() {
  try{
  console.log(userData.userId)
  const presenca = await api.get(`PresencaEvento/ListarMinhas/${userData?.userId}`)
  const jaCadastrado = presenca.data.some(p => p.idEvento === idEvent);

    if (jaCadastrado) {
  alert("Você já se cadastrou nesse evento!!!");
}
  else {
    try {
    
    const response = await api.post("/PresencaEvento/Cadastrar", {
      IdEvento: idEvent,
      IdUsuario: userData?.userId,
      Situacao: true
    });
    console.log("Sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao conectar:", error.response?.data || error.message);
  }
    }
  }
  catch(error){
    
    console.log("Deu erro ou no get ou no post", error);
  }


 }
  return (
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
  );
};

export default NextEvent;
