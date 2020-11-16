import BanderaPais from 'componentes/BanderaPais';
import Icono from 'componentes/icono/Icono';
import React from 'react';
import { Col, Card, Button, Row, Badge, ListGroup } from 'react-bootstrap';
import { FaBarcode } from 'react-icons/fa';


const CardMaterial = ({ datosMaterial, mostrarBotones, onEditarPulsado, onBorrarPulsado }) => {

	if (!datosMaterial) return null;

	let style = {};
	if (!datosMaterial.active) {
		style = {
			backgroundColor: '#e9e9e9'
		}
	}

	return <Col>

		<Card xs={12} className="mt-2" style={style}>
			<Card.Body>
				<Card.Title className="float-right">
					<small className="text-mutted">
						# <strong>{datosMaterial.id}</strong>
					</small>
				</Card.Title>

				<Row className="no-gutters mb-1">
					<Col md="auto">
						<h4>{datosMaterial.name_spain}</h4>
					</Col>
					<Col md="auto d-none d-md-block mx-3">
						<h4>/</h4>
					</Col>
					<Col md="auto">
						<h4>{datosMaterial.name_origin}</h4>
					</Col>
					<Col className="ml-lg-2 mt-0 mb-1" sm="12" lg="auto">
						{!datosMaterial.active && <Badge variant="warning" className="float-left mt-lg-2">MATERIAL INACTIVO</Badge>}
					</Col>
				</Row>

				<Row className="no-gutters mb-1">

					

					<Col md="auto" className="ml-md-4">
						<h6>
							<span className="text-muted"><Icono icono={FaBarcode} posicion={[20, 3]} /></span> {datosMaterial.ean}
							{datosMaterial.gtin ?
								<Badge variant="primary" className="ml-2 py-1 font-weight-normal">GTIN activo</Badge> :
								<Badge variant="secondary" className="ml-2 py-1 font-weight-normal">GTIN inactivo</Badge>
							}
						</h6>
					</Col>
					<Col md="auto" className="ml-md-4">
						<h6><BanderaPais codigoPais={datosMaterial.id_country} nombrePais={datosMaterial.country_name} className="mb-1" /> {datosMaterial.country_name}</h6>
					</Col >

				</Row>


				<VisorProveedores proveedores={datosMaterial.providers} activo={datosMaterial.active} />




				{mostrarBotones && <>
					<Button size="sm" className="float-right ml-3" variant="outline-danger" onClick={onBorrarPulsado}>Eliminar</Button>
					<Button size="sm" className="float-right" variant="primary" onClick={onEditarPulsado}>Editar</Button>
				</>}

			</Card.Body>
		</Card>
	</Col>
}


const VisorProveedores = ({ proveedores, activo }) => {

	if (!proveedores || !proveedores.length) return null;


	let componentes = proveedores.map((proveedor, i) => {
		return <ListGroup.Item style={activo ? {} : { backgroundColor: '#e9e9e9' }} className="py-1" key={i}>
			<BanderaPais codigoPais={proveedor.id_country} nombrePais={proveedor.name_country} className="mb-1 pr-1" />
			{proveedor.name}
			<small className="pl-1 text-capitalize">({proveedor.name_country?.toLowerCase()})</small>
			{proveedor.active === 0 && <Badge variant="warning" size="sm" className="ml-1">INACTIVO</Badge>}
		</ListGroup.Item>
	});

	return <ListGroup className="mx-md-4 py-2 mb-3">
		<ListGroup.Item style={activo ? {} : { backgroundColor: '#e9e9e9' }} variant='light' className="py-1">
			<b>Proveedores</b>
		</ListGroup.Item>
		{componentes}
	</ListGroup>;




}

export default CardMaterial;