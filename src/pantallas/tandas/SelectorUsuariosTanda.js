import React, { useEffect, useContext, useState } from 'react';
import { ContextoAplicacion } from 'contexto';
import { useApiCall } from 'hooks/useApiCall';
import { Spinner, Button } from 'react-bootstrap';
import Select from 'react-select'

const SelectorUsuariosTanda = ({ referencia, disabled, onUsuariosTandaCargados, defaultValue }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta, setResultado } = useApiCall('/usuarios', jwt.token);

	const [selected, _setSelected] = useState([]);

	const setSelected = (values) => {
		referencia.current = { value: values ? values.map(v => v.value) : [] };
		_setSelected(values);
	}

	useEffect(() => {
		/*
		if (ejecutarConsulta) {
			onUsuariosTandaCargados(false);
			ejecutarConsulta({}, (error, res) => {
				if (!error)	onUsuariosTandaCargados(true);
			});
		}
		*/

		setResultado({
			ok: true,
			cargando: false,
			error: null,
			query: {},
			datos: {
				data: [
					{ id: 1, name: 'Danielo Canelo'},
					{ id: 2, name: 'Pendiente: Consulta lista usuarios (basica: id+name)' }
				]
			}
		})
		onUsuariosTandaCargados(true);

	}, [/*ejecutarConsulta, */onUsuariosTandaCargados, setResultado]);

	if (resultado.cargando) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<Spinner animation="grow" size="sm" variant="info" /> <small className="text-info">Cargando usuarios</small> 
		</>
	} else if (resultado.error) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">Ha fallado la carga de usuarios.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else if (!resultado.datos?.data || resultado.datos.data?.length === 0) {
		return <>
			<input type="hidden" value="" ref={referencia} />
			<small className="text-danger">No se han encontrado usuarios.</small> <Button variant="link" onClick={ejecutarConsulta} size="sm">Reintentar</Button>
		</>
	} else {

		let opcionesUsuarios = resultado.datos.data.map((datosUsuario) => {
			return { value: datosUsuario.id, label: datosUsuario.name }
		});

		return <Select 
			options={opcionesUsuarios}
			isMulti
			disabled={disabled}
			value={selected}
			onChange={setSelected}
			placeholder="Selecciona usuarios"
		/>


	}



}


export default SelectorUsuariosTanda;