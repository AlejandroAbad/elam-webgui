import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button } from 'react-bootstrap';
import Select from 'react-select' 

const generaValoresDesdeDatosUsuario = (datosUsuario) => {
	if (!datosUsuario) return null;

	if (datosUsuario.id_user || datosUsuario.id) {
		return { value: datosUsuario.id_user ?? datosUsuario.id, label: <>{datosUsuario.name}</> }
	} else if (datosUsuario.map) {
		return datosUsuario.map( usuario => generaValoresDesdeDatosUsuario(usuario))
	}
	return null;
}

const SelectorUsuariosTanda = ({ referencia, disabled, onUsuariosTandaCargados, datosUsuarios, modoEdicion }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoMaestroUsuarios, ejecutarConsulta: ejecutarConsultaMaestroUsuarios } = useApiCall('/user', jwt.token);
	

	const [valoresSeleccionados, _setValoresSeleccionados] = useState(null);
	const setValoresSeleccionados = useCallback((values) => {
		referencia.current = { value: values ? values.map(v => v.value) : [] };
		_setValoresSeleccionados(values);
	}, [referencia, _setValoresSeleccionados]);

	const [maestroUsuariosCargado, setMaestroUsuariosCargado] = useState(false);

	useEffect(() => {
		if (modoEdicion)
			onUsuariosTandaCargados(datosUsuarios !== null && maestroUsuariosCargado);
		else
			onUsuariosTandaCargados(maestroUsuariosCargado);
	}, [datosUsuarios, maestroUsuariosCargado, onUsuariosTandaCargados, modoEdicion])

	useEffect(() => {
		onUsuariosTandaCargados(false);

		if (ejecutarConsultaMaestroUsuarios) {	
			ejecutarConsultaMaestroUsuarios({}, (error, res) => {
				if (!error) {
					setMaestroUsuariosCargado(true);
				}
			});
		}

	}, [ejecutarConsultaMaestroUsuarios, onUsuariosTandaCargados]);

	useEffect(() => {
		if (modoEdicion && datosUsuarios !== null) {
			setValoresSeleccionados(generaValoresDesdeDatosUsuario(datosUsuarios))
		}
	}, [modoEdicion, datosUsuarios, setValoresSeleccionados])


	if ( (modoEdicion && datosUsuarios === null) || !maestroUsuariosCargado) {
		return <>	
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando usuarios</small>
		</>
	} else if (resultadoMaestroUsuarios.error) {
		return <>
			<small className="text-danger">Ha fallado la carga de usuarios.</small> <Button variant="link" onClick={ejecutarConsultaMaestroUsuarios} size="sm">Reintentar</Button>
		</>
	} else if (!resultadoMaestroUsuarios.datos?.data || resultadoMaestroUsuarios.datos.data?.length === 0) {
		return <>
			<small className="text-danger">No se han encontrado usuarios.</small> <Button variant="link" onClick={ejecutarConsultaMaestroUsuarios} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesUsuarios = generaValoresDesdeDatosUsuario(resultadoMaestroUsuarios.datos.data)

		return <Select
			options={opcionesUsuarios}
			isMulti
			disabled={disabled}
			value={valoresSeleccionados}
			onChange={setValoresSeleccionados}
			placeholder="Selecciona usuarios"
		/>

	}



}


export default SelectorUsuariosTanda;