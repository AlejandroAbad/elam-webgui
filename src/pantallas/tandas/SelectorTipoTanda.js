import React, { useEffect, useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Form, Button } from 'react-bootstrap';


const SelectorTipoTanda = ({ referencia, disabled, onTiposTandaCargados, defaultValue }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/series/types', jwt.token);

	useEffect(() => {
		if (ejecutarConsulta) {
			onTiposTandaCargados(false);
			ejecutarConsulta({}, (error, res) => {
				if (!error)	onTiposTandaCargados(true);
			});
		}
	}, [ejecutarConsulta, onTiposTandaCargados]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando tipos de tanda</small> 
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">Ha fallado la carga de tipos de tandas.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">No se han encontrado tipos de tandas.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesTipoTanda = resultado.datos.map((datosTipoTanda, i) => {
			return <option key={i} value={datosTipoTanda.id} >{datosTipoTanda.type}</option>
		});

		return <Form.Control as="select" ref={referencia} defaultValue={defaultValue} disabled={disabled}>
			{opcionesTipoTanda}
		</Form.Control >

	}



}


export default SelectorTipoTanda;