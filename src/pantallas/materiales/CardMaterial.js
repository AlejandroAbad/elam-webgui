import Icono from 'componentes/icono/Icono';
import React from 'react';
import { Col, Card, Button, Row, Badge } from 'react-bootstrap';
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
					<Col md={2}>
						<h6><span className="text-muted">CN</span> {datosMaterial.cn}</h6>
					</Col >
					{datosMaterial.ean && <Col md="auto" className="ml-md-3">
						<h6>
							<span className="text-muted"><Icono icono={FaBarcode} posicion={[20, 3]} /></span> {datosMaterial.ean}
							{datosMaterial.gtin ? 
								<Badge variant="primary" className="ml-2 py-1 font-weight-normal">GTIN activo</Badge> : 
								<Badge variant="secondary" className="ml-2 py-1 font-weight-normal">GTIN inactivo</Badge>
							}	
						</h6>
						
					</Col>}
				</Row>

				<Row className="no-gutters">
					<Col md="auto">
						<img alt={datosMaterial.country_name} src={`https://www.countryflags.io/` + datosMaterial.country + `/flat/24.png`} className="pr-2" />
						{datosMaterial.prov_name}
						<small className="pl-1 text-capitalize">({datosMaterial.country_name?.toLowerCase()})</small>
					</Col>
				</Row>

				
				{mostrarBotones && <>
					<Button size="sm" className="float-right ml-3" variant="outline-danger" onClick={onBorrarPulsado}>Eliminar</Button>
					<Button size="sm" className="float-right" variant="primary" onClick={onEditarPulsado}>Editar</Button>
				</>}

			</Card.Body>
		</Card>
	</Col>
}

export default CardMaterial;