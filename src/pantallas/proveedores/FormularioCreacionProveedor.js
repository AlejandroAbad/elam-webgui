import React, { useContext, useRef, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorPais from './SelectorPais';
import { toast } from 'react-toastify';

const ModalCreacionProveedor = (props) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/provider', jwt.token)

	const refNombre = useRef();
	const refCif = useRef();
	const refPais = useRef();

	const ejecutarLlamadaCrearProveedor = useCallback(() => {

		let peticionCrearProveedor = {
			name: refNombre.current.value,
			id_country: refPais.current.value,
			cif: refCif.current.value
		}

		ejecutarConsulta({ method: 'POST', body: peticionCrearProveedor })

	}, [ejecutarConsulta]);


	let contenidoModal = null;

	if (resultado.ok) {
		toast.success(<>
			Se ha creado el proveedor: 
			<h5>
				<img alt={resultado.query.id_country} src={`https://www.countryflags.io/` + resultado.query.id_country + `/flat/24.png`} className="pr-2" />
				{resultado.query.name}
			</h5>
		</>);
		props.onUpdate();
		return null;
	} else {
		let alertaSuperior = null;
		
		if (resultado.cargando) {
			alertaSuperior = <Alert variant="info">
				<Spinner animation="grow" size="sm" variant="info" className="mr-2"/> 
				Creando proveedor
			</Alert>
		} else if (resultado.error) {
			alertaSuperior = <Alert variant="danger">
				<h6>Error en la creación del proveedor</h6>
				{resultado.error.message}
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
						<Form.Label column sm="2">CIF</Form.Label>
						<Col sm="6">
							<Form.Control type="text" placeholder="" ref={refCif} disabled={resultado.cargando} />
						</Col>
					</Form.Group>

					<Form.Group as={Row} className="align-items-center">
						<Form.Label column sm="2">País</Form.Label>
						<Col>
							<SelectorPais referencia={refPais} disabled={resultado.cargando} />
						</Col>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="success" type="submit" onClick={ejecutarLlamadaCrearProveedor}>Crear</Button>
				<Button variant="outline-dark" onClick={props.onHide}>Cancelar</Button>
			</Modal.Footer>
		</>
	}


	return <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Añadir nuevo proveedor
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalCreacionProveedor;