import React from 'react';
import { MdError } from 'react-icons/md';
import Icono from 'componentes/icono/Icono';
import { FaAsterisk, FaPlay, FaStop, FaLock, FaLockOpen } from 'react-icons/fa';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

const BadgeInfoTanda = ({ texto, extendido, ...props }) => {

	if (!texto) texto = 'No definido';

	let variante = 'danger';
	let icono = MdError;
	switch (texto.toLowerCase()) {
		case 'creada':
			variante = 'primary';
			icono = FaAsterisk;
			break;
		case 'lanzada':
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

	if (extendido) {
		return <>
			<Icono icono={icono} posicion={[16, 3]} className={`text-` + variante + ` ` + props.className} />
			<span className={`text-` + variante}>{texto}</span>
		</>
	} else {
		const popover = (
			<Popover id="popover-scuanch">
				<Popover.Content>
					Tanda {texto}
				</Popover.Content>
			</Popover>
		);

		return <OverlayTrigger trigger={["hover", "focus"]} overlay={popover} placement="bottom-start">
			<Button variant='default' className="m-0 mb-1 p-0" style={{ cursor: 'default' }}>
				<Icono icono={icono} posicion={[16, 3]} className={`text-` + variante + ` ` + props.className} />
			</Button>
		</OverlayTrigger>
	}


}

export default BadgeInfoTanda;