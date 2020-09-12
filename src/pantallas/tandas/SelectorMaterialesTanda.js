import React, { useEffect, useContext, useState } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button } from 'react-bootstrap';
import Select from 'react-select'

const SelectorMaterialesTanda = ({ referencia, disabled, onMaterialesTandaCargados, defaultValue }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/material', jwt.token);

	const [selected, _setSelected] = useState([]);

	
	const setSelected = (values) => {
		referencia.current = { value: values ? values.map( v => v.value ) : []};
		_setSelected(values);
	}

	useEffect(() => {
		if (ejecutarConsulta) {
			onMaterialesTandaCargados(false);
			ejecutarConsulta({}, (error, res) => {
				if (!error)	onMaterialesTandaCargados(true);
			});
		}
	}, [ejecutarConsulta, onMaterialesTandaCargados]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando materiales</small> 
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">Ha fallado la carga de materiales.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else if (!resultado.datos?.data || resultado.datos.data?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">No se han encontrado materiales.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesMateriales = resultado.datos.data.map((datosMaterial) => {
			return { value: datosMaterial.id, label: <>{datosMaterial.cn} - {datosMaterial.name_spain}</> }
		});

		return <Select 
			options={opcionesMateriales}
			isMulti
			disabled={disabled}
			value={selected}
			onChange={setSelected}
			placeholder="Selecciona materiales"
		/>
/*		return <Form.Control as="select" ref={referencia} defaultValue={defaultValue} disabled={disabled}>
			{opcionesMateriales}
		</Form.Control >
		*/

	}



}


export default SelectorMaterialesTanda;