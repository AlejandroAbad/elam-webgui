import React, { useContext, useRef, useEffect, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorPais from './SelectorPais';

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

	if (resultado.cargando) {
		return <Alert variant="info"><Spinner /> Creando proveedor</Alert>
	} else if (resultado.error) {
		return <Alert variant="danger">Ha fallado la creación del proveedor</Alert>
	} else {
		return <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Añadir nuevo proveedor
        	</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group as={Row}>
						<Form.Label column sm="2">Nombre</Form.Label>
						<Col sm="10">
							<Form.Control type="text" placeholder="" ref={refNombre} />
						</Col>
					</Form.Group>
					<Form.Group as={Row}>
						<Form.Label column sm="2">CIF</Form.Label>
						<Col sm="6">
							<Form.Control type="text" placeholder="" ref={refCif} />
						</Col>
					</Form.Group>

					<Form.Group as={Row}>
						<Form.Label column sm="2">País</Form.Label>
						<Col>
							<SelectorPais referencia={refPais} />
						</Col>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="success" type="submit" onClick={ejecutarLlamadaCrearProveedor}>Crear</Button>
				<Button variant="outline-dark" onClick={props.onHide}>Cancelar</Button>
			</Modal.Footer>
		</Modal>
	}
}


export default ModalCreacionProveedor;