import React, { useRef, useContext } from 'react';
import { Col, Button, InputGroup, FormControl, Form, Alert, Spinner } from 'react-bootstrap';
import { GoPerson, GoKey, GoSignIn } from 'react-icons/go';
import { useApiCall } from 'hooks/useApiCall';
import ReactJson from 'react-json-view';

import { ContextoAplicacion } from 'contexto';

const FormularioLogin = () => {

    const { setJwt } = useContext(ContextoAplicacion);
    const refUsuario = useRef();
    const refClave = useRef();

    const { resultado, ejecutarConsulta } = useApiCall('/login', null, false);

    const solicitaToken = () => {
        let solicitudToken = {
            user: refUsuario.current.value,
            pass: refClave.current.value
        };

        ejecutarConsulta({ method: 'POST', body: solicitudToken }, (error, respuesta) => {
            if (!error)
                setJwt(respuesta);
        });
    }


    return (
        <Col md={11} lg={8} className="shadow m-auto py-5 p-sm-4 p-md-5 my-md-5">
            
            <h3 className="mb-3">Identifíquese</h3>
            <hr className="d-none d-md-block" />

            <Form>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="input-username"><GoPerson /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl autoComplete="username" placeholder="Usuario" aria-label="Usuario" aria-describedby="input-username" ref={refUsuario} />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="input-password"><GoKey /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl autoComplete="current-password" type="password" placeholder="Contraseña" aria-label="Contraseña" aria-describedby="input-password" ref={refClave} />
                </InputGroup>

            </Form>


            <div className="m-auto mt-2 text-center">
                { resultado.cargando ? 
                    <Button variant="link" size="lg" onClick={solicitaToken} disabled>
                        <Spinner animation="border" variant="primary" />
                    </Button>
                    :
                    <Button variant="outline-primary" size="lg" onClick={solicitaToken}>
                        <GoSignIn /> Acceder
                    </Button>
                }   
            </div>

            <ReactJson src={resultado} />
        </Col>
        
    );
}


const AlertasLogin = (props) => {
    if (!props.errores || props.errores.length === 0) return null;

    let alertas = [];
    props.errores.forEach((error, index) => {
        if (error.codigo && error.descripcion) {
            alertas.push(<li key={index}>{error.descripcion} <small className="text-muted">{error.codigo}</small></li>);
        } else {
            console.log()
            alertas.push(<li key={index}>No se pudo alcanzar el servidor de autenticación</li>);
        }
    })

    return (
        <Alert variant='danger'>
            <Alert.Heading>Fallo al autenticar</Alert.Heading>
            <ul>
                {alertas}
            </ul>
        </Alert>
    )
}


export default FormularioLogin;