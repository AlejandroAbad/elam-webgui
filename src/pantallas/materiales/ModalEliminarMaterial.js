import React, { useContext, useCallback, useEffect } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import CardMaterial from './CardMaterial';

const ModalEliminarMaterial = ({ onRespuestaSi, onRespuestaNo, datosMaterial, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/material', jwt.token)



	const llamadaEliminarMaterial = useCallback(() => {

		ejecutarConsulta({
			method: 'DELETE',
			url: '/material/' + datosMaterial.id,
		}, (error, res) => {

			if (error) {
				toast.error(<>
					Ocurrió un error al eliminar el material<br/>
					<code>{error.message}</code>
				</>);
				onRespuestaNo();
				return;
			}

			toast.success(<>
				Se ha eliminado el material:
				<h5 className="text-uppercase mt-3">{datosMaterial.name_spain}</h5>
			</>);
			onRespuestaSi();

		})
	}, [datosMaterial, ejecutarConsulta, onRespuestaSi, onRespuestaNo]);


	// Al cambiar el estado visible/invisible se reinicia el estado del modal completo
	useEffect(() => {
		resetearResultado();
	}, [props.show, resetearResultado])

	let contenidoModal = null;


	if (resultado.cargando) {
		contenidoModal = <Modal.Body>
			<Alert variant="info">
				<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
				Eliminando material
			</Alert>
		</Modal.Body >
	} else {

		contenidoModal = <>
			<Modal.Body>
				<h5 className="text-danger pb-3">Se dispone a eliminar el siguiente material:</h5>
				<CardMaterial datosMaterial={datosMaterial} mostrarBotones={false} />
				
			</Modal.Body>
			<Modal.Footer>
				<span className="font-weight-bold mr-2">¿ Está usted seguro ?</span>
				<Button variant="danger" type="submit" onClick={llamadaEliminarMaterial}>SI, eliminar</Button>
				<Button variant="outline-dark" onClick={onRespuestaNo}>Cancelar</Button>
			</Modal.Footer>
		</>
	}


	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Eliminar material
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEliminarMaterial;