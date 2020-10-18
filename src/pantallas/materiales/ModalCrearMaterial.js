import K from 'K';
import React, { useContext, useRef, useCallback, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorProveedor from './SelectorProveedor';
import { toast } from 'react-toastify';
import SwitchButton from 'componentes/SwitchButton';

const ModalCrearMaterial = ({ onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/material', jwt.token)

	const [proveedoresCargados, setProveedoresCargados] = useState(false);

	const refNombreOrigen = useRef();
	const refNombreEspana = useRef();
	const refCn = useRef();
	const refEan = useRef();
	const refProveedor = useRef();
	const refGTIN = useRef();
	const refActivo = useRef();

	const ejecutarLlamadaCrearMaterial = useCallback(() => {

		let peticionCrearMaterial = {
			name_origin: refNombreOrigen.current.value,
			name_spain: refNombreEspana.current.value,
			cn: refCn.current.value,
			ean: refEan.current.value,
			id_provider: refProveedor.current.value,
			active: refActivo.current?.checked ? 1 : 0,
			gtin: refGTIN.current?.checked ? 1 : 0
		}

		ejecutarConsulta({ method: 'POST', body: peticionCrearMaterial }, (error, res) => {
			if (error) {
				return;
			}

			toast.success(<>
				Se ha creado el material
				<h5 className="text-uppercase mt-3">
					{peticionCrearMaterial.name_spain}
				</h5>
				CN {peticionCrearMaterial.cn}
			</>);
			onRespuestaSi();
		})

	}, [ejecutarConsulta, onRespuestaSi]);


	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Creando material
		</Alert>

	} else if (resultado.error) {

		alertaSuperior = <Alert variant="danger">
			<h6>Error en la creación del material</h6>
			<code>{resultado.error.message}</code>
		</Alert>

	}

	contenidoModal = <>
		<Modal.Body>
			{alertaSuperior}
			<Form>
				<Form.Group as={Row}>
					<Form.Label column lg="3" >Nombre en Origen</Form.Label>
					<Col lg="9">
						<Form.Control type="text" placeholder="" ref={refNombreOrigen} disabled={resultado.cargando} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column lg="3">Nombre en España</Form.Label>
					<Col lg="9">
						<Form.Control type="text" placeholder="" ref={refNombreEspana} disabled={resultado.cargando} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="3">CN</Form.Label>
					<Col sm="4">
						<Form.Control type="text" placeholder="" ref={refCn} disabled={resultado.cargando} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="3">EAN</Form.Label>
					<Col sm="6">
						<Form.Control type="text" placeholder="" ref={refEan} disabled={resultado.cargando} />
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="3">Proveedor</Form.Label>
					<Col>
						<SelectorProveedor referencia={refProveedor} disabled={resultado.cargando} onProveedoresCargados={setProveedoresCargados} />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="3">GTIN</Form.Label>
					<Col sm="9">
						<SwitchButton
							innerRef={refGTIN}
							label="Indica si el material tiene código GTIN"
						/>
					</Col>
				</Form.Group>

				{ jwt.id_profile === K.ROLES.DIRECTOR &&
				<Form.Group as={Row}>
					<Form.Label column sm="3">Activo</Form.Label>
					<Col sm="6">
						<Form.Check
							className="mt-2"
							type="checkbox"
							label="Indica si el material podrá ser leído en tandas"
							ref={refActivo}
						/>
					</Col>
				</Form.Group>
				}

			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaCrearMaterial} disabled={resultado.cargando || !proveedoresCargados} >Crear</Button>
			<Button variant="outline-dark" onClick={onRespuestaNo} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Añadir nuevo material
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalCrearMaterial;