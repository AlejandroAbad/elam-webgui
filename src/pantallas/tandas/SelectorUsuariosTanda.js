import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button } from 'react-bootstrap';
import Select from 'react-select'

const SelectorUsuariosTanda = ({ referencia, disabled, onUsuariosTandaCargados, idTanda }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado: resultadoMaestroUsuarios, ejecutarConsulta: ejecutarConsultaMaestroUsuarios, setResultado: setResultadoMaestroUsuarios } = useApiCall('/users', jwt.token);
	const { ejecutarConsulta: ejecutarConsultaValoresPorDefecto } = useApiCall('/series/' + idTanda, jwt.token);

	const [valoresSeleccionados, _setValoresSeleccionados] = useState(null);
	const setValoresSeleccionados = useCallback((values) => {
		referencia.current = { value: values ? values.map(v => v.value) : [] };
		_setValoresSeleccionados(values);
	}, [referencia, _setValoresSeleccionados]);

	const [valoresPorDefectoCargados, setValoresPorDefectoCargados] = useState(false);
	const [maestroUsuariosCargado, setMaestroUsuariosCargado] = useState(false);

	useEffect(() => {
		onUsuariosTandaCargados(valoresPorDefectoCargados && maestroUsuariosCargado);
	}, [valoresPorDefectoCargados, maestroUsuariosCargado, onUsuariosTandaCargados])

	useEffect(() => {
		onUsuariosTandaCargados(false);

		if (ejecutarConsultaMaestroUsuarios) {	
			/*
			ejecutarConsultaMaestroUsuarios({}, (error, res) => {
				if (!error) {
					setMaestroUsuariosCargado(true);
				}
			});
			*/
			// Simulamos como que llegan los usuarios en 500ms....
			setTimeout( () => {
				setResultadoMaestroUsuarios({
					ok: true,
					error: null,
					cargando: false,
					query: {},
					datos: {
						data: [ {id: 1, name: 'Danielo Canelo'}, {id: 2, name: 'Alexei Stukov'} ]
					}
				});
				setMaestroUsuariosCargado(true);
			}, 500)

		}

		if (ejecutarConsultaValoresPorDefecto && idTanda) {
			ejecutarConsultaValoresPorDefecto({}, (error, res) => {
				if (!error) {
					let materiales = res.assig_users ? res.assig_users.map(u => { return { value: u.id_user, label: <>{u.name}</> } }) : [];
					setValoresSeleccionados(materiales);
					setValoresPorDefectoCargados(true);
				}
			})
		} else if (!idTanda) {
			setValoresSeleccionados([]);
			setValoresPorDefectoCargados(true);
		}

	}, [ejecutarConsultaMaestroUsuarios, ejecutarConsultaValoresPorDefecto, onUsuariosTandaCargados, setValoresSeleccionados, idTanda, setResultadoMaestroUsuarios]);


	if (!valoresPorDefectoCargados || !maestroUsuariosCargado) {
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

		let opcionesUsuarios = resultadoMaestroUsuarios.datos.data.map((datosUsuario) => {
			return { value: datosUsuario.id, label: <>{datosUsuario.name}</> }
		});

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