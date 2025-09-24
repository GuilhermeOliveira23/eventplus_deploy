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
                <p className='vision__text'>EventPlus é um sistema de gerenciamento de eventos que permite o cadastro, autenticação e controle de acesso de usuários. Com ele, você pode criar, visualizar, editar e excluir eventos de forma simples e segura. O sistema oferece login protegido, diferentes níveis de autorização e uma interface intuitiva para facilitar a organização e participação em eventos. Para testar: Administrador → admin@gmail.com / 123456 | Usuário comum → comum@gmail.com / 123456.
                </p>
            </div>
        </section>
    );
};

export default VisionSection;