import React from 'react';
import { Col, Card, Button, Badge } from 'react-bootstrap';


const CardProveedor = ({ datosProveedor, mostrarBotones, onEditarPulsado, onBorrarPulsado }) => {

	if (!datosProveedor) return null;


	let style = {};
	if (!datosProveedor.active) {
		style = {
			backgroundColor: '#e9e9e9'
		}
	}

	return <Col>

		<Card xs={12} className="mt-2" style={style}>
			<Card.Body>
				<Card.Title className="float-right"><small className="text-mutted"># <strong>{datosProveedor.id}</strong></small></Card.Title>
				<Card.Title className="mb-0" >
					<h4  >
						<span className="text-uppercase">{datosProveedor.name}</span>
						<small className="ml-4 text-muted">{datosProveedor.cif}</small>
					</h4>
				</Card.Title>

				<Card.Text>
					{!datosProveedor.active && <Badge variant="warning" className="mt-lg-n2">PROVEEDOR INACTIVO</Badge>}
				</Card.Text>

				

				<Card.Subtitle className="mb-2">
					
					<img alt={datosProveedor.country_name} src={`https://www.countryflags.io/` + datosProveedor.id_country + `/flat/24.png`} className="pr-2" />
					{datosProveedor.country_name}
					<small className="pl-1">({datosProveedor.id_country})</small>
				</Card.Subtitle>


				{mostrarBotones && <>
					<Button size="sm" className="float-right ml-3" variant="outline-danger" onClick={onBorrarPulsado}>Eliminar</Button>
					<Button size="sm" className="float-right" variant="primary" onClick={onEditarPulsado}>Editar</Button>
				</>}

			</Card.Body>
		</Card>
	</Col>
}

export default CardProveedor;