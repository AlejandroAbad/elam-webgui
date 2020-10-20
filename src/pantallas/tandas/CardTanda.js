import React, { useCallback, useContext, useEffect } from 'react';
import { ContextoAplicacion } from 'contexto';

import { Col, Card, Button, Collapse, Spinner, Alert, Row, Popover, OverlayTrigger, ListGroup, Badge } from 'react-bootstrap';
import BadgeInfoTanda from './BadgeInfoTanda';
import { useApiCall } from 'hooks/useApiCall';
import { FaFileExcel, FaRegEye, FaRegFilePdf } from 'react-icons/fa';
import Icono from 'componentes/icono/Icono';

import useStateLocalStorage from 'hooks/useStateLocalStorage';
import { toast } from 'react-toastify';

import ReactExport from "react-data-export";
import fileDownload from 'js-file-download';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const CardTanda = ({ datosTanda, mostrarBotones, onEditarPulsado, onBorrarPulsado }) => {



	const [mostrarDatosAvanzados, setMostrarDatosAvanzados] = useStateLocalStorage('detalleTanda.' + datosTanda.id, false, true);


	if (!datosTanda) return null;

	return <Col>

		<Card xs={12} className="mt-2">
			<Card.Body>

				<Card.Title >
					{(!mostrarDatosAvanzados || !mostrarBotones) &&
						<div className="float-right" >
							<BadgeInfoTanda texto={datosTanda.status} className="mr-2" />
							<BadgeInfoTanda texto={datosTanda.type} />
						</div>
					}

					<h4 className="mb-0 pb-0">
						<span className="text-uppercase">{datosTanda.name}</span>
					</h4>

				</Card.Title>


				{mostrarBotones && // Evita 'Can't perform a React state update on an unmounted component'
					<Collapse in={mostrarDatosAvanzados}>
						<div className="mx-0 pb-2">
							<DatosAvanzadosTanda idTanda={datosTanda.id} mostrando={mostrarDatosAvanzados} />
						</div>
					</Collapse>
				}

				{mostrarBotones && <>
					<div className="mt-3"></div>

					<div className="float-left">
						<BotonDetalles mostrandoDetalles={mostrarDatosAvanzados} onPulsado={setMostrarDatosAvanzados} />
					</div>
					<div className="float-right">
						<BotonDescargaPdf idTanda={datosTanda.id} />
						<Button size="sm" className="mx-sm-1" variant="primary" onClick={onEditarPulsado} >Editar</Button>
						<Button size="sm" className="mx-sm-1" variant="outline-danger" onClick={onBorrarPulsado} >Borrar</Button>
					</div>
				</>}
			</Card.Body>
		</Card>
	</Col>
}



const BotonDetalles = ({ mostrandoDetalles, onPulsado, ...props }) => {

	if (mostrandoDetalles)
		return <Button {...props} size="sm" className="mx-sm-1" variant="outline-dark" onClick={() => onPulsado(false)}>
			Ocultar detalles
		</Button>
	else
		return <Button {...props} size="sm" className="mx-sm-1" variant="outline-dark" onClick={() => onPulsado(true)}>
			Mostar detalles
		</Button>

}


const DatosAvanzadosTanda = ({ mostrando, idTanda }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/series/<idTanda>', jwt.token);

	useEffect(() => {
		if (!resultado.cargando && mostrando && !resultado.datos) {
			ejecutarConsulta({ method: 'GET', url: '/series/' + idTanda })
		}
	}, [mostrando, idTanda, resultado, ejecutarConsulta]);


	if (resultado.cargando) {
		return <Alert variant="info">
			<Spinner animation="grow" size="sm" variant="info" className="mr-2" />
				Cargando datos de la tanda
			</Alert>
	} else if (resultado.error) {
		return <Alert variant="danger">
			<h5>Error al obtener los datos de la tanda</h5>
			<code>{resultado.error.message}</code>
		</Alert>
	} else {
		let datos = resultado.datos;
		if (!datos) return null;

		let lote = datos.assig_materials[0]?.batch;
		let fechaCaducidad = datos.assig_materials[0]?.exp_date;

		return <>
			{/* SUMARIO */}
			<Row>
				<Col sm={12} md={4}>
					<Etiqueta texto="Id:" />
					<code className="ml-2 mr-1 text-dark">{datos.id}</code>
				</Col>
				<Col sm={12} md={4}>
					<Etiqueta texto="Estado:" />
					<BadgeInfoTanda texto={datos.status} className="ml-2 mr-1" extendido />
				</Col>
				<Col sm={12} md={4}>
					<Etiqueta texto="Tipo:" />
					<BadgeInfoTanda texto={datos.type} className="ml-2 mr-1" extendido />
				</Col>

			</Row>

			<SumarioTanda sumario={datos.summary} />

			{/* LOTE Y CADUCIDAD, SI EXISTEN */}
			{ (lote || fechaCaducidad) &&
				<Row>
					<Col sm={12} lg={4}>
						<Etiqueta texto="Lote:" />
						<span className="ml-2" >{lote}</span>
					</Col>

					<Col sm={12} lg={4}>
						<Etiqueta texto="Caducidad:" />
						<span className="ml-2">{fechaCaducidad}</span>
					</Col>

				</Row>
			}


			{/* BOTONES */}
			{datos.summary.reads_total > 0 && <Row className="mt-3 mb-3">
				<Col>
					<BotonDescargaDetalle idTanda={datos.id} />
				</Col>
			</Row>}

			{/* USUARIOS Y MATERIALES PERMITIDOS */}
			<Row className="mt-2">

				<Col sm={12} lg={4} className="mt-3 mt-lg-0">
					<Card>
						<Card.Header className="m-0 p-2 pl-3 font-weight-bold">Usuarios permitidos</Card.Header>
						<ListaUsuariosTanda usuarios={datos.assig_users} />
					</Card>
				</Col>

				<Col sm={12} lg={8} className="mt-2 mt-lg-0">
					<Card>
						<Card.Header className="m-0 p-2 pl-3 font-weight-bold">Materiales permitidos</Card.Header>
						<ListaMaterialesTanda materiales={datos.assig_materials} />
					</Card>
				</Col>

			</Row>

		</>
	}

}

const ListaMaterialesTanda = ({ materiales }) => {
	let componentes = materiales.map((material, i) => {
		const popover = (
			<Popover id="popover-basic">

				<Popover.Content>
					<Etiqueta texto="CN:" /> {material.cn}<br />
					<Etiqueta texto="Origen:" /> {material.name_origin}<br />
					<Etiqueta texto="España:" /> {material.name_spain}<br />
					{material.ean && <><Etiqueta texto="EAN:" /> {material.ean}<br /></>}
					<Etiqueta texto="Proveedor:" /> <img alt={material.id_country} src={`https://www.countryflags.io/` + material.id_country + `/flat/16.png`} className="pb-1" /> {material.name}<br />
				</Popover.Content>
			</Popover>
		);

		return <ListGroup.Item key={i} className="m-0 p-1 pt-2">
			<OverlayTrigger trigger={["hover", "focus"]} overlay={popover} placement="bottom-start">
				<Button size="sm" variant="link"><Icono icono={FaRegEye} posicion={[20, 6]} /></Button>
			</OverlayTrigger>
			<b>{material.ean ?? material.cn}</b> - {material.name_spain} {!material.gtin || <Badge variant="primary" className="font-weight-normal" >GTIN</Badge>}
		</ListGroup.Item>
	})

	return <ListGroup variant="flush" >
		{componentes}
	</ListGroup>

}

const ListaUsuariosTanda = ({ usuarios }) => {
	let componentes = usuarios.map((usuario, i) => {
		return <ListGroup.Item className="m-0 p-1 pl-3" key={i}>
			{usuario.name}
		</ListGroup.Item>
	})

	return <ListGroup variant="flush" >
		{componentes}
	</ListGroup>
}

const SumarioTanda = ({ sumario }) => {

	return <>
		<Row>
			<Col sm={12} lg={4}>

				<Etiqueta texto="Lecturas:" />
				<span className={`${sumario.reads_ok ? 'text-success' : 'text-muted'} ml-2`} >{sumario.reads_ok} correctas</span>,
			<span className={`${sumario.reads_error ? 'text-danger' : 'text-muted'} ml-1`}>{sumario.reads_error} en error</span>
			</Col>

			<Col sm={12} lg={4}>
				<Etiqueta texto="Inicio:" />
				<span className="ml-2">{sumario.start_at === ' ' ? <span className="text-muted">n/a</span> : sumario.start_at}</span>
			</Col>
			<Col sm={12} lg={4}>
				<Etiqueta texto="Fin:" />
				<span className="ml-2">{sumario.end_at === ' ' ? <span className="text-muted">n/a</span> : sumario.end_at}</span>
			</Col>
		</Row>


		<Row>
			{sumario.dates?.length > 0 ?

				<Col xs={12} xl={4}>
					<Etiqueta texto="Fechas:" />
					{
						sumario.dates.map((fecha, i) => {
							return <Badge variant="light" className="bg-light ml-2" key={i}>{fecha}</Badge>
						})
					}
				</Col> : <></>

			}
			{sumario.users?.length > 0 ?

				<Col xs={12} xl={8}>
					<Etiqueta texto="Usuarios:" />
					{
						sumario.users.map((usuario, i) => {
							return <Badge variant="light" className="bg-light ml-2" key={i}>{usuario.split(' - ')[1]}</Badge>
						})
					}
				</Col> : <></>

			}
		</Row>
	</>

}

const Etiqueta = ({ texto }) => {
	return <span className="ml-1 font-weight-bold">
		{texto}
	</span>
}



const BotonDescargaDetalle = ({ idTanda }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/series/reads/' + idTanda, jwt.token);

	const obtenerExcelLeturas = useCallback(() => {
		ejecutarConsulta({}, (error, res) => {
			if (error) {
				toast.error(<>
					<h5>
						Error al obtener las lecturas de la tanda
					</h5>
					{error.message}
				</>);
			}
		})
	}, [ejecutarConsulta])

	if (resultado.cargando) {
		return <Button size="sm" variant="primary" className="px-2" disabled>
			<Spinner size="sm" animation="border" className="mr-1" />
			Preparando fichero
		</Button>
	} else if (!resultado.ok) {

		return <Button size="sm" variant="primary" className="px-2" onClick={obtenerExcelLeturas} >
			<Icono icono={FaFileExcel} posicion={[18, 4]} className="mr-1" />
		Descargar detalle de lecturas
	</Button>
	} else {
		/*
		{
			"id_transmission": "daniel_gb1600649759333",
		    
			"delete": 0,
			"status": "Correcto",
			"name": "Daniel Garcia",
			"id_country": "ZW",
			"cif": "123456789E",
			"user": "daniel_gb"
		},
		*/
		return <>
			<ExcelFile filename={`lecturas-tanda-${idTanda}`} hideElement>
				<ExcelSheet data={resultado.datos.reads} name="Artículos" >
					<ExcelColumn label="USUARIO" value="user" />
					<ExcelColumn label="FECHA" value="date_time" />
					<ExcelColumn label="ESTADO" value="status" />
					<ExcelColumn label="EAN" value="ean" />
					<ExcelColumn label="CN" value="cn" />
					<ExcelColumn label="NOMBRE ORIGEN" value="name_origin" />
					<ExcelColumn label="NOMBRE NACIONAL" value="name_spain" />
					<ExcelColumn label="LOTE" value="batch_read" />
					<ExcelColumn label="CADUCIDAD" value="exp_read" />
					<ExcelColumn label="PROVEEDOR" value="prov_name" />
					<ExcelColumn label="CIF PROVEEDOR" value="prov_cif" />
					<ExcelColumn label="PAIS" value="prov_country" />
				</ExcelSheet>
			</ExcelFile>
			<Button size="sm" variant="primary" className="px-2" onClick={obtenerExcelLeturas} >
				<Icono icono={FaFileExcel} posicion={[18, 4]} className="mr-1" />
				Descargar detalle de lecturas
			</Button>
		</>
	}
}

const BotonDescargaPdf = ({ idTanda }) => {

	const { jwt } = useContext(ContextoAplicacion);
	const { resultado, ejecutarConsulta } = useApiCall('/report/i1/' + idTanda, jwt.token);

	const obtenerInformePDF = useCallback(() => {
		if (resultado?.datos?.pdf) {
			let buffer = Buffer.from(resultado.datos.pdf, 'base64');
			fileDownload(buffer, idTanda + '.pdf');
			toast.success(<h5>Informe generado con éxito</h5>);
			return;
		}

		ejecutarConsulta({}, (error, res) => {
			if (error) {
				toast.error(<>
					<h5>
						Error al generar el informe
					</h5>
					{error.message}
				</>);
				return;
			}
			let buffer = Buffer.from(res.pdf, 'base64');
			fileDownload(buffer, idTanda + '.pdf');
			toast.success(<h5>Informe generado con éxito</h5>);
			return;
		})
	}, [ejecutarConsulta, idTanda, resultado.datos])

	if (resultado.cargando) {
		return <Button size="sm" variant="outline-primary" className="px-sm-2" disabled>
			<Spinner size="sm" animation="border" className="mr-1" />
			Preparando informe
		</Button>
	} else {
		return <Button size="sm" variant="outline-primary" className="px-sm-2" onClick={obtenerInformePDF} >
			<Icono icono={FaRegFilePdf} posicion={[18, 2]} className="mr-1" />
			Generar informe
		</Button>
	}
}

export default CardTanda;