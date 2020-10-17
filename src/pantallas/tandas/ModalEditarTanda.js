import React, { useContext, useRef, useCallback, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import SelectorTipoTanda from './SelectorTipoTanda';
import SelectorEstadoTanda from './SelectorEstadoTanda';
import SelectorMaterialesTanda from './SelectorMaterialesTanda';
import SelectorUsuariosTanda from './SelectorUsuariosTanda';

const ModalEditarTanda = ({ datosTanda, onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/series', jwt.token);


	const [usuariosTandaCargados, setUsuariosTandaCargados] = useState(false);
	const [materialesTandaCargados, setMaterialesTandaCargados] = useState(false);
	const [tiposTandaCargados, setTiposTandaCargados] = useState(false);
	const [estadosTandaCargados, setEstadosTandaCargados] = useState(false);

	const refNombre = useRef();
	const refTipo = useRef();
	const refEstado = useRef();
	const refMateriales = useRef();
	const refUsuarios = useRef();


	const cerrarModal = useCallback((respuesta) => {
		resetearResultado();
		if (respuesta === true) onRespuestaSi()
		else onRespuestaNo();
	}, [onRespuestaNo, onRespuestaSi, resetearResultado]);


	const ejecutarLlamadaEditarTanda = useCallback(() => {

		let peticionEditarTanda = {
			name: refNombre.current.value,
			id_type: parseInt(refTipo.current.value),
			id_status: parseInt(refEstado.current.value),
			assig_materials: [
				{
					id_mat: refMateriales.current?.value,
					batch: "DUMMY",
					exp_date: "25.10.2025",
					gtin_req: 0
				}
			],
			assig_users: refUsuarios.current?.value?.map((val) => { return { id_user: val } }),
		}



		ejecutarConsulta({
			url: '/series/' + datosTanda.id,
			method: 'PUT',
			body: peticionEditarTanda
		}, (error, res) => {
			if (error) {
				return;
			}
			toast.success(<>
				Se ha modificado la tanda
				<h5 className="text-uppercase mt-3">
					{peticionEditarTanda.name}
				</h5>
			</>);
			cerrarModal(true)
		})


	}, [datosTanda, ejecutarConsulta, cerrarModal]);


	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Modificando datos de tanda
		</Alert>

	} else if (resultado.error) {
		alertaSuperior = <Alert variant="danger">
			<h6>Error al modificar la tanda</h6>
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
						<Form.Control type="text" placeholder="" ref={refNombre} disabled={resultado.cargando} defaultValue={datosTanda?.name} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">Tipo</Form.Label>
					<Col sm="6">
						<SelectorTipoTanda referencia={refTipo} disabled={resultado.cargando} onTiposTandaCargados={setTiposTandaCargados} defaultValue={datosTanda?.id_type} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Estado</Form.Label>
					<Col sm="6">
						<SelectorEstadoTanda referencia={refEstado} disabled={resultado.cargando} onEstadosTandaCargados={setEstadosTandaCargados} defaultValue={datosTanda?.id_status} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Materiales</Form.Label>
					<Col>
						<SelectorMaterialesTanda referencia={refMateriales} disabled={resultado.cargando} onMaterialesTandaCargados={setMaterialesTandaCargados} idTanda={datosTanda?.id} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Usuarios</Form.Label>
					<Col>
						<SelectorUsuariosTanda referencia={refUsuarios} disabled={resultado.cargando} onUsuariosTandaCargados={setUsuariosTandaCargados} idTanda={datosTanda?.id} />
					</Col>
				</Form.Group>


			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaEditarTanda} disabled={resultado.cargando || !tiposTandaCargados || !estadosTandaCargados || !materialesTandaCargados || !usuariosTandaCargados} >Modificar</Button>
			<Button variant="outline-dark" onClick={cerrarModal} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={cerrarModal} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Editar datos de tanda
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEditarTanda;