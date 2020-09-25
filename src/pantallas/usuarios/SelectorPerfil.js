import React, { useEffect, useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Form, Button } from 'react-bootstrap';


const SelectorPerfil = ({ referencia, disabled, onPerfilesCargados, defaultValue }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/user/profiles', jwt.token);

	useEffect(() => {
		if (ejecutarConsulta) {
			onPerfilesCargados(false);
			ejecutarConsulta({}, (error, res) => {
				if (!error)	onPerfilesCargados(true);
			});
		}
	}, [ejecutarConsulta, onPerfilesCargados]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando perfiles</small> 
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">Ha fallado la carga de perfiles.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">No se han encontrado perfiles.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesPerfiles = resultado.datos.map((datosPerfil, i) => {
			return <option key={i} value={datosPerfil.profile} >{datosPerfil.profile} - {datosPerfil.namel}</option>
		});

		return <Form.Control as="select" ref={referencia} defaultValue={defaultValue} disabled={disabled}>
			{opcionesPerfiles}
		</Form.Control >

	}



}


export default SelectorPerfil;