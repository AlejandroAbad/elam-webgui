import React, { useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { Col, Card, Button } from 'react-bootstrap';


const CardUsuario = ({ datosUsuario, mostrarBotones, onEditarPulsado, onBorrarPulsado }) => {

	const { jwt } = useContext(ContextoAplicacion);
	if (!datosUsuario) return null;

	return <Col>

		<Card xs={12} className="mt-2">
			<Card.Body>
				<Card.Title className="float-right"><small className="text-mutted"># <strong>{datosUsuario.id}</strong></small></Card.Title>
				<Card.Title >
					<h4 >
						<span className="text-uppercase">{datosUsuario.name}</span>
						<small className="ml-4 text-muted">{datosUsuario.id_profile}</small>
					</h4>
				</Card.Title>

				<Card.Subtitle className="mb-2">
					{datosUsuario.user}
				</Card.Subtitle>

				{mostrarBotones && <>
					<Button size="sm" className="float-right ml-3" variant="outline-danger" onClick={onBorrarPulsado} disabled={jwt.user === datosUsuario.user}>Eliminar</Button>
					<Button size="sm" className="float-right" variant="primary" onClick={onEditarPulsado}>Editar</Button>
				</>}

			</Card.Body>
		</Card>
	</Col>
}

export default CardUsuario;