import React, { useEffect, useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Form, Alert } from 'react-bootstrap';

const SelectorPais = ({ referencia }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/country', jwt.token);

	useEffect(() => {
		if (ejecutarConsulta) ejecutarConsulta();
	}, [ejecutarConsulta]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Alert variant="info"><Spinner /> Obteniendo lista de paises</Alert>
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Alert variant="danger">Ha fallado la carga de paises</Alert>
		</>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Alert variant="warning">No se han encontrado paises</Alert>
		</>
	} else {

		let opcionesPaises = resultado.datos.map((datosPais, i) => {
			return <option key={i} value={datosPais.id}>{datosPais.name}</option>
		});

		return <Form.Control as="select" ref={referencia} >
			{opcionesPaises}
		</Form.Control >

	}



}


export default SelectorPais;