import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button, Badge } from 'react-bootstrap';
import Select from 'react-select'
import BanderaPais from 'componentes/BanderaPais';
import Icono from 'componentes/icono/Icono';
import { FaInfoCircle } from 'react-icons/fa';

const generarValorDesdeDatosProveedor = (datosProveedor) => {
	if (!datosProveedor) return null;
	return {
		value: datosProveedor.id,
		label: <>
			<BanderaPais codigoPais={datosProveedor.id_country} className="mb-1 mr-1" />
			<b>{datosProveedor.cif}</b> - {datosProveedor.name}
			<small className="text-capitalize mx-1">({datosProveedor.country_name.toLowerCase()})</small>
			{datosProveedor.active === 0 && <MiniBadgeInactivo />}
		</>
	}
}

const SelectorProveedorTanda = ({ referencia, disabled, onProveedoresTandaCargados, onProveedorSeleccionado, materialSeleccionado, datosTanda, modoEdicion }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoMaestroProveedores, ejecutarConsulta: ejecutarConsultaMaestroProveedores } = useApiCall('/provider', jwt.token);

	let proveedorPorDefecto = datosTanda ? {
		id: datosTanda.id_provider,
		name: datosTanda.prov_name,
		cif: datosTanda.prov_cif,
		id_country: datosTanda.prov_country_id,
		country_name: datosTanda.prov_country_name,
		active: datosTanda.prov_active
	} : null;


	const [valorSeleccionado, _setValorSeleccionado] = useState(null);
	const setValorSeleccionado = useCallback((valor) => {
		referencia.current = { value: valor ? valor.value : null };
		_setValorSeleccionado(valor);

		if (onProveedorSeleccionado)
			onProveedorSeleccionado(valor);
	}, [referencia, _setValorSeleccionado, onProveedorSeleccionado]);

	const [maestroProveedoresCargado, setMaestroProveedoresCargado] = useState(false);

	useEffect(() => {
		if (modoEdicion) {
			onProveedoresTandaCargados(datosTanda && maestroProveedoresCargado);
		} else {
			onProveedoresTandaCargados(maestroProveedoresCargado);
		}
	}, [onProveedoresTandaCargados, maestroProveedoresCargado, modoEdicion, datosTanda])


	useEffect(() => {

		if (ejecutarConsultaMaestroProveedores && materialSeleccionado) {
			onProveedoresTandaCargados(false);
			ejecutarConsultaMaestroProveedores({ url: '/provider?id_mat=' + materialSeleccionado }, (error, res) => {
				if (!error) {
					setMaestroProveedoresCargado(true);
					onProveedoresTandaCargados(true);
				}
			});
		}

	}, [ejecutarConsultaMaestroProveedores, onProveedoresTandaCargados, materialSeleccionado]);


	useEffect(() => {
		setValorSeleccionado(null);
	}, [setValorSeleccionado, materialSeleccionado]);

	useEffect(() => {
		if (modoEdicion && proveedorPorDefecto) {
			setValorSeleccionado(generarValorDesdeDatosProveedor(proveedorPorDefecto))
		}
	}, [modoEdicion, setValorSeleccionado, datosTanda])


	// Solo debemos mostrar aquellos materiales que están activos !
	let proveedoresFiltrados = resultadoMaestroProveedores.datos?.data?.filter(proveedor => proveedor.active === 1);


	if ((modoEdicion && !proveedorPorDefecto) || !maestroProveedoresCargado) {
		return <>
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando proveedores</small>
		</>
	} else if (resultadoMaestroProveedores.error) {
		return <>
			<small className="text-danger"><Icono icono={FaInfoCircle} posicion={[16, 2]} /> Ha fallado la carga de proveedores.</small>
		</>
	} else if (!proveedorPorDefecto && (!proveedoresFiltrados || proveedoresFiltrados.length === 0)) {
		return <>
			<small className="text-danger"><Icono icono={FaInfoCircle} posicion={[16, 2]} /> No se han encontrado proveedores activos para el material seleccionado.</small>
		</>
	} else {

		// Vamos a buscar el valor actualmente seleccionado en la tanda en la lista de materiales disponibles.
		// Si no lo encontramos, es que ha sido desactivado y por tanto lo añadiremos a la lista
		let proveedorPorDefectoEncontrado = false;


		let opcionesProveedores = proveedoresFiltrados.map((datosProveedor) => {
			if (proveedorPorDefecto?.id === datosProveedor.id) {
				proveedorPorDefectoEncontrado = true;
			}
			return generarValorDesdeDatosProveedor(datosProveedor);
		});


		if (proveedorPorDefecto && !proveedorPorDefectoEncontrado && (materialSeleccionado === datosTanda.id_mat) ) {
			// Esto añade la opcion inactiva al inicio de la lista de materiales
			let opcionProveedorInactivo = generarValorDesdeDatosProveedor(proveedorPorDefecto);
			opcionesProveedores = [opcionProveedorInactivo, ...opcionesProveedores];

			// Si el valor seleccionado es el material inactivo, añade la marca de inactivo
			if (valorSeleccionado?.value === proveedorPorDefecto.id) {
				valorSeleccionado.label = <><b>{proveedorPorDefecto.cif}</b> - {proveedorPorDefecto.name} <MiniBadgeInactivo /> </>;
			}
		}

		return <Select
			options={opcionesProveedores}
			isDisabled={disabled}
			value={valorSeleccionado}
			onChange={setValorSeleccionado}
			placeholder="Selecciona proveedor"
		/>

	}



}

const MiniBadgeInactivo = () => {
	return <Badge size="sm" variant="warning" className="font-weight-normal py-1">INACTIVO</Badge>
}



export default SelectorProveedorTanda;