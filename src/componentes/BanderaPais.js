import React from 'react';


const BanderaPais = ({codigoPais, nombrePais, className}) => {
	return <img alt={nombrePais ?? ""} src={`https://www.countryflags.io/` + codigoPais + `/flat/24.png`} className={className} />
}

export default BanderaPais;