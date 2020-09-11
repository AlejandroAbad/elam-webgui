import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Container, Alert, Button, Navbar, Nav, Form, FormControl, Dropdown, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';

import { FaSearch, FaPlus, FaFileExport, FaFileExcel, FaFileCsv, FaFilePdf, FaSync } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';


import CardProveedor from './CardProveedor';
import ModalCrearProveedor from 'pantallas/proveedores/ModalCrearProveedor';
import ModalEditarProveedor from 'pantallas/proveedores/ModalEditarProveedor';
import ModalEliminarProveedor from 'pantallas/proveedores/ModalEliminarProveedor';

const PantallaMaestroProveedores = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta: ejecutarConsultaListaProveedores } = useApiCall('/provider', jwt.token);


	const [mostrarModalCreacion, setMostrarModalCreacion] = useState(false);


	// Control del dialogo de edicion del proveedor
	const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
	const [datosProveedorEditar, setDatosProveedorEditar] = useState(null);
	const mostrarModalEditarProveedor = useCallback((datosProveedor) => {
		setDatosProveedorEditar(datosProveedor);
		setMostrarModalEditar(true);
	}, [setDatosProveedorEditar, setMostrarModalEditar]);


	// Control del dialogo de eliminacion del proveedor
	const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
	const [datosProveedorEliminar, setDatosProveedorEliminar] = useState(null);
	const mostrarModalEliminarProveedor = useCallback((datosProveedor) => {
		setDatosProveedorEliminar(datosProveedor);
		setMostrarModalEliminar(true);
	}, [setDatosProveedorEliminar, setMostrarModalEliminar]);



	useEffect(() => {
		if (ejecutarConsultaListaProveedores) ejecutarConsultaListaProveedores()
	}, [ejecutarConsultaListaProveedores]);


	let contenido = null;

	if (resultado.cargando) {
		contenido = <PanelCarga />
	} else if (resultado.error) {
		contenido = <Alert variant="danger">
			<Button className="float-right" size="sm" variant="light" onClick={ejecutarConsultaListaProveedores}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Reintentar</Button>
			<h5>Ocurrió un error</h5>
			<code>{resultado.error.message}</code>
		</Alert>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		contenido = <>
			<Alert variant="dark">
				<Button className="float-right" size="sm" variant="dark" onClick={ejecutarConsultaListaProveedores}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Recargar</Button>
				<h5>Lista de proveedores vacía</h5>
				<div><small>No se han encontrado proveedores. Pruebe a añadir alguno</small></div>

				<Button className="float-center mt-2" size="lg" variant="dark" onClick={() => setMostrarModalCreacion(true)}>
					<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir proveedor
			</Button>
			</Alert>
			<ModalCrearProveedor
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaProveedores(); }}
			/>
		</>
	} else {

		let proveedores = resultado.datos.data.map((datosProveedor, i) => {
			return <CardProveedor
				key={i}
				datosProveedor={datosProveedor}
				mostrarBotones={true}
				onBorrarPulsado={() => mostrarModalEliminarProveedor(datosProveedor)}
				onEditarPulsado={() => mostrarModalEditarProveedor(datosProveedor)}
			/>
		})

		contenido = <>
			<Navbar sticky="top" bg="light" variant="light" expand="md" className="rounded" expanded>
				<Navbar.Brand href="#home" as="h5">Proveedores</Navbar.Brand>

				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">

						<Button size="sm" variant="outline-dark" className="mr-1" onClick={() => setMostrarModalCreacion(true)}>
							<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir proveedor
						</Button>

						<Dropdown className="mr-5">
							<Dropdown.Toggle variant="outline-dark" size="sm">
								<Icono icono={FaFileExport} posicion={[18, 2]} /> Exportar
  							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item href="#/action-1"><Icono icono={FaFileExcel} posicion={[18, 2]} /> Excel</Dropdown.Item>
								<Dropdown.Item href="#/action-2"><Icono icono={FaFileCsv} posicion={[18, 2]} /> CSV</Dropdown.Item>
								<Dropdown.Item href="#/action-3"><Icono icono={FaFilePdf} posicion={[18, 2]} /> PDF</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>

					</Nav>

					<Form inline>
						<InputGroup>
							<FormControl size="sm" placeholder="Buscar" />
							<InputGroup.Append>
								<Button size="sm" variant="outline-secondary"><Icono icono={FaSearch} posicion={[14, 2]} /></Button>
							</InputGroup.Append>
						</InputGroup>
					</Form>
				</Navbar.Collapse>
			</Navbar>

			<ModalCrearProveedor
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaProveedores(); }}
			/>

			<ModalEliminarProveedor
				show={mostrarModalEliminar}
				datosProveedor={datosProveedorEliminar}
				onRespuestaNo={() => setMostrarModalEliminar(false)}
				onRespuestaSi={() => { setMostrarModalEliminar(false); ejecutarConsultaListaProveedores(); }}
			/>


			<ModalEditarProveedor
				show={mostrarModalEditar}
				datosProveedor={datosProveedorEditar}
				onRespuestaNo={() => setMostrarModalEditar(false)}
				onRespuestaSi={() => { setMostrarModalEditar(false); ejecutarConsultaListaProveedores(); }}
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


export default PantallaMaestroProveedores;