import React, { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { Container, Alert, Button, Navbar, Nav, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';

import { ContextoAplicacion } from 'contexto';
import PanelCarga from 'componentes/Cargando';

import { FaPlus, FaSync, FaBoxes, FaFilter, FaExclamation, FaCheckSquare, FaRegSquare, FaPlusSquare } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';


import CardTanda from './CardTanda';
import ModalEditarTanda from './ModalEditarTanda';
import ModalEliminarTanda from './ModalEliminarTanda';
import ModalCrearTanda from './ModalCrearTanda';
import useStateLocalStorage from 'hooks/useStateLocalStorage';

const PantallaTandas = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta: ejecutarConsultaListaTandas } = useApiCall('/series', jwt.token);


	const [mostrarModalCreacion, setMostrarModalCreacion] = useState(false);

	const refFiltroTexto = useRef();
	const [filtroTexto, _setFiltroTexto] = useState('');
	const [filtroEstado, setFiltoEstado] = useStateLocalStorage('filtroEstadoTanda', [1, 2, 3], true);
	

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
		if (ejecutarConsultaListaTandas)
			ejecutarConsultaListaTandas({ url: '/series?status=' + (filtroEstado.length ? filtroEstado.join(',') : '0') })
	}, [ejecutarConsultaListaTandas, filtroEstado]);


	const cambiarFiltroTexto = useCallback((forzar) => {
		let valorCampo = (refFiltroTexto.current?.value?.trim() ?? '')
		let longitudBusqueda = valorCampo.length;
		if (forzar || longitudBusqueda === 0 || longitudBusqueda >= 3 || (filtroTexto?.length && longitudBusqueda >= filtroTexto.length))
			_setFiltroTexto(refFiltroTexto.current.value.trim().toLowerCase());
		else
			_setFiltroTexto('');
	}, [refFiltroTexto, filtroTexto])

	/*
	const eliminarFiltros = useCallback(() => {
		refFiltroTexto.current.value = '';
		cambiarFiltroTexto(true);
		setFiltoEstado([1, 2]);
	}, [refFiltroTexto, cambiarFiltroTexto])
	*/

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

		let arrayTandas = resultado.datos.data
		if (filtroTexto) {
			arrayTandas = arrayTandas.filter((datosTanda) => {
				return (datosTanda.name?.toLowerCase().includes(filtroTexto))
			})
		}

		let tandas = arrayTandas.map((datosTanda, i) => {
			return <CardTanda
				key={i}
				datosTanda={datosTanda}
				mostrarBotones={true}
				onBorrarPulsado={() => mostrarModalEliminarTanda(datosTanda)}
				onEditarPulsado={() => mostrarModalEditarProveedor(datosTanda)}
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

					</Nav>

					<div className="ml-md-4 mt-2 mt-md-0 mr-1 mr-md-0">
						<InputGroup >
							<InputGroup.Prepend>
								<FiltroEstadoTanda onFiltroCambiado={setFiltoEstado} valor={filtroEstado} />
							</InputGroup.Prepend>
							<FormControl size="sm" placeholder="Buscar texto" defaultValue={filtroTexto} ref={refFiltroTexto} onChange={() => cambiarFiltroTexto(false)} onKeyPress={(e) => { if (e.key === 'Enter') cambiarFiltroTexto(true) }} />
							<InputGroup.Append>
								<Button size="sm" variant="outline-secondary" onClick={() => cambiarFiltroTexto(true)}><Icono icono={FaFilter} posicion={[14, 2]} /></Button>
							</InputGroup.Append>

						</InputGroup>
						

					</div>
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
				datosTanda={{ ...datosTandaEditar, assig_users: [{ id_user: 1 }] }}
				onRespuestaNo={() => setMostrarModalEditar(false)}
				onRespuestaSi={() => { setMostrarModalEditar(false); ejecutarConsultaListaTandas(); }}
			/>

			{Boolean(filtroTexto || filtroEstado.length < 3) && <Alert variant="info" className="mt-2 mx-5 py-1">

				{filtroEstado.length === 0 &&
					<><Icono icono={FaExclamation} posicion={[20, 2]} /> No se muestran tandas porque no ha seleccionado ningún estado.</>
				}

				{filtroEstado.length === 1 &&
					<><Icono icono={FaFilter} posicion={[20, 2]} /> Mostrando únicamente tandas en estado "<em>
						{filtroEstado.includes(1) && 'Creada'}
						{filtroEstado.includes(2) && 'Lanzada'}
						{filtroEstado.includes(3) && 'Finalizada'}
					</em>"</>
				}

				{filtroEstado.length === 2 &&
					<><Icono icono={FaFilter} posicion={[20, 2]} /> Ocultando tandas en estado "<em>
						{filtroEstado.includes(1) || 'Creada'}
						{filtroEstado.includes(2) || 'Lanzada'}
						{filtroEstado.includes(3) || 'Finalizada'}
					</em>"</>
				}


				{Boolean(filtroTexto && filtroEstado.length < 3 && filtroEstado.length > 0) && <> y c</>}
				{Boolean(filtroTexto && filtroEstado.length === 3) && <><Icono icono={FaFilter} posicion={[20, 2]} /> Filtrando tandas c</>}

				{Boolean(filtroTexto && filtroEstado.length > 0) && <>uyo nombre contiene el texto "<em>{filtroTexto}</em>"</>}
			</Alert>}

			{tandas}
		</>

	}



	return (
		<Container>
			{contenido}
		</Container>

	)
}




