import K from 'K';
import React, { useContext } from 'react';

import './BarraNavegacionSuperior.scss';

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { GoSignOut, GoPerson, } from 'react-icons/go';
import { FaBoxes, FaUserCheck, FaParachuteBox, FaDatabase, FaPills } from 'react-icons/fa';


import Icono from 'componentes/icono/Icono';

import { ContextoAplicacion } from 'contexto';


const BarraNavegacionSuperior = () => {


    const { jwt, setJwt } = useContext(ContextoAplicacion);

    let expandirEn = 'md';
    let temaBarra = "BarraSuperior bg-dark-soft"
    let titulo = <img src="logo.png" alt="ELAM" style={{ height: '32px' }} />

    if (!jwt || (jwt && jwt.id_profile === K.ROLES.ALMACEN)) {
        return (
            <Navbar className={temaBarra} collapseOnSelect expand={expandirEn} variant="light" fixed="top">
                <Navbar.Brand >{titulo}</Navbar.Brand>
                <Navbar.Toggle aria-controls="barraSuperior-navegador" />
                <Navbar.Collapse id="barraSuperior-navegador" >
                    {jwt && <Nav className="ml-auto ">
                        <MenuUsuario onLogout={() => setJwt(null)} jwt={jwt} />
                    </Nav>}
                </Navbar.Collapse>
            </Navbar>
        )
    }

    return (
        <Navbar className={temaBarra} collapseOnSelect expand={expandirEn} variant="light" fixed="top">
            <Navbar.Brand>
                <LinkContainer to="/">
                    <a href='/'>{titulo}</a>
                </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="barraSuperior-navegador" />
            <Navbar.Collapse id="barraSuperior-navegador" >
                <Nav className="mr-auto ml-10" >

                    <BotonNavegacion icono={FaDatabase} titulo="Maestros" mostrarEn="xl" >
                        <BotonNavegacion enlace="/maestro/materiales" icono={FaPills} titulo="Materiales" />
                        <BotonNavegacion enlace="/maestro/proveedores" icono={FaParachuteBox} titulo="Proveedores" />
                        <BotonNavegacion enlace="/maestro/usuarios" icono={FaUserCheck} titulo="Usuarios" />
                    </BotonNavegacion>

                    <BotonNavegacion enlace="/tandas" icono={FaBoxes} titulo="Tandas" mostrarEn="xl" />

                    {/*
                    <BotonNavegacion icono={FaBook} titulo="Informes" mostrarEn="xl" >
                        <BotonNavegacion enlace="/informes/a" icono={FaBookDead} titulo="Informe A" />
                        <BotonNavegacion enlace="/informes/b" icono={FaBattleNet} titulo="Informe B" />
                        <BotonNavegacion enlace="/informes/c" icono={FaPepperHot} titulo="Informe C" />
                    </BotonNavegacion>
                    */}

                </Nav>
                <Nav>
                    <MenuUsuario onLogout={() => setJwt(null)} jwt={jwt} />
                </Nav>
                <Nav>

                </Nav>
            </Navbar.Collapse>

        </Navbar>
    )
}


const MenuUsuario = ({ onLogout, ...props }) => {

    let jwt = props.jwt;
    if (!jwt) return null;
    return (
        <BotonNavegacion icono={GoPerson} titulo={<>{jwt.name}&nbsp;</>} className="MenuUsuario mr-3 border-lg rounded" esconderEn="md" mostrarEn="lg">
            { /* <BotonNavegacion titulo="Cuenta" enlace="/usuario" icono={GoInfo} /> */}
            <BotonNavegacion titulo="Cerrar sesión" enlace="#" icono={GoSignOut} onClick={onLogout} />
        </BotonNavegacion>
    )

}


const BotonNavegacion = ({ icono, className, esconderEn, mostrarEn, titulo, enlace, ...props }) => {

    let elementoIcono = icono ? <Icono icono={icono} posicion={[20, 3]} /> : null;

    let navClassName = 'BotonNavegacion ' + (className ?? '');
    let textClassName = 'TextoBotonNavegacion';
    if (esconderEn) textClassName += ' d-' + esconderEn + '-none';
    if (mostrarEn) textClassName += ' d-' + mostrarEn + '-inline-block';



    if (props.children) {
        return (
            <Nav.Item className={navClassName} {...props} >
                <NavDropdown rootCloseEvent='click' title={<span>{elementoIcono}<span className={textClassName}> {titulo}</span></span>}>
                    {props.children}
                </NavDropdown>
            </Nav.Item >
        );
    }

    enlace = enlace ?? '#'

    return (
        <Nav.Item className={navClassName} {...props}>
            {enlace ?
                <LinkContainer to={enlace}><Nav.Link>{elementoIcono}<span className={textClassName}> {titulo}</span></Nav.Link></LinkContainer>
                :
                <Nav.Link>{elementoIcono}<span className={textClassName}> {titulo}</span></Nav.Link>
            }
        </Nav.Item>
    );
}

export default BarraNavegacionSuperior;