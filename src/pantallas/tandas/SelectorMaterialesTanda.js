import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button, Badge } from 'react-bootstrap';
import Select from 'react-select'

const generarValorDesdeDatosMaterial = (datosMaterial, inactivo) => {
	if (!datosMaterial) return null;
	return {
		value: datosMaterial.id_mat ?? datosMaterial.id , 
		label: <>{datosMaterial.cn} - {datosMaterial.name_spain} <MiniBadgeGtin gtin={datosMaterial.gtin} /> {inactivo && <MiniBadgeInactivo/>}</>, 
		gtin: datosMaterial.gtin ? 1 : 0
	}
}

const SelectorMaterialesTanda = ({ referencia, disabled, onMaterialesTandaCargados, onMaterialSeleccionado, datosTanda, modoEdicion }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoMaestroMateriales, ejecutarConsulta: ejecutarConsultaMaestroMateriales } = useApiCall('/material', jwt.token);

	let materialPorDefecto = datosTanda?.assig_materials?.length ? datosTanda.assig_materials[0] : null;

	const [valorSeleccionado, _setValorSeleccionado] = useState(null);
	const setValorSeleccionado = useCallback((valor) => {
		referencia.current = { value: valor ? valor.value : null };
		_setValorSeleccionado(valor);

		if (onMaterialSeleccionado)
			onMaterialSeleccionado(valor);
	}, [referencia, _setValorSeleccionado, onMaterialSeleccionado]);

	const [maestroMaterialesCargado, setMaestroMaterialesCargado] = useState(false);

	useEffect(() => {
		if (modoEdicion) {
			onMaterialesTandaCargados(datosTanda && maestroMaterialesCargado);
		} else {
			onMaterialesTandaCargados(maestroMaterialesCargado);
		}
	}, [onMaterialesTandaCargados, maestroMaterialesCargado, modoEdicion, datosTanda])


	useEffect(() => {

		if (ejecutarConsultaMaestroMateriales) {
			onMaterialesTandaCargados(false);
			ejecutarConsultaMaestroMateriales({}, (error, res) => {
				if (!error) {
					setMaestroMaterialesCargado(true);
				}
			});
		}

	}, [ejecutarConsultaMaestroMateriales, onMaterialesTandaCargados]);


	useEffect( ()=> {
		if (modoEdicion && materialPorDefecto) {
			setValorSeleccionado(generarValorDesdeDatosMaterial(materialPorDefecto))
		}
	}, [modoEdicion, setValorSeleccionado, materialPorDefecto])


	// Solo debemos mostrar aquellos materiales que están activos !
	let materialesFiltrados = resultadoMaestroMateriales.datos?.data?.filter(material => material.active === 1);
	

	if ((modoEdicion && !materialPorDefecto) || !maestroMaterialesCargado) {
		return <>
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando materiales</small>
		</>
	} else if (resultadoMaestroMateriales.error) {
		return <>
			<small className="text-danger">Ha fallado la carga de materiales.</small> <Button variant="link" onClick={ejecutarConsultaMaestroMateriales} size="sm">Reintentar</Button>
		</>
	} else if (!materialPorDefecto && (!materialesFiltrados || materialesFiltrados.length === 0)) {
		return <>
			<small className="text-danger">No se han encontrado materiales activos.</small> <Button variant="link" onClick={ejecutarConsultaMaestroMateriales} size="sm">Reintentar</Button>
		</>
	} else {

		// Vamos a buscar el valor actualmente seleccionado en la tanda en la lista de materiales disponibles.
		// Si no lo encontramos, es que ha sido desactivado y por tanto lo añadiremos a la lista
		let materialPorDefectoEncontrado = false;


		let opcionesMateriales = materialesFiltrados.map((datosMaterial) => {
			if (materialPorDefecto?.id_mat === datosMaterial.id) {
				materialPorDefectoEncontrado = true;
			}
			return generarValorDesdeDatosMaterial(datosMaterial);
		});


		if (materialPorDefecto && !materialPorDefectoEncontrado) {
			// Esto añade la opcion inactiva al inicio de la lista de materiales
			let opcionMaterialInactivo = generarValorDesdeDatosMaterial(materialPorDefecto, true);
			opcionesMateriales = [opcionMaterialInactivo, ...opcionesMateriales];

			// Si el valor seleccionado es el material inactivo, añade la marca de inactivo
			if (valorSeleccionado?.value === materialPorDefecto.id_mat) {
				valorSeleccionado.label = <>{materialPorDefecto.cn} - {materialPorDefecto.name_spain} <MiniBadgeGtin gtin={materialPorDefecto.gtin} /> <MiniBadgeInactivo /> </>;
			}
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

const MiniBadgeGtin = ({ gtin }) => {
	if (!gtin) return null;
	return <Badge size="sm" variant="primary" className="font-weight-normal py-1">GTIN</Badge>
}

const MiniBadgeInactivo = () => {
	return <Badge size="sm" variant="warning" className="font-weight-normal py-1">INACTIVO</Badge>
}



export default SelectorMaterialesTanda;