import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Container, Alert, Button, Navbar, Nav, Form, FormControl, Dropdown, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';

import { FaSearch, FaPlus, FaFileExport, FaFileExcel, FaFileCsv, FaFilePdf, FaSync, FaBoxes } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';


import CardTanda from './CardTanda';
import ModalEditarTanda from './ModalEditarTanda';
import ModalEliminarTanda from './ModalEliminarTanda';
import ModalCrearTanda from './ModalCrearTanda';

const PantallaTandas = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta: ejecutarConsultaListaTandas } = useApiCall('/series', jwt.token);


	const [mostrarModalCreacion, setMostrarModalCreacion] = useState(false);


	// Control del dialogo de edicion del proveedor
	const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
	const [datosTandaEditar, setDatosTandaEditar] = useState(null);
	const mostrarModalEditarProveedor = useCallback((datosTanda) => {
		setDatosTandaEditar(datosTanda);
		setMostrarModalEditar(true);
	}, [setDatosTandaEditar, setMostrarModalEditar]);


	// Control del dialogo de eliminacion del proveedor
	const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
	const [datosTandaEliminar, setDatosTandaEliminar] = useState(null);
	const mostrarModalEliminarTanda = useCallback((datosProveedor) => {
		setDatosTandaEliminar(datosProveedor);
		setMostrarModalEliminar(true);
	}, [setDatosTandaEliminar, setMostrarModalEliminar]);



	useEffect(() => {
		if (ejecutarConsultaListaTandas) ejecutarConsultaListaTandas()
	}, [ejecutarConsultaListaTandas]);


	let contenido = null;

	if (resultado.cargando) {
		contenido = <PanelCarga texto="Obteniendo lista de tandas ..." />
	} else if (resultado.error) {
		contenido = <Alert variant="danger">
			<Button className="float-right" size="sm" variant="light" onClick={ejecutarConsultaListaTandas}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Reintentar</Button>
			<h5>Ocurrió un error</h5>
			<code>{resultado.error.message}</code>
		</Alert>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		contenido = <>
			<Alert variant="dark">
				<Button className="float-right" size="sm" variant="dark" onClick={ejecutarConsultaListaTandas}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Recargar</Button>
				<h5>Lista de tandas vacía</h5>
				<div><small>No se ha encontrado ninguna tanda. Pruebe a añadir alguna</small></div>

				<Button className="float-center mt-2" size="lg" variant="dark" onClick={() => setMostrarModalCreacion(true)}>
					<Icono icono={FaBoxes} posicion={[18, 2]} /> Añadir nueva tanda
			</Button>
			</Alert>
			<ModalCrearTanda
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaTandas(); }}
			/>
		</>
	} else {

		let proveedores = resultado.datos.data.map((datosProveedor, i) => {
			return <CardTanda
				key={i}
				datosTanda={datosProveedor}
				mostrarBotones={true}
				onBorrarPulsado={() => mostrarModalEliminarTanda(datosProveedor)}
				onEditarPulsado={() => mostrarModalEditarProveedor(datosProveedor)}
			/>
		})

		contenido = <>
			<Navbar sticky="top" bg="light" variant="light" expand="md" className="rounded" expanded>
				<Navbar.Brand href="#home" as="h5"><Icono icono={FaBoxes} posicion={[18, 2]} /> Tandas</Navbar.Brand>

				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">

						<Button size="sm" variant="outline-dark" className="mr-1" onClick={() => setMostrarModalCreacion(true)}>
							<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir tanda
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

			<ModalCrearTanda
				show={mostrarModalCreacion}
				onRespuestaNo={() => setMostrarModalCreacion(false)}
				onRespuestaSi={() => { setMostrarModalCreacion(false); ejecutarConsultaListaTandas(); }}
			/>

			<ModalEliminarTanda
				show={mostrarModalEliminar}
				datosTanda={datosTandaEliminar}
				onRespuestaNo={() => setMostrarModalEliminar(false)}
				onRespuestaSi={() => { setMostrarModalEliminar(false); ejecutarConsultaListaTandas(); }}
			/>


			<ModalEditarTanda
				show={mostrarModalEditar}
				datosTanda={{...datosTandaEditar, assig_users: [{id_user: 1}]}}
				onRespuestaNo={() => setMostrarModalEditar(false)}
				onRespuestaSi={() => { setMostrarModalEditar(false); ejecutarConsultaListaTandas(); }}
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


export default PantallaTandas;