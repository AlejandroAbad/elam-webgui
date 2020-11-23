import React, { useContext, useCallback, useEffect } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import CardTanda from './CardTanda';

const ModalEliminarTanda = ({ onRespuestaSi, onRespuestaNo, datosTanda, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/series', jwt.token)

	const llamadaEliminarTanda = useCallback(() => {

		ejecutarConsulta({
			method: 'DELETE',
			url: '/series/' + datosTanda.id,
		}, (error, res) => {

			if (error) {
				toast.error(<>
					Ocurrió un error al eliminar la tanda<br/>
					<code>{error.message}</code>
				</>);
				onRespuestaNo();
				return;
			}

			toast.success(<>
				Se ha eliminado la tanda:
				<h5 className="text-uppercase mt-3">{datosTanda.name}</h5>
			</>);
				onRespuestaSi();

		})
	}, [datosTanda, ejecutarConsulta, onRespuestaNo, onRespuestaSi]);

	/** Este effect reinicia el estado de los selecctores de material y proveedor al abrir/cerrar el modal */
	useEffect(() => {
		resetearResultado();
	}, [props.show, resetearResultado])


	let contenidoModal = null;


	if (resultado.cargando) {
		contenidoModal = <Modal.Body>
			<Alert variant="info">
				<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
				Eliminando tanda
			</Alert>
		</Modal.Body >
	} else {

		contenidoModal = <>
			<Modal.Body>
				<h5 className="text-danger pb-3">Se dispone a eliminar la siguiente tanda:</h5>
				<CardTanda datosTanda={datosTanda} mostrarBotones={false} />
				
			</Modal.Body>
			<Modal.Footer>
				<span className="font-weight-bold mr-2">¿ Está usted seguro ?</span>
				<Button variant="danger" type="submit" onClick={llamadaEliminarTanda}>SI, eliminar</Button>
				<Button variant="outline-dark" onClick={onRespuestaNo}>Cancelar</Button>
			</Modal.Footer>
		</>
	}


	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Eliminar tanda
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEliminarTanda;