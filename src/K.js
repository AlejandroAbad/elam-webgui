
const PRODUCCION = process.env.REACT_APP_PRODUCCION === "true" ? true : false;
const BASE_URL = process.env.REACT_APP_BASEURL


const K = {
    PRODUCCION: PRODUCCION,
    DESTINOS: {
        CORE: BASE_URL
    },
    AVISO_JWT_PROXIMO_A_CADUCAR: 5*60, //
    INVALIDAR_JWT_EN: 60,
    ROLES: {
        ADMINISTRADOR: 'AD',
        DIRECTOR: 'DT',
        CALIDAD: 'QA',
        ALMACEN: 'WM'
    },
    EMA: {
        CODIGO: "00",
        CODIGO_BANDERA: "EU",
        NOMBRE: "EMA",
        NOMBRE_LARGO: "EMA - European Medicines Agency"
    }
}

export default K