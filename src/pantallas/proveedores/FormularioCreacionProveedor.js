import React from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';

const ModalCreacionProveedor = (props) => {
	return <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" 	>
		<Modal.Header closeButton>
			<Modal.Title id="contained-modal-title-vcenter">
				Añadir nuevo proveedor
        	</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form>
				<Form.Group as={Row}>
					<Form.Label column sm="2">Nombre</Form.Label>
					<Col sm="10">
						<Form.Control type="text" placeholder="" />
					</Col>
				</Form.Group>
				<Form.Group as={Row}>
					<Form.Label column sm="2">CIF</Form.Label>
					<Col sm="6">
						<Form.Control type="text" placeholder="" />
					</Col>
				</Form.Group>

				<Form.Group as={Row}>
					<Form.Label column sm="2">País</Form.Label>
					<Col sm="4">
						<Form.Control as="select">
							<option>España</option>
							<option>Alemania</option>
							<option>3</option>
							<option>4</option>
							<option>5</option>
						</Form.Control>
					</Col>
				</Form.Group>
			</Form>
		</Modal.Body>
				<Modal.Footer>
					<Button variant="success" type="submit">Crear</Button>
					<Button variant="outline-dark" onClick={props.onHide}>Cancelar</Button>
				</Modal.Footer>
	</Modal>
}


export default ModalCreacionProveedor;