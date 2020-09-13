import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Container, Alert, Button, Navbar, Nav, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';

import { FaSearch, FaPlus,  FaSync, FaPills } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';


import CardMaterial from './CardMaterial';
import ModalCrearMaterial from 'pantallas/materiales/ModalCrearMaterial';
import ModalEditarMaterial from 'pantallas/materiales/ModalEditarMaterial';
import ModalEliminarMaterial from 'pantallas/materiales/ModalEliminarMaterial';

const PantallaMaestroMateriales = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoConsultaListaMateriales, ejecutarConsulta: ejecutarConsultaListaMateriales } = useApiCall('/material', jwt.token);


	const [mostrarModalCreacion, setMostrarModalCreacion] = useState(false);


	// Control del dialogo de edicion del proveedor
	const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
	const [datosMaterialEditar, _setDatosMaterialEditar] = useState(null);
	const mostrarModalEditarMaterial = useCallback((datosProveedor) => {
		_setDatosMaterialEditar(datosProveedor);
		setMostrarModalEditar(true);
	}, [_setDatosMaterialEditar, setMostrarModalEditar]);


	// Control del dialogo de eliminacion del proveedor
	const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
	const [datosMaterialEliminar, _setDatosMaterialEliminar] = useState(null);
	const mostrarModalEliminarMaterial = useCallback((datosProveedor) => {
		_setDatosMaterialEliminar(datosProveedor);
		setMostrarModalEliminar(true);
	}, [_setDatosMaterialEliminar, setMostrarModalEliminar]);



	useEffect(() => {
		if (ejecutarConsultaListaMateriales) ejecutarConsultaListaMateriales()
	}, [ejecutarConsultaListaMateriales]);


	let contenido = null;

	if (resultadoConsultaListaMateriales.cargando) {
		contenido = <PanelCarga />
	} else if (resultadoConsultaListaMateriales.error) {
		contenido = <Alert variant="danger">
			<Button className="float-right" size="sm" variant="light" onClick={ejecutarConsultaListaMateriales}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Reintentar</Button>
			<h5>Ocurrió un error</h5>
			<code>{resultadoConsultaListaMateriales.error.message}</code>
		</Alert>
	} else if (!resultadoConsultaListaMateriales.datos || resultadoConsultaListaMateriales.datos?.length === 0) {
		contenido = <>
			<Alert variant="dark">
				<Button className="float-right" size="sm" variant="dark" onClick={ejecutarConsultaListaMateriales}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Recargar</Button>
				<h5>Lista de materiales vacía</h5>
				<div><small>No se han encontrado materiales. Pruebe a añadir alguno</small></div>

				<Button className="float-center mt-2" size="lg" variant="dark" onClick={() => setMostrarModalCreacion(true)}>
					<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir material
			</Button>
			</Alert>
			<ModalCrearMaterial
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaMateriales(); }}
			/>
		</>
	} else {

		let proveedores = resultadoConsultaListaMateriales.datos.data.map((datosMaterial, i) => {
			return <CardMaterial
				key={i}
				datosMaterial={datosMaterial}
				mostrarBotones={true}
				onBorrarPulsado={() => mostrarModalEliminarMaterial(datosMaterial)}
				onEditarPulsado={() => mostrarModalEditarMaterial(datosMaterial)}
			/>
		})

		contenido = <>
			<Navbar sticky="top" bg="light" variant="light" expand="md" className="rounded" expanded>
				<Navbar.Brand href="#home" as="h5"><Icono icono={FaPills} posicion={[18, 2]} /> Materiales</Navbar.Brand>

				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">

						<Button size="sm" variant="outline-dark" className="mr-4" onClick={() => setMostrarModalCreacion(true)}>
							<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir material
						</Button>

						{/*<Dropdown className="mr-5">
							<Dropdown.Toggle variant="outline-dark" size="sm">
								<Icono icono={FaFileExport} posicion={[18, 2]} /> Exportar
  							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item href="#/action-1"><Icono icono={FaFileExcel} posicion={[18, 2]} /> Excel</Dropdown.Item>
								<Dropdown.Item href="#/action-2"><Icono icono={FaFileCsv} posicion={[18, 2]} /> CSV</Dropdown.Item>
								<Dropdown.Item href="#/action-3"><Icono icono={FaFilePdf} posicion={[18, 2]} /> PDF</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>*/}

					</Nav>

					<Form inline>
						<InputGroup>
							<FormControl size="sm" placeholder="Filtrar" />
							<InputGroup.Append>
								<Button size="sm" variant="outline-secondary"><Icono icono={FaSearch} posicion={[14, 2]} /></Button>
							</InputGroup.Append>
						</InputGroup>
					</Form>
				</Navbar.Collapse>
			</Navbar>

			<ModalCrearMaterial
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaMateriales(); }}
			/>

			<ModalEliminarMaterial
				show={mostrarModalEliminar}
				datosMaterial={datosMaterialEliminar}
				onRespuestaNo={() => setMostrarModalEliminar(false)}
				onRespuestaSi={() => { setMostrarModalEliminar(false); ejecutarConsultaListaMateriales(); }}
			/>

			<ModalEditarMaterial
				show={mostrarModalEditar}
				datosMaterial={datosMaterialEditar}
				onRespuestaNo={() => setMostrarModalEditar(false)}
				onRespuestaSi={() => { setMostrarModalEditar(false); ejecutarConsultaListaMateriales(); }}
			/>
			{proveedores}
		</>

	}



	return (
		<Container>
			{contenido}
		</Container>
	)
}


export default PantallaMaestroMateriales;