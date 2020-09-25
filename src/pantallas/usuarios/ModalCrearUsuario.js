import React, { useContext, useRef, useCallback, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorPerfil from './SelectorPerfil';
import { toast } from 'react-toastify';

const ModalCrearUsuario = ({ onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/user', jwt.token)

	const [perfilesCargados, setPerfilesCargados] = useState(false);

	const refUsuario = useRef();
	const refNombre = useRef();
	const refPerfil = useRef();
	const refPasswd = useRef();

	const cerrarModal = useCallback((respuesta) => {
		resetearResultado();
		if (respuesta === true) onRespuestaSi()
		else onRespuestaNo();
	}, [onRespuestaNo, onRespuestaSi, resetearResultado]);

	const ejecutarLlamadaCrearUsuario = useCallback(() => {

		let peticionCrearUsuario = {
			user: refUsuario.current.value,
			name: refNombre.current.value,
			id_profile: refPerfil.current.value,
			pass: refPasswd.current.value
		}

		ejecutarConsulta({ method: 'POST', body: peticionCrearUsuario }, (error, res) => {
			if (error) {
				return;
			}

			toast.success(<>
				Se ha creado el usuario
				<h5 className="text-uppercase mt-3">
					{peticionCrearUsuario.name}
				</h5>
				({peticionCrearUsuario.user})
			</>);
			cerrarModal(true);
		})

	}, [ejecutarConsulta, cerrarModal]);


	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Creando usuario
		</Alert>

	} else if (resultado.error) {

		alertaSuperior = <Alert variant="danger">
			<h6>Error en la creación del usuario</h6>
			<code>{resultado.error.message}</code>
		</Alert>

	}

	contenidoModal = <>
		<Modal.Body>
			{alertaSuperior}
			<Form >
				<Form.Group as={Row}>
					<Form.Label column sm="2">Usuario</Form.Label>
					<Col sm="6">
						<Form.Control type="text" placeholder="" ref={refUsuario} disabled={resultado.cargando} autocomplete="off" />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">Nombre</Form.Label>
					<Col sm="10">
						<Form.Control type="text" placeholder="" ref={refNombre} disabled={resultado.cargando} name="random" autocomplete="off" />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">Contraseña</Form.Label>
					<Col sm="10">							
						<Form.Control type="password" placeholder="" ref={refPasswd} disabled={resultado.cargando} name="random2" autocomplete="off" />
					</Col>
				</Form.Group>


				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Perfil</Form.Label>
					<Col>
						<SelectorPerfil referencia={refPerfil} disabled={resultado.cargando} onPerfilesCargados={setPerfilesCargados}  />
					</Col>
				</Form.Group>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaCrearUsuario} disabled={resultado.cargando || !perfilesCargados} >Crear</Button>
			<Button variant="outline-dark" onClick={onRespuestaNo} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Añadir nuevo usuario
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalCrearUsuario;