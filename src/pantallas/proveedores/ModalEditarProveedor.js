import React, { useContext, useRef, useCallback, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorPais from './SelectorPais';
import { toast } from 'react-toastify';

const ModalEditarProveedor = ({ datosProveedor, onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/provider', jwt.token)

	const [paisesCargados, setPaisesCargados] = useState(false);

	const refNombre = useRef();
	const refCif = useRef();
	const refPais = useRef();

	const cerrarModal = useCallback((respuesta) => {
		resetearResultado();
		if (respuesta === true) onRespuestaSi()
		else onRespuestaNo();
	}, [onRespuestaNo, onRespuestaSi, resetearResultado]);

	const ejecutarLlamadaEditarProveedor = useCallback(() => {

		let peticionEditarProveedor = {
			name: refNombre.current.value,
			id_country: refPais.current.value,
			cif: refCif.current.value
		}

		ejecutarConsulta({ url: '/provider/' + datosProveedor.id, method: 'PUT', body: peticionEditarProveedor }, (error, res) => {
			if (error) {
				return;
			}

			toast.success(<>
				Se ha modificado el proveedor
				<h5 className="text-uppercase mt-3">
					<img alt={peticionEditarProveedor.id_country} src={`https://www.countryflags.io/` + peticionEditarProveedor.id_country + `/flat/24.png`} className="pr-2" />
					{peticionEditarProveedor.name}
				</h5>
			</>);
			cerrarModal(true);
		})

	}, [ejecutarConsulta, cerrarModal, datosProveedor]);


	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Modificando proveedor
		</Alert>

	} else if (resultado.error) {

		alertaSuperior = <Alert variant="danger">
			<h6>Error al modificar del proveedor</h6>
			<code>{resultado.error.message}</code>
		</Alert>

	}

	contenidoModal = <>
		<Modal.Body>
			{alertaSuperior}
			<Form>
				<Form.Group as={Row}>
					<Form.Label column sm="2">Nombre</Form.Label>
					<Col sm="10">
						<Form.Control type="text" placeholder="" ref={refNombre} disabled={resultado.cargando} defaultValue={datosProveedor?.name} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">CIF</Form.Label>
					<Col sm="6">
						<Form.Control type="text" placeholder="" ref={refCif} disabled={resultado.cargando} defaultValue={datosProveedor?.cif} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="2">País</Form.Label>
					<Col>
						<SelectorPais referencia={refPais} disabled={resultado.cargando} onPaisesCargados={setPaisesCargados} defaultValue={datosProveedor?.id_country} />
					</Col>
				</Form.Group>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaEditarProveedor} disabled={resultado.cargando || !paisesCargados} >Modificar</Button>
			<Button variant="outline-dark" onClick={cerrarModal} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={cerrarModal} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Editar proveedor
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEditarProveedor;