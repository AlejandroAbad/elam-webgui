import React, { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { Container, Alert, Button, Navbar, Nav, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';

import { FaPlus, FaSync, FaParachuteBox, FaFilter, FaRedo } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';


import CardProveedor from './CardProveedor';
import ModalCrearProveedor from 'pantallas/proveedores/ModalCrearProveedor';
import ModalEditarProveedor from 'pantallas/proveedores/ModalEditarProveedor';
import ModalEliminarProveedor from 'pantallas/proveedores/ModalEliminarProveedor';

const PantallaMaestroProveedores = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoConsultaListaProveedores, ejecutarConsulta: ejecutarConsultaListaProveedores } = useApiCall('/provider', jwt.token);

	const refFiltroTexto = useRef();
	const [filtroTexto, _setFiltroTexto] = useState('');

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

	if (resultadoConsultaListaProveedores.cargando) {
		contenido = <PanelCarga />
	} else if (resultadoConsultaListaProveedores.error) {
		contenido = <Alert variant="danger">
			<Button className="float-right" size="sm" variant="light" onClick={ejecutarConsultaListaProveedores}><Icono icono={FaSync} posicion={[17, 3]} className="mr-1" />Reintentar</Button>
			<h5>Ocurrió un error</h5>
			<code>{resultadoConsultaListaProveedores.error.message}</code>
		</Alert>
	} else if (!resultadoConsultaListaProveedores.datos || resultadoConsultaListaProveedores.datos?.length === 0) {
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


		let arrayProveedores = resultadoConsultaListaProveedores.datos.data
		if (filtroTexto) {
			arrayProveedores = arrayProveedores.filter((datosProveedor) => {
				return (datosProveedor.name?.toLowerCase().includes(filtroTexto) ||
					datosProveedor.cif?.toLowerCase().includes(filtroTexto) ||
					datosProveedor.id_country?.toLowerCase().includes(filtroTexto) ||
					datosProveedor.country_name?.toLowerCase().includes(filtroTexto)
					);
			})
		}

		let proveedores = arrayProveedores.map((datosProveedor, i) => {
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
				<Navbar.Brand href="#home" as="h5"><Icono icono={FaParachuteBox} posicion={[18, 2]} /> Proveedores</Navbar.Brand>

				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">

						<Button size="sm" variant="outline-dark" className="mr-md-4 mb-2 mb-md-0" onClick={() => setMostrarModalCreacion(true)}>
							<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir proveedor
						</Button>
					</Nav>

					<div className="ml-md-4 mt-2 mt-md-0">
						<InputGroup>
							<FormControl size="sm" placeholder="Filtar" defaultValue={filtroTexto} ref={refFiltroTexto} onChange={() => cambiarFiltroTexto(false)} onKeyPress={(e) => { if (e.key === 'Enter') cambiarFiltroTexto(true) }}/>
							<InputGroup.Append>
								<Button size="sm" variant="outline-secondary" onClick={() => cambiarFiltroTexto(true)}><Icono icono={FaFilter} posicion={[14, 2]} /></Button>
							</InputGroup.Append>
						</InputGroup>
					</div>
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
			{filtroTexto && <Alert variant="info" className="mt-2 mx-5 py-1">
				<Button size="sm" variant="dark" className="float-right py-0" onClick={eliminarFiltroTexto} style={{ marginTop: '1px' }}>
					<Icono icono={FaRedo} posicion={[14, 3]} className="mr-1" />
					Quitar filtro
				</Button>
				<Icono icono={FaFilter} posicion={[20, 2]} /> Filtrando proveedores por el texto "<em>{filtroTexto}</em>"
			</Alert>}
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