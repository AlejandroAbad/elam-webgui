import React from 'react';
import { Col } from 'react-bootstrap';


const NoAutorizado = () => {
	return	<Col md={11} lg={8} className="shadow m-auto py-5 p-sm-4 p-md-5 my-md-5">
		<h3 className="mb-3">No autorizado</h3>
		Los usuarios de almacén no están autorizados a utilizar la aplicación web.
	</Col>
}


export default NoAutorizado;