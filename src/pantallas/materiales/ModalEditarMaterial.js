import K from 'K';
import React, { useContext, useRef, useCallback, useState, useEffect } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Modal, Button, Form, Col, Row, Alert, Spinner } from 'react-bootstrap';
import { useApiCall } from 'hooks/useApiCall';
import SelectorProveedores from './SelectorProveedores';
import { toast } from 'react-toastify';
import SwitchButton from 'componentes/SwitchButton';
import SelectorPais from '../proveedores/SelectorPais';
import { FaInfoCircle } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';

const ModalEditarMaterial = ({ datosMaterial, onRespuestaSi, onRespuestaNo, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, resetearResultado } = useApiCall('/', jwt.token)

	const [proveedoresCargados, setProveedoresCargados] = useState(false);
	const [todosProveedores, setTodosProveedores] = useState(true);
	const [paisesCargados, setPaisesCargados] = useState(false);

	const refNombreOrigen = useRef();
	const refNombreEspana = useRef();
	const refEan = useRef();
	const refPais = useRef();
	const refTodosProveedores = useRef();
	const refProveedor = useRef();
	const refGTIN = useRef();
	const refActivo = useRef();


	const ejecutarLlamadaEditarMaterial = useCallback(() => {

		let peticionEditarMaterial = {
			name_origin: refNombreOrigen.current.value,
			name_spain: refNombreEspana.current.value,
			ean: refEan.current.value,
			id_country: refPais.current.value,
			providers: refProveedor.current?.value,
			active: refActivo.current?.checked ? 1 : 0,
			gtin: refGTIN.current?.checked ? 1 : 0
		}

		if (refTodosProveedores.current.checked || !refProveedor.current?.value?.length) {
			peticionEditarMaterial.providers = [{ id: 0 }];
		}

		ejecutarConsulta({ url: '/material/' + datosMaterial.id, method: 'PUT', body: peticionEditarMaterial }, (error, res) => {
			if (error) {
				return;
			}

			toast.success(<>
				Se ha modificado el material
				<h5 className="text-uppercase mt-3">
					{peticionEditarMaterial.name_spain}
				</h5>
			</>);
			onRespuestaSi();
		})

	}, [ejecutarConsulta, onRespuestaSi, datosMaterial]);

	// Al cambiar el estado visible/invisible se reinicia el estado del modal completo
	useEffect(() => {
		resetearResultado();
		if (datosMaterial?.providers?.length) {
			let proveedores = datosMaterial.providers.filter(proveedor => proveedor.id !== 0);
			setTodosProveedores(proveedores.length === 0);
		} else {
			setTodosProveedores(true);
		}
	}, [props.show, resetearResultado, datosMaterial])


	let contenidoModal = null;
	let alertaSuperior = null;


	if (resultado.cargando) {

		alertaSuperior = <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Modificando material
		</Alert>

	} else if (resultado.error) {

		alertaSuperior = <Alert variant="danger">
			<h6>Error al modificar del material</h6>
			<code>{resultado.error.message}</code>
		</Alert>

	} else if (!datosMaterial?.editable ) {

		alertaSuperior = <Alert variant="info">
			<h6 className="mt-2">
				<Icono icono={FaInfoCircle} posicion={[16,2]} className="mr-2"/> {datosMaterial?.editable_msg ? datosMaterial.editable_msg : 'Material no editable'}
			</h6>
		</Alert>

	}

	contenidoModal = <>
		<Modal.Body>
			{alertaSuperior}
			<Form>
				<Form.Group as={Row}>
					<Form.Label column lg="3" >Nombre en Origen</Form.Label>
					<Col lg="9">
						<Form.Control type="text" placeholder="" ref={refNombreOrigen} disabled={resultado.cargando || !datosMaterial?.editable} defaultValue={datosMaterial?.name_origin} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column lg="3">Nombre en España</Form.Label>
					<Col lg="9">
						<Form.Control type="text" placeholder="" ref={refNombreEspana} disabled={resultado.cargando || !datosMaterial?.editable} defaultValue={datosMaterial?.name_spain} />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="3">EAN</Form.Label>
					<Col sm="6">
						<Form.Control type="text" placeholder="" ref={refEan} disabled={resultado.cargando || !datosMaterial?.editable} defaultValue={datosMaterial?.ean} />
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="3">País</Form.Label>
					<Col>
						<SelectorPais 
							referencia={refPais} 
							disabled={resultado.cargando || !datosMaterial?.editable} 
							onPaisesCargados={setPaisesCargados} 
							defaultValue={datosMaterial?.id_country}
							incluirEMA={true} />
					</Col>
				</Form.Group>
				<Form.Group as={Row} className="align-items-center">
					<Form.Label column sm="3">Proveedores permitidos</Form.Label>
					<Col>
						<SwitchButton
							onChange={setTodosProveedores}
							innerRef={refTodosProveedores}
							label="Permitir todos los proveedores"
							value={todosProveedores}
							disabled={!datosMaterial?.editable}
						/>
						{todosProveedores ||
							<SelectorProveedores
								referencia={refProveedor}
								disabled={resultado.cargando || !datosMaterial?.editable}
								onProveedoresCargados={setProveedoresCargados}
								idProveedorSeleccionado={datosMaterial?.id_provider}
								datosProveedores={datosMaterial?.providers}
								modoEdicion={true}
							/>
						}
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="3">GTIN</Form.Label>
					<Col sm="9">
						<SwitchButton
							innerRef={refGTIN}
							label="Indica si el material porta códigos GTIN"
							defaultChecked={datosMaterial?.gtin ? true : false}
							disabled={!datosMaterial?.editable}
						/>
					</Col>
				</Form.Group>


				<Form.Group as={Row}>
					<Form.Label column sm="3">Activo</Form.Label>
					<Col sm="9">
						<SwitchButton
							innerRef={refActivo}
							label="Indica si el material podrá ser usado en tandas"
							defaultChecked={datosMaterial?.active ? true : false}
							disabled={jwt.id_profile === K.ROLES.CALIDAD || !datosMaterial?.editable}
						/>
					</Col>
				</Form.Group>


			</Form>
		</Modal.Body>
		<Modal.Footer>
			<Button variant="success" type="submit" onClick={ejecutarLlamadaEditarMaterial} disabled={resultado.cargando || !datosMaterial?.editable || (!proveedoresCargados && !todosProveedores) || !paisesCargados} >Modificar</Button>
			<Button variant="outline-dark" onClick={onRespuestaNo} disabled={resultado.cargando} >Cancelar</Button>
		</Modal.Footer>
	</>



	return <Modal {...props} onHide={onRespuestaNo} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Modificar material
        		</Modal.Title>
		</Modal.Header>
		{contenidoModal}
	</Modal>


}


export default ModalEditarMaterial;