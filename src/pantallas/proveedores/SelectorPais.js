import K from 'K';
import React, { useEffect, useContext } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Form, Button } from 'react-bootstrap';


const SelectorPais = ({ referencia, disabled, onPaisesCargados, defaultValue, incluirEMA }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/country', jwt.token);

	useEffect(() => {
		if (ejecutarConsulta) {
			onPaisesCargados(false);
			ejecutarConsulta({}, (error, res) => {
				if (!error)	onPaisesCargados(true);
			});
		}
	}, [ejecutarConsulta, onPaisesCargados]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando paises</small> 
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">Ha fallado la carga de paises.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else if (!resultado.datos || resultado.datos?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">No se han encontrado paises.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesPaises = resultado.datos.filter(datosPais => (datosPais.id !== K.EMA.CODIGO) ).map((datosPais, i) => {
			return <option key={i+1} value={datosPais.id} >{datosPais.name}</option>
		});

		if (incluirEMA) {
			let opcionEMA = <option key={0} value="00">EMA - European Medicines Agency</option>
			opcionesPaises = [opcionEMA, ...opcionesPaises];
		}

		return <Form.Control as="select" ref={referencia} defaultValue={defaultValue} disabled={disabled}>
			{opcionesPaises}
		</Form.Control >

	}



}


export default SelectorPais;