const CustomMenu = React.forwardRef(
	({ style, className, 'aria-labelledby': labeledBy, onValorCambiado, valor }, ref) => {

		let mostrarCreadas = valor.includes(1);
		let mostrarLanzadas = valor.includes(2);
		let mostrarCerradas = valor.includes(3);

		const valorFiltroCambiado = useCallback((valorCambiado) => {

			let nuevoFiltro = [];

			switch (valorCambiado) {
				case 0: nuevoFiltro = [true, true, true]; break;
				case 1: nuevoFiltro = [!mostrarCreadas, mostrarLanzadas, mostrarCerradas]; break;
				case 2: nuevoFiltro = [mostrarCreadas, !mostrarLanzadas, mostrarCerradas]; break;
				case 3: nuevoFiltro = [mostrarCreadas, mostrarLanzadas, !mostrarCerradas]; break;
				default: break;
			}

			nuevoFiltro = nuevoFiltro.map((val, i) => {
				if (val) return i + 1
				else return null
			}).filter((val) => {
				return val !== null
			})

			onValorCambiado(nuevoFiltro);

		}, [onValorCambiado, mostrarCreadas, mostrarLanzadas, mostrarCerradas]);

		let iconoActivo = <Icono icono={FaCheckSquare} posicion={[16,4]} />
		let iconoIntermedio = <Icono icono={FaPlusSquare} posicion={[16, 4]} />
		let iconoInactivo = <Icono icono={FaRegSquare} posicion={[16, 4]} />

		return (

			<div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>


				

				<div className="my-1 mx-2">
					<Button variant='outline-primary' size="sm" className="p-0 px-2 w-100 text-left border-0" onClick={() => { valorFiltroCambiado(1) }}>
						{mostrarCreadas ? iconoActivo : iconoInactivo} Creadas
						</Button>
				</div>
				<div className="my-1 mx-2">
					<Button variant='outline-success' size="sm" className="p-0 px-2 w-100 text-left border-0" onClick={() => { valorFiltroCambiado(2) }}>
						{mostrarLanzadas ? iconoActivo : iconoInactivo} Lanzadas
						</Button>
				</div>
				<div className="my-1 mx-2">
					<Button variant='outline-dark' size="sm" className="p-0 px-2 w-100 text-left border-0" onClick={() => { valorFiltroCambiado(3) }}>
						{mostrarCerradas ? iconoActivo : iconoInactivo}  Finalizadas
						</Button>
				</div>

				<hr className="mb-1 mt-2" />
				<div className="my-1 mx-2">
					<Button variant='outline-info' size="sm" className="p-0 px-2 w-100 text-left border-0" onClick={() => { valorFiltroCambiado(0) }}>
						{(mostrarCreadas && mostrarLanzadas && mostrarCerradas) ?
							iconoActivo :
							((mostrarCreadas || mostrarLanzadas || mostrarCerradas) ? iconoIntermedio : iconoInactivo)
						} Marcar Todo
						</Button>
				</div>

	
			</div>

		);
	},
);


const FiltroEstadoTanda = ({ valor, onFiltroCambiado }) => {

	return <Dropdown >
		<Dropdown.Toggle variant="dark" size="sm" split>
			<span className="mr-2">Filtrar estados</span>
		</Dropdown.Toggle>
		<Dropdown.Menu as={CustomMenu} onValorCambiado={onFiltroCambiado} valor={valor} flip >
		</Dropdown.Menu>
	</Dropdown>
}





export default PantallaTandas;