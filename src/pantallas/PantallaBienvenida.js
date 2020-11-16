import K from 'K';
import React, { useContext, useEffect } from 'react';
import { Container, Row, Card, Col, Alert, Spinner } from 'react-bootstrap';
import Icono from 'componentes/icono/Icono';
import { FaUserCheck, FaParachuteBox, FaPills } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import ContextoAplicacion from 'contexto';
import { useApiCall } from 'hooks/useApiCall';




const PantallaBienvenida = () => {

	const { jwt } = useContext(ContextoAplicacion);

	return (

		<Container>
			<h2 className="pb-2 mb-4 border-bottom">Lectura de materiales de almacén</h2>

			<Row className="d-flex justify-content-center">
				<Col lg={8} className="pb-3">

					<Card>
						<Card.Header as="h5">Estado de tandas</Card.Header>
						<Card.Body>
							<RowResumenTandas />
						</Card.Body>
					</Card>
				</Col>

				<Col lg={8}>
					<Card>
						<Card.Header as="h5">Gestión de maestros</Card.Header>
						<Card.Body>
							<Row className="d-flex justify-content-center">
								{jwt && jwt.id_profile === K.ROLES.ADMINISTRADOR &&
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
								}

								<Col sm={6} md={4}>
									<LinkContainer to="/maestro/materiales" >
										<Card sm={6} md={4} className="text-center cardBoton">
											<blockquote className="blockquote mb-0 card-body">
												<h1><Icono icono={FaPills} posicion={[60]} /></h1>
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

			</Row>


		</Container>

	)
}




const RowResumenTandas = () => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/series/dashboard', jwt.token);


	useEffect(() => {
		if (ejecutarConsulta) ejecutarConsulta();
	}, [ejecutarConsulta]);

	if (resultado.cargando) {
		return <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
			Obteniendo datos
		</Alert>
	} else if (resultado.error) {
		return <Alert variant="danger">
			<h6>Error al obtener datos de tandas</h6>
			<code>{resultado.error.message}</code>
		</Alert>
	} else {

		let creadas = 0, lanzadas = 0, finalizadas = 0;


		if (resultado.datos) {
			resultado.datos.forEach((infoTanda) => {
				switch (infoTanda.status) {
					case 'Creada': creadas = infoTanda.tandas; break;
					case 'Lanzada': lanzadas = infoTanda.tandas; break;
					case 'Finalizada': finalizadas = infoTanda.tandas; break;
					default: break;
				}
			})
		}

		return <Row className="d-flex justify-content-center">
			<CardResumenTanda tipo="Creada" cantidad={creadas} />
			<CardResumenTanda tipo="Lanzada" cantidad={lanzadas} />
			<CardResumenTanda tipo="Finalizada" cantidad={finalizadas} />
		</Row>

	}
}





const CardResumenTanda = ({ tipo, cantidad }) => {


	let variante = 'secondary';
	let filtro = '[1,2,3]';
	switch (tipo) {
		case 'Creada': variante = 'primary'; filtro = '[1]'; break;
		case 'Lanzada': variante = 'success'; filtro = '[2]'; break;
		case 'Finalizada': variante = 'dark'; filtro = '[3]'; break;
		default: break;
	}

	if (cantidad === 0) {
		variante = 'secondary';
	}

	return <Col className="mb-3" xs={6} sm={4} >
		<LinkContainer to="/tandas" onClick={() => { localStorage.setItem('filtroEstadoTanda', filtro); }} >
			<div className={`rounded border border-${variante} bg-${variante}-soft p-3 cardInfoTanda cardInfoTanda-${variante}`}>
				<div className="font-weight-bold text-center">{tipo}s</div>
				<div className="display-4 display-sm-3 text-center">
					{cantidad}
				</div>
			</div>
		</LinkContainer>
	</Col>
}


export default PantallaBienvenida;