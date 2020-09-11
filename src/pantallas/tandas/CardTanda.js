import React from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import BadgeInfoTanda from './BadgeInfoTanda';


const CardTanda = ({ datosTanda, mostrarBotones, onEditarPulsado, onBorrarPulsado }) => {

	if (!datosTanda) return null;

	return <Col>

		<Card xs={12} className="mt-2">
			<Card.Body>

				<Card.Title >
					<div className="float-right">
						<BadgeInfoTanda texto={datosTanda.status} className="mr-2" />
						<BadgeInfoTanda texto={datosTanda.type} />
					</div>

					<h4 className="mb-0 pb-0">
						<span className="text-uppercase">{datosTanda.name}</span>
					</h4>


				</Card.Title>

				<div className="float-left">
					<Button size="sm" className="mx-1" variant="outline-dark">Mostar detalles</Button>
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

export default CardTanda;