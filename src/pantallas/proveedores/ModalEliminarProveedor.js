import React, { useContext, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import { toast } from 'react-toastify';
import CardProveedor from './CardProveedor';

const ModalEliminarProveedor = ({ onRespuestaSi, onRespuestaNo, datosProveedor, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/provider', jwt.token)



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
				onRespuestaNo();
				return;
			}

			toast.success(<>
				Se ha eliminado el proveedor:
				<h5 className="text-uppercase mt-3">{datosProveedor.name}</h5>
				<small><img alt={datosProveedor.id_country} src={`https://www.countryflags.io/` + datosProveedor.id_country + `/flat/24.png`} className="pr-2" /> {datosProveedor.country_name}</small>
			</>);
			onRespuestaSi();

		})
	}, [datosProveedor, ejecutarConsulta, onRespuestaSi, onRespuestaNo]);


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
				<Button variant="outline-dark" onClick={onRespuestaNo}>Cancelar</Button>
			</Modal.Footer>
		</>
	}


	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Eliminar de proveedor
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEliminarProveedor;