import React, { useEffect, useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Form, Button } from 'react-bootstrap';


const SelectorEstadoTanda = ({ referencia, disabled, onEstadosTandaCargados, defaultValue }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/series/status', jwt.token);

	useEffect(() => {
		if (ejecutarConsulta) {
			onEstadosTandaCargados(false);
			ejecutarConsulta({}, (error, res) => {
				if (!error)	onEstadosTandaCargados(true);
			});
		}
	}, [ejecutarConsulta, onEstadosTandaCargados]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando posibles estados de tanda</small> 
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">Ha fallado la carga de posibles estados de tanda.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">No se han encontrado posibles estados de tanda.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesEstadoTanda = resultado.datos.map((datosEstadoTanda, i) => {
			return <option key={i} value={datosEstadoTanda.id} >{datosEstadoTanda.status}</option>
		});

		return <Form.Control as="select" ref={referencia} defaultValue={defaultValue} disabled={disabled}>
			{opcionesEstadoTanda}
		</Form.Control >

	}



}


export default SelectorEstadoTanda;