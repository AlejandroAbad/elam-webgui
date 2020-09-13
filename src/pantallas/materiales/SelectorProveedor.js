import React, { useEffect, useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Form, Button } from 'react-bootstrap';


const SelectorProveedor = ({ referencia, disabled, onProveedoresCargados, defaultValue }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/provider', jwt.token);

	useEffect(() => {
		if (ejecutarConsulta) {
			onProveedoresCargados(false);
			ejecutarConsulta({}, (error, res) => {
				if (!error) onProveedoresCargados(true);
			});
		}
	}, [ejecutarConsulta, onProveedoresCargados]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando proveedores</small> 
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">Ha fallado la carga de proveedores.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">No se han encontrado proveedores.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesProveedores = resultado.datos.data.map((datosProveedor, i) => {
			return <option key={i} value={datosProveedor.id} >{datosProveedor.name} ({datosProveedor.country_name.charAt(0).toUpperCase() + datosProveedor.country_name.slice(1).toLowerCase()})</option>
		});

		return <Form.Control as="select" ref={referencia} defaultValue={defaultValue} disabled={disabled}>
			{opcionesProveedores}
		</Form.Control >

	}



}


export default SelectorProveedor;