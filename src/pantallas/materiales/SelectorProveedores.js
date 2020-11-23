import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button, Badge } from 'react-bootstrap';
import Select from 'react-select'
import BanderaPais from 'componentes/BanderaPais';

const generaValoresDesdeDatosProveedor = (datosProveedor, incluirInactivo) => {
	if (!datosProveedor) return null;

	if (datosProveedor.id) {
		if (datosProveedor.active === 1 || incluirInactivo) {
			return {
				value: datosProveedor.id ?? datosProveedor.id,
				label: <>
					<BanderaPais codigoPais={datosProveedor.id_country} />
					{datosProveedor.name} <small>({datosProveedor.name_country || datosProveedor.country_name})</small>
					{datosProveedor.active === 0 && <Badge variant="warning" size="sm" className="ml-1">INACTIVO</Badge>}
				</>
			}
		}
		return null;
	} else if (datosProveedor.map) {
		return datosProveedor.map(proveedor => generaValoresDesdeDatosProveedor(proveedor, incluirInactivo)).filter(proveedor => proveedor !== null)
	}
	return null;
}



const SelectorProveedores = ({ referencia, disabled, onProveedoresCargados, datosProveedores, modoEdicion }) => {

	console.log("DISABLED", disabled);
	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoMaestroProveedores, ejecutarConsulta: ejecutarConsultaMaestroProveedores } = useApiCall('/provider', jwt.token);


	const [valoresSeleccionados, _setValoresSeleccionados] = useState(null);
	const setValoresSeleccionados = useCallback((values) => {
		referencia.current = { value: values ? values.map(v => { return { id: v.value } }) : [] };
		_setValoresSeleccionados(values);
	}, [referencia, _setValoresSeleccionados]);

	const [maestroProveedoresCargado, setMaestroUsuariosCargado] = useState(false);

	useEffect(() => {
		if (modoEdicion)
			onProveedoresCargados(datosProveedores !== null && maestroProveedoresCargado);
		else
			onProveedoresCargados(maestroProveedoresCargado);
	}, [datosProveedores, maestroProveedoresCargado, onProveedoresCargados, modoEdicion])

	useEffect(() => {
		onProveedoresCargados(false);

		if (ejecutarConsultaMaestroProveedores) {
			ejecutarConsultaMaestroProveedores({}, (error, res) => {
				if (!error) {
					setMaestroUsuariosCargado(true);
				}
			});
		}

	}, [ejecutarConsultaMaestroProveedores, onProveedoresCargados]);

	useEffect(() => {
		if (modoEdicion && datosProveedores !== null) {
			setValoresSeleccionados(generaValoresDesdeDatosProveedor(datosProveedores, true))
		}
	}, [modoEdicion, datosProveedores, setValoresSeleccionados])


	if ((modoEdicion && datosProveedores === null) || !maestroProveedoresCargado) {
		return <>
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando proveedores</small>
		</>
	} else if (resultadoMaestroProveedores.error) {
		return <>
			<small className="text-danger">Ha fallado la carga de proveedores.</small> <Button variant="link" onClick={ejecutarConsultaMaestroProveedores} size="sm">Reintentar</Button>
		</>
	} else if (!resultadoMaestroProveedores.datos?.data || resultadoMaestroProveedores.datos.data?.length === 0) {
		return <>
			<small className="text-danger">No se han encontrado proveedores.</small> <Button variant="link" onClick={ejecutarConsultaMaestroProveedores} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesProveedores = generaValoresDesdeDatosProveedor(resultadoMaestroProveedores.datos.data);



		if (modoEdicion && datosProveedores !== null) {
			let proveedoresSeleccionadosInactivos = datosProveedores.filter( prov => prov.active === 0);
			opcionesProveedores = [
				...opcionesProveedores,
				...generaValoresDesdeDatosProveedor(proveedoresSeleccionadosInactivos, true)
			]
		}


		return <Select
			options={opcionesProveedores}
			isMulti
			isDisabled={disabled}
			value={valoresSeleccionados}
			onChange={setValoresSeleccionados}
			placeholder="Seleccione proveedores"
		/>

	}



}


export default SelectorProveedores;