import React from 'react';
import { Badge } from 'react-bootstrap';
import { MdError } from 'react-icons/md';
import Icono from 'componentes/icono/Icono';
import { FaAsterisk, FaPlay, FaStop, FaLock, FaLockOpen } from 'react-icons/fa';


const BadgeInfoTanda = ({texto, ...props}) => {

	if (!texto) texto = 'No definido';

	let variante = 'danger';
	let icono = MdError;
	switch (texto.toLowerCase()) {
		case 'creada':
			variante = 'primary';
			icono = FaAsterisk;
			break;
		case 'liberada':
			variante = 'success';
			icono = FaPlay;
			break;
		case 'finalizada':
			variante = 'dark';
			icono = FaStop;
			break;
		case 'abierta':
			variante = 'success';
			icono = FaLockOpen;
			break;
		case 'cerrada':
			variante = 'muted';
			icono = FaLock;
			break;
		default: break;
	}

	return 		<Icono icono={icono} posicion={[16, 3]} className={`text-`+variante + ` ` + props.className} />
	
}

export default BadgeInfoTanda;