import React, { useContext, useCallback, useEffect } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import CardUsuario from './CardUsuario';

const ModalEliminarUsuario = ({ onRespuestaSi, onRespuestaNo, datosUsuario, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/user', jwt.token)

	const llamadaEliminarUsuario = useCallback(() => {

		ejecutarConsulta({
			method: 'DELETE',
			url: '/user/' + datosUsuario.id,
		}, (error, res) => {

			if (error) {
				toast.error(<>
					Ocurrió un error al eliminar el usuario<br/>
					<code>{error.message}</code>
				</>);
				onRespuestaNo();
				return;
			}

			toast.success(<>
				Se ha eliminado el usuario:
				<h5 className="text-uppercase mt-3">{datosUsuario.name}</h5>
				({datosUsuario.user})
			</>);
				onRespuestaSi();

		})
	}, [datosUsuario, ejecutarConsulta, onRespuestaSi, onRespuestaNo]);

	// Al cambiar el estado visible/invisible se reinicia el estado del modal completo
	useEffect(() => {
		resetearResultado();
	}, [props.show, resetearResultado])

	let contenidoModal = null;


	if (resultado.cargando) {
		contenidoModal = <Modal.Body>
			<Alert variant="info">
				<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
				Eliminando usuario
			</Alert>
		</Modal.Body >
	} else {

		contenidoModal = <>
			<Modal.Body>
				<h5 className="text-danger pb-3">Se dispone a eliminar el siguiente usuario:</h5>
				<CardUsuario datosUsuario={datosUsuario} mostrarBotones={false} />
				
			</Modal.Body>
			<Modal.Footer>
				<span className="font-weight-bold mr-2">¿ Está usted seguro ?</span>
				<Button variant="danger" type="submit" onClick={llamadaEliminarUsuario}>SI, eliminar</Button>
				<Button variant="outline-dark" onClick={onRespuestaNo}>Cancelar</Button>
			</Modal.Footer>
		</>
	}


	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Eliminar usuario
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEliminarUsuario;