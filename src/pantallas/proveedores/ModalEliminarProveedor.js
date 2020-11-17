import React, { useContext, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import CardProveedor from './CardProveedor';
import BanderaPais from 'componentes/BanderaPais';

const ModalEliminarProveedor = ({ onRespuestaSi, onRespuestaNo, datosProveedor, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/provider', jwt.token)

	const cerrarModal = useCallback((respuesta) => {
		resetearResultado();
		if (respuesta === true) onRespuestaSi()
		else onRespuestaNo();
	}, [onRespuestaNo, onRespuestaSi, resetearResultado]);

	const llamadaEliminarProveedor = useCallback(() => {

		ejecutarConsulta({
			method: 'DELETE',
			url: '/provider/' + datosProveedor.id,
		}, (error, res) => {

			if (error) {
				toast.error(<>
					Ocurrió un error al eliminar el proveedor<br/>
					<code>{error.message}</code>
				</>);
				cerrarModal();
				return;
			}

			toast.success(<>
				Se ha eliminado el proveedor:
				<h5 className="text-uppercase mt-3">{datosProveedor.name}</h5>
				<small><BanderaPais codigoPais={datosProveedor.id_country} className="pr-2" /> {datosProveedor.country_name}</small>
			</>);
				cerrarModal(true);

		})
	}, [datosProveedor, ejecutarConsulta, cerrarModal]);


	let contenidoModal = null;


	if (resultado.cargando) {
		contenidoModal = <Modal.Body>
			<Alert variant="info">
				<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
				Eliminando proveedor
			</Alert>
		</Modal.Body >
	} else {

		contenidoModal = <>
			<Modal.Body>
				<h5 className="text-danger pb-3">Se dispone a eliminar el siguiente proveedor:</h5>
				<CardProveedor datosProveedor={datosProveedor} mostrarBotones={false} />
				
			</Modal.Body>
			<Modal.Footer>
				<span className="font-weight-bold mr-2">¿ Está usted seguro ?</span>
				<Button variant="danger" type="submit" onClick={llamadaEliminarProveedor}>SI, eliminar</Button>
				<Button variant="outline-dark" onClick={cerrarModal}>Cancelar</Button>
			</Modal.Footer>
		</>
	}


	return <Modal {...props} onHide={cerrarModal} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Eliminar proveedor
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEliminarProveedor;