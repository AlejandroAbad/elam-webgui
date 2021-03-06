import K from 'K';
import React, { useContext, useRef, useCallback, useState, useEffect } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorPais from './SelectorPais';
import { toast } from 'react-toastify';
import SwitchButton from 'componentes/SwitchButton';
import BanderaPais from 'componentes/BanderaPais';

const ModalEditarProveedor = ({ datosProveedor, onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/provider', jwt.token)

	const [paisesCargados, setPaisesCargados] = useState(false);

	const refNombre = useRef();
	const refCif = useRef();
	const refPais = useRef();
	const refActivo = useRef();


	const ejecutarLlamadaEditarProveedor = useCallback(() => {

		let peticionEditarProveedor = {
			name: refNombre.current.value,
			id_country: refPais.current.value,
			cif: refCif.current.value,
			active: refActivo.current?.checked ? 1 : 0
		}

		ejecutarConsulta({ url: '/provider/' + datosProveedor.id, method: 'PUT', body: peticionEditarProveedor }, (error, res) => {
			if (error) {
				return;
			}

			toast.success(<>
				Se ha modificado el proveedor
				<h5 className="text-uppercase mt-3">
					<BanderaPais codigoPais={peticionEditarProveedor.id_country} className="pr-2" />
					{peticionEditarProveedor.name}
				</h5>
			</>);
			onRespuestaSi();
		})

	}, [ejecutarConsulta, onRespuestaSi, datosProveedor]);

	// Al cambiar el estado visible/invisible se reinicia el estado del modal completo
	useEffect(() => {
		resetearResultado();
	}, [props.show, resetearResultado])

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
				

					<Form.Group as={Row}>
						<Form.Label column sm="2">Activo</Form.Label>
						<Col sm="6">
						<SwitchButton
							innerRef={refActivo}
							label="Indica si el proveedor podrá ser asignado a materiales"
							defaultChecked={datosProveedor?.active ? true : false}
							disabled={jwt.id_profile === K.ROLES.CALIDAD}
						/>
						</Col>
					</Form.Group>
				

					</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaEditarProveedor} disabled={resultado.cargando || !paisesCargados} >Modificar</Button>
			<Button variant="outline-dark" onClick={onRespuestaNo} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Editar proveedor
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEditarProveedor;