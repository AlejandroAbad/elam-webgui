import K from 'K';

import React, { useContext } from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import 'App.scss';


import ReactJson from 'react-json-view';

import BootstrapMedia from 'componentes/debug/bootstrapMedia/BootstrapMedia';
import BarraNavegacionSuperior from 'componentes/barraNavegacionSuperior/BarraNavegacionSuperior';
import FormularioLogin from 'componentes/formularioLogin/FormularioLogin';
import ContenedorDeTostadas from 'componentes/tostadas/ContenedorDeTostadas';
import TostadaExpiracionJwt from 'componentes/tostadas/TostadaExpiracionJwt';


import Pantallas from 'pantallas/Pantallas';


import { ContextoAplicacion } from 'contexto';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {

	const { jwt } = useContext(ContextoAplicacion);

	// Almacena el JWT del usuario logeado
	//const [jwt, setJwt] = useStateLocalStorage('login.jwt', null, true);

	let content = null;

	// Si cuando el usuario entra no hay token o lo hay pero esta caducado o proximo a caducar
	// mostramos login para refrescar el token
	if (!jwt || TostadaExpiracionJwt.calculaJwtTTL(jwt) < K.INVALIDAR_JWT_EN) {
		content = (<FormularioLogin />);
	} else {
		content = (
			<Switch>

				<Route path="/usuario">
					<h3>Tu JWT</h3>
					<ReactJson src={jwt || {}} />
				</Route>

				<Route path="/maestro/proveedores" render={(props) => <Pantallas.MaestroProveedores {...props} />} />
				<Route path="/maestro/materiales" render={(props) => <Pantallas.MaestroMateriales {...props} />} />
				<Route path="/maestro/usuarios" render={(props) => <Pantallas.MaestroUsuarios {...props} />} />


				<Route path="/tandas" render={(props) => <Pantallas.Tandas {...props} />} />

				<Route path="/" render={(props) => <Pantallas.Bienvenida {...props} />} />

		
			</Switch>
		);
		
	}



	return (
		<Router>
			<BootstrapMedia />
			<BarraNavegacionSuperior />

			<div className="App">
				{content}
			</div>

			<ContenedorDeTostadas>
				<TostadaExpiracionJwt />
			</ContenedorDeTostadas>

			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>

		</Router>
	);

	
}






export default App;
