import React, { useEffect, useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Form, Button } from 'react-bootstrap';


const SelectorProveedor = ({ referencia, disabled, onProveedoresCargados, idProveedorSeleccionado }) => {

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
			<small className="text-danger">No se han encontrado proveedores activos.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesProveedores = [];
		let proveedorInactivoEncontrado = false;

		resultado.datos.data.forEach((datosProveedor, i) => {
			if (datosProveedor.active) {
				opcionesProveedores.push(<option key={i} value={datosProveedor.id} >{datosProveedor.name} ({datosProveedor.country_name.charAt(0).toUpperCase() + datosProveedor.country_name.slice(1).toLowerCase()})</option>)
			} else if (idProveedorSeleccionado === datosProveedor.id) {
				proveedorInactivoEncontrado = datosProveedor;
			}
		});

		if (proveedorInactivoEncontrado) {
			opcionesProveedores = [
				<option key={opcionesProveedores.length} value={proveedorInactivoEncontrado.id} >
					(INACTIVO) {proveedorInactivoEncontrado.name} ({proveedorInactivoEncontrado.country_name.charAt(0).toUpperCase() + proveedorInactivoEncontrado.country_name.slice(1).toLowerCase()})
				</option>,
				...opcionesProveedores];
		}

		if (opcionesProveedores.length > 0) {
			return <Form.Control as="select" ref={referencia} defaultValue={idProveedorSeleccionado} disabled={disabled}>
				{opcionesProveedores}
			</Form.Control >
		} else {
			return <>
				<input type="hidden" value="" ref={referencia} />
				<small className="text-danger">Todos los proveedores están inactivos.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Refrescar</Button>
			</>
		}

	}



}


export default SelectorProveedor;