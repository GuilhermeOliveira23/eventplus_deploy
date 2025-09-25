import React, { useContext, useEffect, useState } from "react";
import MainContent from "../../components/MainContent/MainContent";
import Title from "../../components/Title/Title";
import Table from "./TableEvA/TableEvA";
import Container from "../../components/Container/Container";
import { Select } from "../../components/FormComponents/FormComponents";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import api, {
  eventsResource,
  myEventsResource,
  presencesEventResource,
  commentaryEventResource,
} from "../../Services/Service";
import Notification from "../../components/Notification/Notification";
import "./EventosAlunoPage.css";
import { UserContext } from "../../context/AuthContext";

const EventosAlunoPage = () => {
  const [notifyUser, setNotifyUser] = useState({}); //Componente Notification
  const[frmEditData, setFrmEditData] = useState({
    idTipoEvento: ""
})
  const [tipoEvento, setTipoEvento] = useState([]); //código do tipo do Evento escolhido
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEventos, setShowEventos] = useState([])

  // recupera os dados globais do usuário
  const { userData } = useContext(UserContext);
  const [comentario, setComentario] = useState("");
  const [idEvento, setIdEvento] = useState("");
  const [idComentario, setIdComentario] = useState(null);
  // const [meusEventos, setMeusEventos] = useState([])

  useEffect(() => {
    loadEventsType();
  }, [userData.userId, frmEditData.idTipoEvento]); //
  
// Load da página com as informações que ela precisa
  async function loadEventsType() {
    setShowSpinner(true);
      if(!userData?.userId) return;
      
    try {
    const promiseTipoEvento = await api.get("TipoEvento/Listar")
    setTipoEvento(promiseTipoEvento.data)
    const [todosEventos, minhasPresencas] = await Promise.all([
      api.get(eventsResource),                                // todos eventos
      api.get(`/PresencaEvento/ListarMinhas/${userData.userId}`) // presenças do usuário
    ]);

    // monta um map rápido: idEvento -> presenca
    const presencasMap = new Map(
  minhasPresencas.data.map(p => [p.evento.idEvento, p])
);

    // padroniza todos eventos
    let eventosCompletos = todosEventos.data.map(e => {
      const presenca = presencasMap.get(e.idEvento);

      return {
        ...e,
        situacao: presenca ? presenca.situacao : false,
        idPresencaEvento: presenca ? presenca.idPresencaEvento : null
      };
    });

    // aplica o filtro baseado no select
    if (frmEditData.idTipoEvento === "meus") {
      eventosCompletos = eventosCompletos.filter(ev => ev.situacao);
    } 
    // filtra por tipo de evento
    else if (frmEditData.idTipoEvento !== "todos" && frmEditData.idTipoEvento !== "") {
      
      eventosCompletos = eventosCompletos.filter(
        ev => ev.idTipoEvento === frmEditData.idTipoEvento
      );
    }

    setShowEventos(eventosCompletos);
  } catch (err) {
    console.log("Erro na API", err);
  }
      
    
    setShowSpinner(false);
  }
 
  // toggle meus eventos ou todos os eventos
  const showHideModal = (idEvent) => {
    setShowModal(showModal ? false : true);
    setIdEvento(idEvent);
  };

  // ler um comentário - get
  const loadMyCommentary = async (idUsuario, idEvento) => {
    // console.log("fui chamado");

    try {
      // api está retornando sempre todos os comentários do usuário
      const promise = await api.get(
        `${commentaryEventResource}?idUsuario=${idUsuario}&idEvento=${idEvento}`
      );

      const myComm = await promise.data.filter(
        (comm) => comm.idEvento === idEvento && comm.idUsuario === idUsuario
      );
      setComentario(myComm.length > 0 ? myComm[0].descricao : "");
      setIdComentario(myComm.length > 0 ? myComm[0].idComentarioEvento : null);
    } catch (error) {
      console.log("Erro ao carregar o evento");
      console.log(error);
    }
  };

  // cadastrar um comentário = post
  const postMyCommentary = async (descricao, idUsuario, idEvento) => {
    try {
      const promise = await api.post(commentaryEventResource, {
        descricao: descricao,
        exibe: true,
        idUsuario: idUsuario,
        idEvento: idEvento,
      });

      if (promise.status === 200) {
        alert("Comentário cadastrado com sucesso");
      }
    } catch (error) {
      console.log("Erro ao cadastrar o evento");
      console.log(error);
    }
  };

  // remove o comentário - delete
  const commentaryRemove = async (idComentario) => {
    // alert("Remover o comentário " + idComentario);

    try {
      const promise = await api.delete(
        `${commentaryEventResource}/${idComentario}`
      );
      if (promise.status === 200) {
        alert("Evento excluído com sucesso!");
      }
    } catch (error) {
      console.log("Erro ao excluir ");
      console.log(error);
    }
  };

  //Connect e disconnect do toggle
  async function handleConnect(eventId, whatTheFunction, presencaId = null) {
    if (whatTheFunction === "connect") {
      try {
        //connect
        const promise = await api.post(presencesEventResource, {
          situacao: true,
          idUsuario: userData.userId,
          idEvento: eventId,
        });

        if (promise.status === 201) {
          loadEventsType();
           setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Conectado no Evento!`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });
        }
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
      return;
    }

    else{
    try {
      const unconnected = await api.delete(
        `PresencaEvento/${presencaId}`
      );
      if (unconnected.status === 204) {
        loadEventsType(frmEditData.idTipoEvento);
         setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Desconectado do Evento!`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

      }
    } catch (error) {
      console.log("Erro ao desconectar o usuário do evento");
      console.log(error);
    }
  }
}
  // TipoEvento opções default
  const tipoEventoComExtras = [
  { idTipoEvento: "todos", titulo: "Todos" },
  { idTipoEvento: "meus", titulo: "Meus" },
  ...tipoEvento
];

  return (
    <>
      <MainContent>
        <Container>
          <Title titleText={"Eventos"} additionalClass="custom-title" />

          <Select
            id="id-tipo-evento"
            name="tipo-evento"
            required={true}
            options={tipoEventoComExtras}
            value={frmEditData.idTipoEvento || ""} 
            optionValueKey="idTipoEvento"
            optionLabelKey="titulo"
            additionalClass="select-tp-evento" // aqui o array dos tipos
            manipulationFunction={e => setFrmEditData(prev => ({...prev, idTipoEvento: e.target.value}))} // aqui só a variável state
            
          />
          <Table
            
            dados={showEventos}
            fnConnect={handleConnect}
            fnShowModal={showHideModal}
          />
        </Container>
      </MainContent>
      {/* SPINNER -Feito com position */}
      {showSpinner ? <Spinner /> : null}

      {showModal ? (
        <Modal
          // userId={userData.userId}
          showHideModal={showHideModal}
          fnGet={loadMyCommentary}
          fnPost={postMyCommentary}
          fnDelete={commentaryRemove}
          comentaryText={comentario}
          userId={userData.userId}
          idEvento={idEvento}
          idComentario={idComentario}
        />
      ) : null}
      <Notification {...notifyUser} setNotifyUser={setNotifyUser}/>
    </>
  );
};

export default EventosAlunoPage;
