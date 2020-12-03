import K from 'K';
import React from 'react';


const BanderaPais = ({codigoPais, nombrePais, incluirNombre, className}) => {
	if (codigoPais === K.EMA.CODIGO) {
		codigoPais = K.EMA.CODIGO_BANDERA
		nombrePais = K.EMA.NOMBRE_LARGO
	}
	let imagen = <img alt={nombrePais ?? codigoPais} src={`https://www.countryflags.io/` + codigoPais + `/flat/24.png`} className={className} />

	if (incluirNombre) 	return <>{imagen} {nombrePais}</>;
	return imagen;

}

export default BanderaPais;