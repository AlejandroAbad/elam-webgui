import React, { useContext, useRef, useCallback, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorPerfil from './SelectorPerfil';
import { toast } from 'react-toastify';

const ModalEditarUsuario = ({ datosUsuario, onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/user', jwt.token)

	const [perfilesCargados, setPerfilesCargados] = useState(false);
	const [modificarPasswd, setModificarPasswd] = useState(false);

	const refUsuario = useRef();
	const refNombre = useRef();
	const refPerfil = useRef();
	const refPasswd = useRef();

	const cerrarModal = useCallback((respuesta) => {
		setModificarPasswd(false);
		resetearResultado();
		if (respuesta === true) onRespuestaSi()
		else onRespuestaNo();
	}, [onRespuestaNo, onRespuestaSi, resetearResultado]);

	const ejecutarLlamadaEditarUsuario = useCallback(() => {

		let peticionEditarUsuario = {
			user: refUsuario.current.value,
			name: refNombre.current.value,
			id_profile: refPerfil.current.value,
			pass: refPasswd.current.value
		}

		if (!modificarPasswd) delete peticionEditarUsuario.pass;

		ejecutarConsulta({ url: '/user/' + datosUsuario.id, method: 'PUT', body: peticionEditarUsuario }, (error, res) => {
			if (error) {
				return;
			}

			toast.success(<>
				Se ha modificado el usuario
				<h5 className="text-uppercase mt-3">
					{peticionEditarUsuario.name}
				</h5>

			</>);
			cerrarModal(true);
		})
		

	}, [ejecutarConsulta, cerrarModal, datosUsuario, modificarPasswd]);


	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Modificando usuario
		</Alert>

	} else if (resultado.error) {

		alertaSuperior = <Alert variant="danger">
			<h6>Error al modificar del usuario</h6>
			<code>{resultado.error.message}</code>
		</Alert>

	}

	contenidoModal = <>
		<Modal.Body>
			{alertaSuperior}
			<Form>
				<Form.Group as={Row}>
					<Form.Label column sm="2">Usuario</Form.Label>
					<Col sm="6">
						<Form.Control type="text" placeholder="" ref={refUsuario} disabled={resultado.cargando} defaultValue={datosUsuario?.user} />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">Nombre</Form.Label>
					<Col sm="10">
						<Form.Control type="text" placeholder="" ref={refNombre} disabled={resultado.cargando} defaultValue={datosUsuario?.name} />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">Contraseña</Form.Label>
					<Col sm="10">
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Checkbox value={modificarPasswd} onChange={(e) => { setModificarPasswd(e.target.checked) }} />
								<InputGroup.Text className="border-left-0">¿ Cambiar contraseña ?</InputGroup.Text>
							</InputGroup.Prepend>
							
							<Form.Control type="password" placeholder="" ref={refPasswd} disabled={resultado.cargando || !modificarPasswd} defaultValue="" />
							
						</InputGroup>
					
					</Col>
				</Form.Group>


				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">Perfil</Form.Label>
					<Col>
						<SelectorPerfil referencia={refPerfil} disabled={resultado.cargando} onPerfilesCargados={setPerfilesCargados} defaultValue={datosUsuario?.id_profile} />
					</Col>
				</Form.Group>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaEditarUsuario} disabled={resultado.cargando || !perfilesCargados} >Modificar</Button>
			<Button variant="outline-dark" onClick={cerrarModal} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={cerrarModal} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Editar usuario
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEditarUsuario;