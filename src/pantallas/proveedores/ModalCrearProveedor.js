import React, { useContext, useRef, useCallback, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorPais from './SelectorPais';
import { toast } from 'react-toastify';

const ModalCrearProveedor = ({ onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/provider', jwt.token)

	const [paisesCargados, setPaisesCargados] = useState(false);

	const refNombre = useRef();
	const refCif = useRef();
	const refPais = useRef();

	const ejecutarLlamadaCrearProveedor = useCallback(() => {

		let peticionCrearProveedor = {
			name: refNombre.current.value,
			id_country: refPais.current.value,
			cif: refCif.current.value
		}

		ejecutarConsulta({ method: 'POST', body: peticionCrearProveedor }, (error, res) => {
			if (error) {
				return;
			}

			toast.success(<>
				Se ha creado el proveedor
				<h5 className="text-uppercase mt-3">
					<img alt={peticionCrearProveedor.id_country} src={`https://www.countryflags.io/` + peticionCrearProveedor.id_country + `/flat/24.png`} className="pr-2" />
					{peticionCrearProveedor.name}
				</h5>
			</>);
			onRespuestaSi();
		})

	}, [ejecutarConsulta, onRespuestaSi]);


	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Creando proveedor
		</Alert>

	} else if (resultado.error) {

		alertaSuperior = <Alert variant="danger">
			<h6>Error en la creación del proveedor</h6>
			<code>{resultado.error.message}</code>
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
						<SelectorPais referencia={refPais} disabled={resultado.cargando} onPaisesCargados={setPaisesCargados}/>
					</Col>
				</Form.Group>
			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaCrearProveedor} disabled={resultado.cargando || !paisesCargados} >Crear</Button>
			<Button variant="outline-dark" onClick={onRespuestaNo} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Añadir nuevo proveedor
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalCrearProveedor;