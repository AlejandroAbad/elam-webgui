import React, { useContext, useRef, useCallback, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import SelectorTipoTanda from './SelectorTipoTanda';
import SelectorEstadoTanda from './SelectorEstadoTanda';
import SelectorMaterialesTanda from './SelectorMaterialesTanda';
import SelectorUsuariosTanda from './SelectorUsuariosTanda';

const ModalCrearTanda = ({ onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/series', jwt.token)

	const [usuariosTandaCargados, setUsuariosTandaCargados] = useState(false);
	const [materialesTandaCargados, setMaterialesTandaCargados] = useState(false);
	const [tiposTandaCargados, setTiposTandaCargados] = useState(false);
	const [estadosTandaCargados, setEstadosTandaCargados] = useState(false);

	const refNombre = useRef();
	const refTipo = useRef();
	const refEstado = useRef();
	const refMateriales = useRef();
	const refUsuarios = useRef();

	const ejecutarLlamadaCrearTanda = useCallback(() => {

		let peticionCrearTanda = {
			name: refNombre.current.value,
			id_type: parseInt(refTipo.current.value),
			id_status: parseInt(refEstado.current.value),
			assig_materials: refMateriales.current?.value?.map( (val) => {return { id_mat: val }}),
			assig_users: refUsuarios.current?.value?.map((val) => { return { id_user: val } }),
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
			onRespuestaSi();
		})
		

	}, [ejecutarConsulta, onRespuestaSi]);


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
					<Form.Label column sm="2">Materiales</Form.Label>
					<Col>
						<SelectorMaterialesTanda referencia={refMateriales} disabled={resultado.cargando} onMaterialesTandaCargados={setMaterialesTandaCargados} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Usuarios</Form.Label>
					<Col>
						<SelectorUsuariosTanda referencia={refUsuarios} disabled={resultado.cargando} onUsuariosTandaCargados={setUsuariosTandaCargados} />
					</Col>
				</Form.Group>

				
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaCrearTanda} disabled={resultado.cargando || !tiposTandaCargados || !estadosTandaCargados || !materialesTandaCargados || !usuariosTandaCargados} >Crear</Button>
			<Button variant="outline-dark" onClick={onRespuestaNo} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Añadir nueva tanda
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalCrearTanda;