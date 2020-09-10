import React, { useEffect, useContext, useState } from 'react';
import { Container, Alert, Button, Navbar, Nav, Form, FormControl, Dropdown, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import ReactJson from 'react-json-view';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';
import RegistroProveedor from './RegistroProveedor';
import { FaSearch, FaPlus, FaFileExport, FaFileExcel, FaFileCsv, FaFilePdf } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';



import ModalCreacionProveedor from 'pantallas/proveedores/FormularioCreacionProveedor';

const PantallaMaestroProveedores = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/provider', jwt.token);


	const [mostrarModalCreacion, setMostrarModalCreacion] = useState(false);

	useEffect(() => {
		if (ejecutarConsulta) ejecutarConsulta()
	}, [ejecutarConsulta]);


	let contenido = null;

	if (resultado.cargando) {
		contenido = <PanelCarga />
	} else if (resultado.error) {
		contenido = <Alert variant="danger">
			<h5>Ha petao</h5>
			<ReactJson src={resultado.error} />
		</Alert>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		contenido = <Alert variant="warning">
			<h5>Sin resultados</h5>
		</Alert>
	} else {

		console.log(resultado.datos)

		let proveedores = resultado.datos.data.map((datosProveedor, i) => {
			return <RegistroProveedor 
				key={i} 
				datosProveedor={datosProveedor} 
				onProveedorBorrado={() => ejecutarConsulta()}
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

			<ModalCreacionProveedor
				show={mostrarModalCreacion}
				onHide={() => setMostrarModalCreacion(false)}
				onUpdate={() => { setMostrarModalCreacion(false); ejecutarConsulta();  }}
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