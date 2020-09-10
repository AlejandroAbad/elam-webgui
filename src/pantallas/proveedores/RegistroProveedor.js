import { useApiCall } from 'hooks/useApiCall';
import { ContextoAplicacion } from 'contexto';
import React, { useCallback, useContext } from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';


const RegistroProveedor = ({ datosProveedor, onProveedorBorrado }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { ejecutarConsulta } = useApiCall('/provider', jwt.token);


	const llamadaEliminarProveedor = useCallback(() => {
		ejecutarConsulta({
			method: 'DELETE',
			url: '/provider/' + datosProveedor.id,
		}, (error, res) => {

			if (error) {
				let errorMsg = error.message || error.msg || error.toString();
				toast.error(<>Error al eliminar el proveedor:<br /><small>{errorMsg}</small></>);
				return;
			}
			onProveedorBorrado(datosProveedor.id);
			toast.info(<>Proveedor eliminado: <h5 className="text-uppercase">{datosProveedor.name}</h5></>);
		})
	}, [datosProveedor, ejecutarConsulta, onProveedorBorrado]);



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
					
				<Button className="float-right ml-3" variant="outline-danger" onClick={llamadaEliminarProveedor}>Eliminar</Button>
				<Button className="float-right" variant="primary">Editar</Button>
				
			</Card.Body>
		</Card>
	</Col>
}

export default RegistroProveedor;