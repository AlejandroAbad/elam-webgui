# ELAM - WEBGUI
Interfaz web para gestión de aplicación de lecturas ELAM. Hecha en *React*.

---

## SCRIPTS

### `npm start`

Inicia la app en modo desarrollo.
Abrirá el navegador en la web [http://localhost:3000](http://localhost:3000) para mostrar el desarrollo.

La página se recarga si e modifica el código fuente.


### `npm run build`

Compila la aplicación para usarse en un servidor real de producción.
La aplicación se generará en el directorio `build-prod` utilizando el entorno definido en el fichero `.env.production`.


### `npm run build-dev`

Compila la aplicación para usarse en un servidor de desarrollo.
La aplicación se generará en el directorio `build-dev` utilizando el entorno definido en el fichero `.env`.


## CHANGELOG
**18 octubre** v1.4-beta2
- Ahora los materiales tienen el campo GTIN (activo/inactivo)
    - Las cards muestran el estado del GTIN del material
    - Es posible elegir el GTIN al crear el material
    - Es posible modificar el GTIN del material

- Los checks de activación de materiales y productos ahora usan el nuevo componente switch

- Ahora las tandas controlan LOTE y la CADUCIDAD:
    - Al crear/editar tandas, se pide estos dato si el producto seleccionado NO es GTIN
    - Se muestran los valores en las Cards de tandas


**17 octubre** v1.4-beta1
- Control de materiales y proveedores ACTIVADOS/DESACTIVADOS:
    - Ahora las tarjetas muestran el estado activo del material/proveedor.
    - Los DTs pueden activar/desactivar materiales y proveedores en los modales de creación y edición.
    - Los QAs no pueden activar/desactivar materiales y proveedores. Los que crean nuevos estarán desactivados.

- Ahora el rol de usuarios de almacén no tiene acceso a la aplicación web.
- Eliminados botones no usados en la barra de navegación superior en la pantalla de login.

- Añadidos campos LOTE y CADUCIDAD al Excel de detalle de lecturas de tanda.
- Ahora el selector de materiales de tanda solo permite elegir un único material.
- Ahora el selector de materiales de tanda solo muestra los materiales activos o el material actualmente puesto en la tanda.


**26 septiembre** v1.3-beta
- Bug solucionado: Al editar una tanda con materiales eliminados, lanzo un error (y todo ok), pero si luego pincho en editar en otra tanda el error no se ha borrado

- Implementadas descargas de Excel y PDF de las tandas (la de PDF alguna peta porque me devuelves un casque chungo al generar el PDF)
    - En detalle tandas ya no es necesario el campo "reads"
    - En el futuro se puede ver opciones avanzadas de la librería de Excel para hacer el fichero mas bonito y añadir los datos de cabecera de la tanda (esto último alomejor se tiene que hacer en una hoja aparte). Por lo pronto cumple.

- Cosicas en el detalle lecturas:
    - En el campo "id" viene el id del país "ZW" ! (me da igual porque no pinto los IDs en el Excel, considero que no les valen para nada)
    - Si puedes incluye el nombre del proveedor en la respuesta para que lo muestre tambien en el Excel
    - El campo "deleted" se refiere a si el material ha sido borrado ?? 

- Implementada toda la movida de los usuarios. Algunos apuntes:
    - En la lista de usuarios, ¿puedes mandar el texto de descripción del perfil del usuario (DT=Director Técnico, etc ...)?
    - Al crear usuario, el "id_profile" entiendo se manda como "DT", "QA" tal y como está en el ejemplo  -> No tiene entonces sentido que en la lista de perfiles haya un campo "id" numerico.
    - PD. Haciendo pruebas, he podido crear un usuario con perfil "1" y se lo ha tragado. Esto no pasará ya que en el frontend lo controlo, pero que lo sepas.

- En la lista de perfiles, se ha colado una 'l' al final del campo 'name'. Si lo quieres cambiar avisa y lo cambio yo también (no te preocupes que el frontend no va a petar)
- Ya funciona la búsqueda de texto en los 3 maestros (no en las tandas)
    - La búsqueda es contra todos los textos mostrados (menos el ID), e ignora mayus y minus.
    - Si escribes 3 o mas letras, te busca automaticamente.
    - Si pulsas en el botón (o la tecla enter), te aplica el filtro aunque sea de menos de 3 letras.

**27 septiembre** v1.1-beta
- Añadido filtro de tandas


**28 septiembre** v1.0-beta
- En detalle tandas ya no es necesario el campo "reads", ahora de verdad.
- Actualizado Excel con los campos del proveedor, etc ...
- En la lista de usuarios ahora aparece el nombre completo del perfil y parece algo mas bonica
- Dashboard hecho. Cuando le pinchas en un cuadro de info de tanda, te lleva a la lista y te filtra automaticamente por el tipo que hayas seleccionado.
- Revisadas vistas en el móvil



## Horas

- 9sep - 2h
- 10sep - 1h
- 11sep - 5h
- 12sep - 2h
- 13sep - 3h
- 26sep - 4h
- 17oct - 2h
- 18oct - 2h
- *TOTAL - 22h* 
