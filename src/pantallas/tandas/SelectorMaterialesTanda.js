import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button } from 'react-bootstrap';
import Select from 'react-select'

const SelectorMaterialesTanda = ({ referencia, disabled, onMaterialesTandaCargados, idTanda }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoMaestroMateriales, ejecutarConsulta: ejecutarConsultaMaestroMateriales } = useApiCall('/material', jwt.token);
	const { ejecutarConsulta: ejecutarConsultaValorPorDefecto } = useApiCall('/series/' + idTanda, jwt.token);

	const [valorSeleccionado, _setValorSeleccionado] = useState(null);
	const setValorSeleccionado = useCallback((valor) => {
		referencia.current = { value: valor ? valor.value : null };
		_setValorSeleccionado(valor);
	}, [referencia, _setValorSeleccionado]);

	const [valoresPorDefectoCargados, setValorPorDefectoCargado] = useState(false);
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

		if (ejecutarConsultaValorPorDefecto && idTanda) {
			ejecutarConsultaValorPorDefecto({}, (error, res) => {
				if (!error) {
					let materialPorDefecto = res.assig_materials?.length ? res.assig_materials[0] : null;

					let valor = materialPorDefecto ? { value: materialPorDefecto.id_mat, label: <>{materialPorDefecto.cn} - {materialPorDefecto.name_spain}</> } : null;
					setValorSeleccionado(valor);
					setValorPorDefectoCargado(true);
				}
			})
		} else if (!idTanda) {
			setValorSeleccionado(null);
			setValorPorDefectoCargado(true);
		}

	}, [ejecutarConsultaMaestroMateriales, ejecutarConsultaValorPorDefecto, onMaterialesTandaCargados, setValorSeleccionado, idTanda]);


	// Solo debemos mostrar aquellos materiales que están activos !
	let materialesFiltrados = resultadoMaestroMateriales.datos?.data?.filter( material => material.active === 1);

	if (!valoresPorDefectoCargados || !maestroMaterialesCargado) {
		return <>
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando materiales</small>
		</>
	} else if (resultadoMaestroMateriales.error) {
		return <>
			<small className="text-danger">Ha fallado la carga de materiales.</small> <Button variant="link" onClick={ejecutarConsultaMaestroMateriales} size="sm">Reintentar</Button>
		</>
	} else if (!valorSeleccionado && (!materialesFiltrados || materialesFiltrados.length === 0)) {
		return <>
			<small className="text-danger">No se han encontrado materiales activos.</small> <Button variant="link" onClick={ejecutarConsultaMaestroMateriales} size="sm">Reintentar</Button>
		</>
	} else {
		
		// Vamos a buscar el valor actualmente seleccionado en la tanda en la lista de materiales disponibles.
		// Si no lo encontramos, es que ha sido desactivado y por tanto lo añadiremos a la lista
		let valorSeleccionadoEncontrado = false;

		let opcionesMateriales = materialesFiltrados.map((datosMaterial) => {
			if (valorSeleccionado?.value === datosMaterial.id)
				valorSeleccionadoEncontrado = true;

			return { value: datosMaterial.id, label: <>{datosMaterial.cn} - {datosMaterial.name_spain}</> }
		});

		if (valorSeleccionado && !valorSeleccionadoEncontrado) {
			opcionesMateriales = [valorSeleccionado, ...opcionesMateriales];
		}

		return <Select
			options={opcionesMateriales}
			disabled={disabled}
			value={valorSeleccionado}
			onChange={setValorSeleccionado}
			placeholder="Selecciona material"
		/>

	}



}


export default SelectorMaterialesTanda;