import React, { useContext, useEffect, useState } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Col, Card, Button, Collapse, Spinner, Alert, Row, Popover, OverlayTrigger, ListGroup, Badge } from 'react-bootstrap';
import BadgeInfoTanda from './BadgeInfoTanda';
import { useApiCall } from 'hooks/useApiCall';
import { FaRegEye } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';
import { MdHighlightOff, MdOpenInNew } from 'react-icons/md';


const CardTanda = ({ datosTanda, mostrarBotones, onEditarPulsado, onBorrarPulsado }) => {



	const [mostrarDatosAvanzados, setMostrarDatosAvanzados] = useState(false);


	if (!datosTanda) return null;

	return <Col>

		<Card xs={12} className="mt-2">
			<Card.Body>

				<Card.Title >
					{!mostrarDatosAvanzados &&
						<div className="float-right" >
							<BadgeInfoTanda texto={datosTanda.status} className="mr-2" />
							<BadgeInfoTanda texto={datosTanda.type} />
						</div>
					}

					<h4 className="mb-0 pb-0">
						<span className="text-uppercase">{datosTanda.name}</span>
					</h4>

				</Card.Title>

				<Collapse in={mostrarDatosAvanzados}>
					<div className="mx-0 pb-2">
						<DatosAvanzados idTanda={datosTanda.id} mostrando={mostrarDatosAvanzados} />
					</div>
				</Collapse>

				<div className="mt-2"></div>

				<div className="float-left mt-2">
					<BotonDetalles mostrandoDetalles={mostrarDatosAvanzados} onPulsado={setMostrarDatosAvanzados} />
				</div>
				<div className="float-right">
					<Button size="sm" className="mx-1" variant="success">Liberar</Button>
					<Button size="sm" className="mx-1" variant="primary">Editar</Button>
					<Button size="sm" className="mx-1" variant="outline-danger">Borrar</Button>
				</div>
			</Card.Body>
		</Card>
	</Col>
}



const BotonDetalles = ({ mostrandoDetalles, onPulsado, ...props }) => {

	if (mostrandoDetalles)
		return <Button {...props} size="sm" className="mx-1" variant="outline-dark" onClick={() => onPulsado(false)}>
			Ocultar detalles
		</Button>
	else
		return <Button {...props} size="sm" className="mx-1" variant="outline-dark" onClick={() => onPulsado(true)}>
			Mostar detalles
		</Button>

}


const DatosAvanzados = ({ mostrando, idTanda, ...props }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/', jwt.token);




	useEffect(() => {
		if (!resultado.cargando && mostrando && !resultado.datos) {
			ejecutarConsulta({
				method: 'GET',
				url: '/series/' + idTanda
			})
		}
	}, [mostrando, idTanda, resultado, ejecutarConsulta]);


	if (resultado.cargando) {
		return <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
				Cargando datos de la tanda
			</Alert>
	} else if (resultado.error) {
		return <Alert variant="danger">
			<h5>Error al obtener los datos de la tanda</h5>
			<code>{resultado.error.message}</code>
		</Alert>
	} else {
		let datos = resultado.datos;
		if (!datos) return null;
		return <>
			<Row>
				<Col sm={12} md={4}>
					<Etiqueta texto="Id:" />
					<code className="ml-2 mr-1 text-dark">{datos.id}</code>
				</Col>
				<Col sm={12} md={4}>
					<Etiqueta texto="Estado:" />
					<BadgeInfoTanda texto={datos.status} className="ml-2 mr-1" extendido />
				</Col>
				<Col sm={12} md={4}>
					<Etiqueta texto="Tipo:" />
					<BadgeInfoTanda texto={datos.type} className="ml-2 mr-1" extendido />
				</Col>
			</Row>
			<Row className="mt-3">
				<Col>
					{datos.reads.length ?
						<Button size="sm" variant="info" className="px-2">
							<Icono icono={MdOpenInNew} posicion={[18, 4]} className="mr-1" />
							Mostrar detalle de lecturas: <Badge variant="light" className="ml-1">{datos.reads.length}</Badge>
						</Button>
						:
						<Button size="sm" variant="outline-secondary" className="px-2" disabled>
							<Icono icono={MdHighlightOff} posicion={[18, 4]} className="mr-1" />
							Tanda sin lecturas
						</Button>
					}
				</Col>
			</Row>
			<Row className="mt-3">
				<Col sm={12} lg={4}>
					<Card>
						<Card.Header className="m-0 p-2 pl-3 font-weight-bold">Usuarios</Card.Header>
						<ListaUsuariosTanda usuarios={datos.assig_users} />
					</Card>
				</Col>

				<Col sm={12} lg={8} className="mt-2 mt-lg-0">
					<Card>
						<Card.Header className="m-0 p-2 pl-3 font-weight-bold">Materiales</Card.Header>
						<ListaMaterialesTanda materiales={datos.assig_materials} />
					</Card>
				</Col>

			</Row>

		</>
	}

}

const ListaMaterialesTanda = ({ materiales }) => {
	let componentes = materiales.map((material, i) => {
		const popover = (
			<Popover id="popover-basic">

				<Popover.Content>
					<Etiqueta texto="CN:" /> {material.cn}<br />
					<Etiqueta texto="Origen:" /> {material.name_origin}<br />
					<Etiqueta texto="España:" /> {material.name_spain}<br />
					{material.ean && <><Etiqueta texto="EAN:" /> {material.ean}<br /></>}
					<Etiqueta texto="Proveedor:" /> {material.id_provider} <span className="text-danger">*Mandar datos proveedor*</span><br />
				</Popover.Content>
			</Popover>
		);

		return <ListGroup.Item className="m-0 p-1 pt-2">

			<OverlayTrigger key={i} trigger="hover" overlay={popover} placement="bottom-start">
				<Button size="sm" variant="link"><Icono icono={FaRegEye} posicion={[20, 6]} /></Button>
			</OverlayTrigger>
			<b>{material.cn}</b> {material.name_spain}
		</ListGroup.Item>
	})

	return <ListGroup variant="flush" >
		{componentes}
	</ListGroup>

}

const ListaUsuariosTanda = ({ usuarios }) => {
	let componentes = usuarios.map((usuario, i) => {
		return <ListGroup.Item className="m-0 p-1 pl-3" key={i}>
			{usuario.name}
		</ListGroup.Item>
	})

	return <ListGroup variant="flush" >
		{componentes}
	</ListGroup>
}

const Etiqueta = ({ texto }) => {
	return <span className="ml-1 font-weight-bold">
		{texto}
	</span>
}

export default CardTanda;