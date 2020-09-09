import React from 'react';
import { Container, Row, Card, Col, Button, CardDeck, CardColumns } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FaUserCheck, FaRegLemon, FaParachuteBox } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';




const PantallaBienvenida = () => {
	return (

		<Container>
			<h2 className="pb-2 mb-4 border-bottom">Lectura de materiales de almacén</h2>

			<Row>
				<Col xl={7}>
					<Card>
						<Card.Header as="h5">Gestión de maestros</Card.Header>
						<Card.Body>
							<Row>
								<Col sm={6} md={4}>
									<LinkContainer to="/maestro/usuarios" >
										<Card className="text-center cardBoton">
											<blockquote className="blockquote mb-0 card-body">
												<h1><Icono icono={FaUserCheck} posicion={[60]} /></h1>
												<h5>Usuarios</h5>
											</blockquote>
										</Card>
									</LinkContainer>
								</Col>

								<Col sm={6} md={4}>
									<LinkContainer to="/maestro/materiales" >
										<Card sm={6} md={4} className="text-center cardBoton">
											<blockquote className="blockquote mb-0 card-body">
												<h1><Icono icono={FaRegLemon} posicion={[60]} /></h1>
												<h5>Materiales</h5>
											</blockquote>
										</Card>
									</LinkContainer>
								</Col>
								<Col sm={6} md={4} className="pt-sm-4 pt-md-0">
									<LinkContainer to="/maestro/proveedores" >
										<Card sm={6} md={4} className="text-center cardBoton">
											<blockquote className="blockquote mb-0 card-body">
												<h1><Icono icono={FaParachuteBox} posicion={[60]} /></h1>
												<h5>Proveedores</h5>
											</blockquote>
										</Card>
									</LinkContainer>
								</Col>

							</Row>



						</Card.Body>
					</Card>
				</Col>
				<Col xl={5} className="pt-3 pt-xl-0">
					<Card>
						<Card.Header as="h5">Control de tandas</Card.Header>
						<Card.Body>
							<Card.Title>TBD</Card.Title>
							<Card.Text>Lipsum bla bla</Card.Text>
							<Button variant="primary">Acceder</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>


		</Container>

	)
}


export default PantallaBienvenida;