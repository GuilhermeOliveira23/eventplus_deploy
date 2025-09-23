import React from 'react';
import './VisionSection.css';
import Title from '../Title/Title';

const VisionSection = () => {
    return (
        <section className='vision'>
            <div className="vision__box" style={{ paddingTop: "2.5%" }}>
                <Title 
                    titleText={"Visão"}
                    color='white'
                    potatoClass='vision__title'
                />
                <p className='vision__text'>Olá, Bem vindo ao EventPlus! Aqui você pode participar de eventos do Senai! Essa aplicação tem funções de Cadastro, Login, Presença em Eventos e mais! Eu fiz a API desse projeto no ASP.NET usando C#, e utilizei pacotes NPM como navigation, react e entre outros.
                </p>
            </div>
        </section>
    );
};

export default VisionSection;