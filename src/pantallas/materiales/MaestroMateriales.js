import React, { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { Container, Alert, Button, Navbar, Nav, FormControl, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';

import { FaPlus,  FaSync, FaPills, FaFilter, FaRedo } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';


import CardMaterial from './CardMaterial';
import ModalCrearMaterial from 'pantallas/materiales/ModalCrearMaterial';
import ModalEditarMaterial from 'pantallas/materiales/ModalEditarMaterial';
import ModalEliminarMaterial from 'pantallas/materiales/ModalEliminarMaterial';

const PantallaMaestroMateriales = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoConsultaListaMateriales, ejecutarConsulta: ejecutarConsultaListaMateriales } = useApiCall('/material', jwt.token);

	const refFiltroTexto = useRef();
	const [filtroTexto, _setFiltroTexto] = useState('');

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


		let arrayMateriales = resultadoConsultaListaMateriales.datos.data;

		if (filtroTexto) {
			arrayMateriales = arrayMateriales.filter((datosMaterial) => {
				return (datosMaterial.cn?.toLowerCase().includes(filtroTexto) ||
					datosMaterial.ean?.toLowerCase().includes(filtroTexto) ||
					
					datosMaterial.name_origin?.toLowerCase().includes(filtroTexto) ||
					datosMaterial.name_spain?.toLowerCase().includes(filtroTexto) ||

					datosMaterial.prov_name?.toLowerCase().includes(filtroTexto) ||
					datosMaterial.country_name?.toLowerCase().includes(filtroTexto)
				);
			})
		}

		let proveedores = arrayMateriales.map((datosMaterial, i) => {
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

						<Button size="sm" variant="outline-dark" className="mr-md-4 mb-2 mb-md-0" onClick={() => setMostrarModalCreacion(true)}>
							<Icono icono={FaPlus} posicion={[18, 2]} /> Añadir material
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
			{filtroTexto && <Alert variant="info" className="mt-2 mx-5 py-1">
				<Button size="sm" variant="dark" className="float-right py-0" onClick={eliminarFiltroTexto} style={{ marginTop: '1px' }}>
					<Icono icono={FaRedo} posicion={[14, 3]} className="mr-1" />
					Quitar filtro
				</Button>
				<Icono icono={FaFilter} posicion={[20, 2]} /> Filtrando materiales por el texto "<em>{filtroTexto}</em>"
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


export default PantallaMaestroMateriales;