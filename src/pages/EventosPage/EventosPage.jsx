import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import Title from "../../components/Title/Title";
import MainContent from "../../components/MainContent/MainContent";
import ImageIllustrator from "../../components/ImageIllustrator/ImageIllustrator";
import {
  Input,
  Button,
  Select,
} from "../../components/FormComponents/FormComponents";
import Table from "./TableEv/TableEv";
import api, {
  eventsResource,
  eventsTypeResource,
  institutionResource,
} from "../../Services/Service";
import Spinner from "../../components/Spinner/Spinner";
import Notification from "../../components/Notification/Notification";
import { truncateDateFromDb } from "../../Utils/stringFunctions";
import eventoImage from "../../assets/images/tipo-evento.svg";
import "./EventosPage.css";

export default function EventosPaage(props) {
  //dados do form
  const [tipoEvento, setTipoEvento] = useState([]); //código do tipo do Evento escolhido
  const [eventos, setEventos] = useState([]);;
  
  const [instituicao, setInstituicao] = useState([]);
 const [frmEditData, setFrmEditData] = useState({
        nome: "",
        dataEvento: "",
        descricao: "",
        idInstituicao: "",
        idTipoEvento: "" 
  // ... qualquer outro input
});
  //states condicionais
  const [showSpinner, setShowSpinner] = useState(false);
  //controla qual é a ação do submit, cadastrar ou atualizar
  const [frmEdit, setFrmEdit] = useState(false);
  const [notifyUser, setNotifyUser] = useState({}); //Componente Notification

  //THE FUNCTIONS

  // READ - LIFE CICLE - Carrega os tipos de evento no carregamento do componente
  useEffect(() => {
    async function loadEventsType() {
      setShowSpinner(true);
      
      try {
        const promise = await api.get(eventsResource);
        const promiseTipoEventos = await api.get("TipoEvento/Listar")
        const promiseInstituicao = await api.get("Instituicao/Listar")
        
        setTipoEvento(promiseTipoEventos.data)
    
        setInstituicao(promiseInstituicao.data)
        //só tem uma instituição neste projeto mas já fica preparado pra adicionar mais!
        setEventos(promise.data);

      } catch (error) {}
      setShowSpinner(false);
    }

    loadEventsType();
  }, [frmEdit]); //frmEdit[instituicao ]

  // UPDATE
  function editActionAbort() {
    setFrmEdit(false);
    setFrmEditData({
        nome: "",
        dataEvento: "",
        descricao: "",
        idInstituicao: "",
        idTipoEvento: "" 
    });
  }
  // Exibe os dados na tela com o formulário de edição
  async function showUpdateForm(evento) {
      setFrmEditData(prev => ({
    ...prev,
    IdEvento: evento // guarda o IdEvento no state
  }));
    setFrmEdit(true);
  }

  // UPDATE ON API  BACKEND
  async function handleUpdate(e) {
    e.preventDefault();
    setShowSpinner(true);
    
    
    try {


      const promise = await api.put(
        `${"/Evento"}/${frmEditData.IdEvento}`, frmEditData
      );

      if (promise.status === 204) {
        // esse notify aqui é um componente de notificação bonito pra n ficar aparecendo aqueles alerts horrosos
        setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Atualizado com sucesso! (${frmEditData.nome})`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

        const buscaEventos = await api.get(eventsResource);
        setEventos(buscaEventos.data); //aqui retorna um array impossivel dar erro
      } else {
        setNotifyUser({
          titleNote: "Erro",
          textNote: `Problemas ao atualizar, contate o admnistrador do sistema)`,
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
          showMessage: true,
        });
      }
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Problemas ao atualizar os dados na tela ou no banco`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
        showMessage: true,
      });

      throw new Error(
        "O servidor bitolou, verifique se o Evento foi atualizado corretamente"
      );
    }

    setShowSpinner(false);
    setFrmEditData({
        IdEvento: "",
        nome: "",
        dataEvento: "",
        descricao: "",
        idInstituicao: "",
        idTipoEvento: ""});
    setFrmEdit(false);
    return; // aqui como um preventDefault()
  }

  // DELETE
  async function handleDelete(idElemento) {
    if (!window.confirm("Confirma Exclusão?")) {
      return; //retorna a função sem executar o restante do código
    }

    
    try {
      setShowSpinner(true);
      const promise = await api.delete(`Evento/${idElemento}`);

      if (promise.status === 204) {
        setNotifyUser({
          titleNote: "Sucesso!",
          textNote: "Evento excluído com sucesso!",
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

        const buscaEventos = await api.get(eventsResource);
        // console.log(buscaEventos.data);
        setEventos(buscaEventos.data); //aqui retorna um array, então de boa!
      } else {
        setNotifyUser({
          titleNote: "Erro",
          textNote: `O servidor bitolou, verifique se o Evento foi apagado corretamente`,
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
          showMessage: true,
        });
        throw new Error(
          "O servidor bitolou, verifique se o Evento foi apagado corretamente"
        );
      }
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Problemas ao apagar`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
        showMessage: true,
      });
      throw new Error(`Problemas ao apagar: ${error}`);
    }
    setShowSpinner(false);
  }

  //SUBMIT FORM - Cadastrar evento
  async function handleSubmit(e) {
    e.preventDefault();
    setShowSpinner(true);
    
    // Validação dos campos
    if (
      frmEditData.nome.trim().length === 0 ||
      frmEditData.descricao.trim().length === 0 ||
      frmEditData.dataEvento.trim().length === 0
    ) {
      
      setNotifyUser({
        titleNote: "Atenção",
        textNote: "Preencha os campos corretamente",
        imgIcon: "warning",
        imgAlt:
          "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
        showMessage: true,
      });
      setShowSpinner(false);
      return;
    }

    // console.log("teste");
    try {

      await api.post("/Evento", frmEditData);
      

      const newListEvents = await api.get(eventsResource);
      setEventos(newListEvents.data);
      setNotifyUser({
        titleNote: "Sucesso",
        textNote: `Evento ( ${frmEditData.nome} ) cadastrado com sucesso!`,
        imgIcon: "success",
        imgAlt:
          "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
        showMessage: true,
      });
// um clear pra n dar merda quando dar reload
setFrmEditData(prev => ({
  ...prev,
  idTipoEvento: "",
  nome: "",
  descricao: "",
  idInstituicao: "",
  dataEvento: ""
}));

    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Deu ruim ao cadastrar!!: ${error}`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
        showMessage: true,
      });
    }

    setShowSpinner(false);
  }


  

  return (
    <>
      <MainContent>
        <section className="cadastro-evento-section">
          <Container>
            <div className="cadastro-evento__box">
              <Title titleText={"Eventos"} />

              <ImageIllustrator
                imageName="evento"
                imageRender={eventoImage}
                altText="Imagem de Ilustrativa para o cadastro de tipos de eventos - duas pessoas construindo uma parte de um todo!"
              />

              <form
                className="ftipo-evento"
                onSubmit={frmEdit ? handleUpdate : handleSubmit}
              >
                {/* cadastrar ou atualizar */}
                {!frmEdit ? (
                  <>
                    {/* cadastrar */}
                    {/* 
                      sugestão: trocar por um único formulário 
                      utilizando apenas frmEditData e formatação condicional para os botões
                      ainda utilizando frmEdit
                    */}
                    <Input
                      type="text"
                      required={true}
                      id="nome"
                      name="nome"
                      placeholder="Nome"
                      value={frmEditData.nome}
                      manipulationFunction={(e) =>
                      setFrmEditData(prev => ({ ...prev, nome: e.target.value }))
                        }
                    />

                    <Input
                      type="text"
                      required={true}
                      id="descricao"
                      name="descricao"
                      placeholder="Descrição"
                      value={frmEditData.descricao}
                                          manipulationFunction={(e) =>
                    setFrmEditData(prev => ({
                    ...prev,
                    descricao: e.target.value
                    }))
                    }
                    />

                    <Select
                      id="tipo-evento"
                      name="IdTipoEvento"
                      required={true}
                      options={tipoEvento}
                      value={frmEditData.idTipoEvento || ""} 
                      optionValueKey="idTipoEvento"
                      optionLabelKey="titulo"
                     manipulationFunction={(e) =>
                    setFrmEditData(prev => ({
                    ...prev,
                    idTipoEvento: e.target.value
                    }))
                    }
                    />

                      <Select
                      id="instituicao"
                      name="IdInstituicao"
                      required={true}
                      options={instituicao}
                      value={frmEditData.idInstituicao}
                      optionValueKey="idInstituicao"
                      optionLabelKey="nomeFantasia" 
                      manipulationFunction={(e) =>
                    setFrmEditData(prev => ({
                    ...prev,
                    idInstituicao: e.target.value
                    }))
                    }
                      

                      
                    />

                    <Input
                      type="date"
                      required={true}
                      id="dataEvento"
                      name="dataEvento"
                      placeholder="Data do Evento"
                      value={frmEditData.dataEvento}
                     manipulationFunction={(e) =>
                    setFrmEditData(prev => ({
                    ...prev,
                    dataEvento: e.target.value
                    }))
                    }
                    />

                    <Button
                      name="cadastrar"
                      id="cadastrar"
                      textButton="Cadastrar"
                      additionalClass="btn-cadastrar"
                      // manipulationFunction = {(e) =>}
                    />
                  </>
                ) : (
                  <>
                    {/* editar */}
                    <Input
                      type="text"
                      required={true}
                      id="nome"
                      name="nome"
                      placeholder="Nome"
                      value={frmEditData.nome}
                      manipulationFunction={(e) => {
                        setFrmEditData({
                          ...frmEditData,
                          nome: e.target.value,
                        });
                      }}
                    />
                    <Input
                      type="text"
                      required={true}
                      id="descricao"
                      name="descricao"
                      placeholder="Descrição"
                      value={frmEditData.descricao}
                      manipulationFunction={(e) => {
                        setFrmEditData({
                          ...frmEditData,
                          descricao: e.target.value,
                        });
                      }}
                    />
                    <Select
                      id="tipo-evento"
                      name="IdTipoEvento"
                      required={true}
                      options={tipoEvento}
                      value={frmEditData.idTipoEvento || ""} 
                      optionValueKey="idTipoEvento"
                      optionLabelKey="titulo"
                     manipulationFunction={(e) =>
                    setFrmEditData(prev => ({
                    ...prev,
                    idTipoEvento: e.target.value
                    }))
                    }
                    />

                      <Select
                      id="instituicao"
                      name="IdInstituicao"
                      required={true}
                      options={instituicao}
                      value={frmEditData.idInstituicao}
                      optionValueKey="idInstituicao"
                      optionLabelKey="nomeFantasia" 
                      manipulationFunction={(e) =>
                    setFrmEditData(prev => ({
                    ...prev,
                    idInstituicao: e.target.value
                    }))
                    }
                      

                      
                    />
                    <Input
                      type="date"
                      required={true}
                      id="dataEvento"
                      name="dataEvento"
                      placeholder="Data do Evento"
                      value={truncateDateFromDb(frmEditData.dataEvento)}
                      // value="2023-01-05"
                      manipulationFunction={(e) => {
                        setFrmEditData({
                          ...frmEditData,
                          dataEvento: e.target.value,
                        });
                      }}
                    />

                    {/* botões de ação */}
                    <div className="buttons-editbox">
                      <Button
                        name="atualizar"
                        id="atualizar"
                        textButton="Atualizar"
                        additionalClass="button-component--middle"
                      />
                      <Button
                        name="cancelar"
                        id="cancelar"
                        textButton="Cancelar"
                        type="reset"
                        manipulationFunction={() => {
                          editActionAbort();
                        }}
                        additionalClass="button-component--middle"
                      />
                    </div>
                  </>
                )}
              </form>
            </div>
          </Container>
        </section>

        {/* Listagem de tipo de eventos */}
        <section className="lista-eventos-section">
          <Container>
            <Title titleText={"Lista de Eventos"} color="white" />
            <Table
              dados={eventos}
              fnDelete={handleDelete}
              fnUpdate={showUpdateForm}
            />
          </Container>
        </section>
      </MainContent>

      {/* SPINNER -Feito com position */}
      {showSpinner ? <Spinner /> : null}

      {/* CARD NOTIFICATION */}
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}
    </>
  );
}
