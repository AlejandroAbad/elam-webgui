import React, { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { Container, Alert, Button, Navbar, Nav, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';

import { FaPlus, FaSync, FaUser, FaFilter, FaRemoveFormat, FaRedo } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';


import CardUsuario from './CardUsuario';
import ModalCrearUsuario from 'pantallas/usuarios/ModalCrearUsuario';
import ModalEditarUsuario from 'pantallas/usuarios/ModalEditarUsuario';
import ModalEliminarUsuario from 'pantallas/usuarios/ModalEliminarUsuario';

const PantallaMaestroUsuarios = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta: ejecutarConsultaListaUsuarios } = useApiCall('/user', jwt.token);

	const refFiltroTexto = useRef();
	const [filtroTexto, _setFiltroTexto] = useState('');


	const [mostrarModalCreacion, setMostrarModalCreacion] = useState(false);


	// Control del dialogo de edicion del usuario
	const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
	const [datosUsuarioEditar, setDatosUsuarioEditar] = useState(null);
	const mostrarModalEditarUsuario = useCallback((datosUsuario) => {
		setDatosUsuarioEditar(datosUsuario);
		setMostrarModalEditar(true);
	}, [setDatosUsuarioEditar, setMostrarModalEditar]);


	// Control del dialogo de eliminacion del usuario
	const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
	const [datosUsuarioEliminar, setDatosUsuarioEliminar] = useState(null);
	const mostrarModalEliminarUsuario = useCallback((datosUsuario) => {
		setDatosUsuarioEliminar(datosUsuario);
		setMostrarModalEliminar(true);
	}, [setDatosUsuarioEliminar, setMostrarModalEliminar]);



	useEffect(() => {
		if (ejecutarConsultaListaUsuarios) ejecutarConsultaListaUsuarios()
	}, [ejecutarConsultaListaUsuarios]);


	const cambiarFiltroTexto = useCallback((forzar) => {
		let valorCampo = (refFiltroTexto.current?.value?.trim() ?? '')
		let longitudBusqueda = valorCampo.length;

		

		if (forzar || longitudBusqueda === 0 || longitudBusqueda >= 3 || (filtroTexto?.length && longitudBusqueda >= filtroTexto.length))
			_setFiltroTexto(refFiltroTexto.current.value.trim().toLowerCase());
		else 
			_setFiltroTexto('');
	}, [refFiltroTexto, filtroTexto])

	const eliminarFiltroTexto = useCallback(() => {
			refFiltroTexto.current.value = '';
			cambiarFiltroTexto(true);
	}, [refFiltroTexto, cambiarFiltroTexto])


	let contenido = null;

	if (resultado.cargando) {
		contenido = <PanelCarga />
	} else if (resultado.error) {
		contenido = <Alert variant="danger">
			<Button className="float-right" size="sm" variant="light" onClick={ejecutarConsultaListaUsuarios}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Reintentar</Button>
			<h5>Ocurrió un error</h5>
			<code>{resultado.error.message}</code>
		</Alert>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		contenido = <>
			<Alert variant="dark">
				<Button className="float-right" size="sm" variant="dark" onClick={ejecutarConsultaListaUsuarios}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Recargar</Button>
				<h5>Lista de usuarios vacía</h5>
				<div><small>No se han encontrado usuarios. Pruebe a añadir alguno</small></div>

				<Button className="float-center mt-2" size="lg" variant="dark" onClick={() => setMostrarModalCreacion(true)}>
					<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir usuario
			</Button>
			</Alert>
			<ModalCrearUsuario
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaUsuarios(); }}
			/>
		</>
	} else {

		let arrayUsuarios = resultado.datos.data
		if (filtroTexto) {
			arrayUsuarios = arrayUsuarios.filter( (datosUsuario) => {
				return (datosUsuario.name?.toLowerCase().includes(filtroTexto) ||
					datosUsuario.user?.toLowerCase().includes(filtroTexto));
			})
		}
		

		let usuarios = arrayUsuarios.map((datosUsuario, i) => {
			return <CardUsuario
				key={i}
				datosUsuario={datosUsuario}
				mostrarBotones={true}
				onBorrarPulsado={() => mostrarModalEliminarUsuario(datosUsuario)}
				onEditarPulsado={() => mostrarModalEditarUsuario(datosUsuario)}
			/>
		})

		contenido = <>
			<Navbar sticky="top" bg="light" variant="light" expand="md" className="rounded" expanded>
				<Navbar.Brand href="#home" as="h5"><Icono icono={FaUser} posicion={[18, 2]} /> Usuarios</Navbar.Brand>

				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">

						<Button size="sm" variant="outline-dark" className="mr-4" onClick={() => setMostrarModalCreacion(true)}>
							<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir usuario
						</Button>

					</Nav>

					<Form inline>
						<InputGroup>
							<FormControl size="sm" placeholder="Filtar" defaultValue={filtroTexto} ref={refFiltroTexto} onChange={() => cambiarFiltroTexto(false)} />
							<InputGroup.Append>
								<Button size="sm" variant="outline-secondary" onClick={() => cambiarFiltroTexto(true)}><Icono icono={FaFilter} posicion={[14, 2]} /></Button>
							</InputGroup.Append>
						</InputGroup>
					</Form>
				</Navbar.Collapse>
			</Navbar>

			<ModalCrearUsuario
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaUsuarios(); }}
			/>

			<ModalEliminarUsuario
				show={mostrarModalEliminar}
				datosUsuario={datosUsuarioEliminar}
				onRespuestaNo={() => setMostrarModalEliminar(false)}
				onRespuestaSi={() => { setMostrarModalEliminar(false); ejecutarConsultaListaUsuarios(); }}
			/>


			<ModalEditarUsuario
				show={mostrarModalEditar}
				datosUsuario={datosUsuarioEditar}
				onRespuestaNo={() => setMostrarModalEditar(false)}
				onRespuestaSi={() => { setMostrarModalEditar(false); ejecutarConsultaListaUsuarios(); }}
			/>

			{filtroTexto && <Alert variant="info" className="mt-2 mx-5 py-1">
				<Icono icono={FaFilter} posicion={[20,2]} /> Filtrando usuarios por el texto "<em>{filtroTexto}</em>"
				<Button size="sm" variant="dark" className="float-right py-0" onClick={eliminarFiltroTexto} style={{marginTop: '1px'}}>
					<Icono icono={FaRedo} posicion={[14, 3]} className="mr-1" />
					Quitar filtro
				</Button>
			</Alert>}
			{usuarios}
		</>

	}



	return (
		<Container>





			{contenido}

		</Container>

	)
}


export default PantallaMaestroUsuarios;