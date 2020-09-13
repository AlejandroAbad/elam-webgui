import Icono from 'componentes/icono/Icono';
import React from 'react';

import { Modal, Button, Col, Row } from 'react-bootstrap';
import { FaCheck, FaMinusCircle } from 'react-icons/fa';


const ModalLecturasTanda = ({ datosTanda, onCerrar, ...props }) => {

	let lineasLecturas = datosTanda.reads.map( (lectura, i) => {
		return <CardLecturaTanda key={i} lectura={lectura} />
	})


	return <Modal {...props} onHide={onCerrar} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Lecturas de la tanda
        		</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{lineasLecturas}
		</Modal.Body>
		<Modal.Footer>
			<Button variant="outline-dark" onClick={onCerrar}>cerrar</Button>
		</Modal.Footer>
	</Modal>


}


const CardLecturaTanda = ({ lectura }) => {

	let variante = 'default';
	let varianteIcono = 'success';
	let icono = FaCheck;

	switch (lectura.id_read_status) {
		case 2:
			variante = 'danger';
			varianteIcono = 'danger'
			icono = FaMinusCircle;
			break;
		default: break;
	}

	return <Row className={`no-gutters bg-${variante}-soft`}>
		
		<Col md={3}>
			<span className={`mx-1 text-${varianteIcono}`}><Icono icono={icono} posicion={[18, 3]} /></span>
			{lectura.date_time}
		</Col>
		<Col md={3}>{lectura.name}</Col>
		<Col md={6}>{lectura.cn} - {lectura.name_spain}</Col>
	</Row>

}


export default ModalLecturasTanda;