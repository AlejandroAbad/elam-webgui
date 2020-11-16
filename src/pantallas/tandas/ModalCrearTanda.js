import React, { useContext, useRef, useCallback, useState, useEffect } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import SelectorTipoTanda from './SelectorTipoTanda';
import SelectorEstadoTanda from './SelectorEstadoTanda';
import SelectorMaterialTanda from './SelectorMaterialTanda';
import SelectorUsuariosTanda from './SelectorUsuariosTanda';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import SelectorProveedorTanda from './SelectorProveedorTanda';
import { FaInfoCircle } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';

registerLocale('es', es)
setDefaultLocale('es');


const ModalCrearTanda = ({ onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/series', jwt.token)

	const [usuariosTandaCargados, setUsuariosTandaCargados] = useState(false);
	const [materialesTandaCargados, setMaterialesTandaCargados] = useState(false);
	const [proveedoresTandaCargados, setProveedoresTandaCargados] = useState(false);
	const [tiposTandaCargados, setTiposTandaCargados] = useState(false);
	const [estadosTandaCargados, setEstadosTandaCargados] = useState(false);

	const [materialSeleccionado, setMaterialSeleccionado] = useState(null);
	const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

	const refNombre = useRef();
	const refTipo = useRef();
	const refEstado = useRef();
	const refMaterial = useRef();
	const refProveedor = useRef();
	const refUsuarios = useRef();
	const refLote = useRef();
	const refCaducidad = useRef();

	const cerrarModal = useCallback((respuesta) => {
		resetearResultado();
		if (respuesta === true) onRespuestaSi()
		else onRespuestaNo();
	}, [onRespuestaNo, onRespuestaSi, resetearResultado]);

	const ejecutarLlamadaCrearTanda = useCallback(() => {

		let peticionCrearTanda = {
			name: refNombre.current.value,
			id_type: parseInt(refTipo.current.value),
			id_status: parseInt(refEstado.current.value),
			id_mat: refMaterial.current?.value,
			id_provider: refProveedor.current?.value,
			batch: refLote.current?.value || "",
			exp_date: refCaducidad.current?.value || "",
			assig_users: refUsuarios.current?.value ? refUsuarios.current.value.map((val) => { return { id_user: val } }) : []
		}

		ejecutarConsulta({ method: 'POST', body: peticionCrearTanda }, (error, res) => {
			if (error) {
				return;
			}
			toast.success(<>
				Se ha creado una nueva tanda
				<h5 className="text-uppercase mt-3">
					{peticionCrearTanda.name}
				</h5>
			</>);
			cerrarModal(true);
		})

	}, [ejecutarConsulta, cerrarModal]);


	/** Este effect reinicia el estado de los selecctores de material y proveedor al abrir/cerrar el modal */
	useEffect ( () => {
		setMaterialSeleccionado(null);
		setProveedorSeleccionado(null);
	}, [props.show])

	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Creando tanda
		</Alert>

	} else if (resultado.error) {

		alertaSuperior = <Alert variant="danger">
			<h6>Error en la creación de la tanda</h6>
			<code>{resultado.error.message}</code>
		</Alert>
	}

	contenidoModal = <>
		<Modal.Body>
			{alertaSuperior}
			<Form>
				<Form.Group as={Row}>
					<Form.Label column sm="2" >Nombre</Form.Label>
					<Col sm="10">
						<Form.Control type="text" placeholder="" ref={refNombre} disabled={resultado.cargando} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">Tipo</Form.Label>
					<Col sm="6">
						<SelectorTipoTanda referencia={refTipo} disabled={resultado.cargando} onTiposTandaCargados={setTiposTandaCargados} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Estado</Form.Label>
					<Col sm="6">
						<SelectorEstadoTanda referencia={refEstado} disabled={resultado.cargando} onEstadosTandaCargados={setEstadosTandaCargados} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Material</Form.Label>
					<Col>
						<SelectorMaterialTanda
							referencia={refMaterial}
							disabled={resultado.cargando}
							onMaterialesTandaCargados={setMaterialesTandaCargados}
							modoEdicion={false}
							onMaterialSeleccionado={setMaterialSeleccionado}
						/>
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Proveedor</Form.Label>
					<Col>
						{materialSeleccionado?.value ?
							<SelectorProveedorTanda
								referencia={refProveedor}
								disabled={resultado.cargando}
								onProveedoresTandaCargados={setProveedoresTandaCargados}
								modoEdicion={false}
								materialSeleccionado={materialSeleccionado?.value}
								onProveedorSeleccionado={setProveedorSeleccionado}
							/>
							:
							<small className="text-muted"><em><Icono icono={FaInfoCircle} posicion={[16,2]} /> Seleccione primero un material</em></small>
						}
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Usuarios</Form.Label>
					<Col>
						<SelectorUsuariosTanda
							referencia={refUsuarios}
							disabled={resultado.cargando}
							onUsuariosTandaCargados={setUsuariosTandaCargados}
							modoEdicion={false} />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2" >Lote</Form.Label>
					<Col sm="4">
						<Form.Control type="text" placeholder="" ref={refLote} disabled={resultado.cargando} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2" >Caducidad</Form.Label>
					<Col sm="4">
						<InputCaducidad innerRef={refCaducidad} disabled={resultado.cargando} />
					</Col>
				</Form.Group>



			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaCrearTanda} disabled={resultado.cargando || !tiposTandaCargados || !estadosTandaCargados || !materialesTandaCargados || !proveedoresTandaCargados || proveedorSeleccionado == null || !usuariosTandaCargados } >Crear</Button>
			<Button variant="outline-dark" onClick={cerrarModal} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>

	return <Modal {...props} onHide={cerrarModal} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Añadir nueva tanda
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}



const InputCaducidad = ({ innerRef, disabled }) => {

	const [valor, _setValor] = useState(null)
	const setValor = useCallback((valorNuevo) => {

		let valorReferencia = null;
		if (valorNuevo) {
			let dd = valorNuevo.getDate();
			let mm = valorNuevo.getMonth() + 1; // getMonth() va de 0 a 11
			valorReferencia = [(dd > 9 ? '' : '0') + dd, (mm > 9 ? '' : '0') + mm, valorNuevo.getFullYear()].join('.');
		}

		innerRef.current = { value: valorReferencia };
		_setValor(valorNuevo);
	}, [innerRef, _setValor]);

	return <DatePicker
		disabled={disabled}
		onChange={setValor}
		selected={valor}
		isClearable
		className="form-control"
		locale="es"
		dateFormat="dd.MM.yyyy"
		showYearDropdown
		showMonthDropdown
		minDate={new Date()}
	/>
}


export default ModalCrearTanda;