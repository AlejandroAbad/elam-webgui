import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';


const RegistroProveedor = ({ datosProveedor }) => {

	if (!datosProveedor) return null;

	return <Col>

		<Card xs={12} className="mt-2">
			<Card.Body>
				<Card.Title className="float-right"><small className="text-mutted"># <strong>{datosProveedor.id}</strong></small></Card.Title>
				<Card.Title >
					<h4 >
						<span className="text-uppercase">{datosProveedor.name}</span>
						<small className="ml-4 text-muted">{datosProveedor.cif}</small>
					</h4>
					
				</Card.Title>



				<Card.Subtitle className="mb-2">
					<img alt={datosProveedor.country_name} src={`https://www.countryflags.io/` + datosProveedor.id_country + `/flat/24.png`} className="pr-2" />
					{datosProveedor.country_name}
					<small className="pl-1">({datosProveedor.id_country})</small>
				</Card.Subtitle>
					
				<Button className="float-right ml-3" variant="outline-danger">Eliminar</Button>
				<Button className="float-right" variant="primary">Editar</Button>
				
			</Card.Body>
		</Card>
	</Col>
}

export default RegistroProveedor;