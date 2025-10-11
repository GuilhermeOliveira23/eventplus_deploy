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
                <p className='vision__text'>
    Bem-vindo ao EventPlus!
    O EventPlus é a minha solução completa para gerenciamento de eventos, um projeto desenvolvido de ponta a ponta por mim. A plataforma permite a criação, visualização, edição e exclusão de eventos de forma simples e segura, com autenticação e controle de acesso.
    Como Acessar:
    Painel do Administrador: Para gerenciar e criar eventos, utilize o login admin@gmail.com.
    Interface do Usuário: Para participar e comentar nos eventos, acesse com comum@gmail.com.
    A senha para ambas as contas é preenchida automaticamente para sua conveniência.
    Feedbacks são bem vindos!
                </p>
            </div>
        </section>
    );
};

export default VisionSection;