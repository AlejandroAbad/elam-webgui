import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button } from 'react-bootstrap';
import Select from 'react-select'

const SelectorMaterialesTanda = ({ referencia, disabled, onMaterialesTandaCargados, idTanda }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoMaestroMateriales, ejecutarConsulta: ejecutarConsultaMaestroMateriales } = useApiCall('/material', jwt.token);
	const { ejecutarConsulta: ejecutarConsultaValoresPorDefecto } = useApiCall('/series/' + idTanda, jwt.token);

	const [valoresSeleccionados, _setValoresSeleccionados] = useState(null);
	const setValoresSeleccionados = useCallback((values) => {
		referencia.current = { value: values ? values.map(v => v.value) : [] };
		_setValoresSeleccionados(values);
	}, [referencia, _setValoresSeleccionados]);

	const [valoresPorDefectoCargados, setValoresPorDefectoCargados] = useState(false);
	const [maestroMaterialesCargado, setMaestroMaterialesCargado] = useState(false);

	useEffect(() => {
		onMaterialesTandaCargados(valoresPorDefectoCargados && maestroMaterialesCargado);
	}, [valoresPorDefectoCargados, maestroMaterialesCargado, onMaterialesTandaCargados])

	useEffect(() => {

		if (ejecutarConsultaMaestroMateriales) {
			onMaterialesTandaCargados(false);
			ejecutarConsultaMaestroMateriales({}, (error, res) => {
				if (!error) {
					setMaestroMaterialesCargado(true);
				}
			});
		}

		if (ejecutarConsultaValoresPorDefecto && idTanda) {
			ejecutarConsultaValoresPorDefecto({}, (error, res) => {
				if (!error) {
					let materiales = res.assig_materials ? res.assig_materials.map(mat => { return { value: mat.id_mat, label: <>{mat.cn} - {mat.name_spain}</> }}) : [];
					setValoresSeleccionados(materiales);
					setValoresPorDefectoCargados(true);
				}
			})
		} else if (!idTanda) {
			setValoresSeleccionados([]);
			setValoresPorDefectoCargados(true);
		}

	}, [ejecutarConsultaMaestroMateriales, ejecutarConsultaValoresPorDefecto, onMaterialesTandaCargados, setValoresSeleccionados, idTanda]);


	if (!valoresPorDefectoCargados || !maestroMaterialesCargado) {
		return <>
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando materiales</small>
		</>
	} else if (resultadoMaestroMateriales.error) {
		return <>
			<small className="text-danger">Ha fallado la carga de materiales.</small> <Button variant="link" onClick={ejecutarConsultaMaestroMateriales} size="sm">Reintentar</Button>
		</>
	} else if (!resultadoMaestroMateriales.datos?.data || resultadoMaestroMateriales.datos.data?.length === 0) {
		return <>
			<small className="text-danger">No se han encontrado materiales.</small> <Button variant="link" onClick={ejecutarConsultaMaestroMateriales} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesMateriales = resultadoMaestroMateriales.datos.data.map((datosMaterial) => {
			return { value: datosMaterial.id, label: <>{datosMaterial.cn} - {datosMaterial.name_spain}</> }
		});

		return <Select
			options={opcionesMateriales}
			isMulti
			disabled={disabled}
			value={valoresSeleccionados}
			onChange={setValoresSeleccionados}
			placeholder="Selecciona materiales"
		/>

	}



}


export default SelectorMaterialesTanda;