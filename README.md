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


## PENDIENTE
- Hay una cosa que molaría y es que el pdf se cargue en una ventana nueva 
- Control de entrada en los formularios para evitar campos vacíos
- Hacer que el selector de fecha de caducidad sea un componente de calendario


## CHANGELOG
**20 octubre** v1.4-beta5
- Bug solucionado: Error al crear tandas sin usuarios


**20 octubre** v1.4-beta4
- Cambiado como se muestran los materiales/proveedores inactivos
- Optimizados los selectores de usuarios y materiales para que no tengan que consultar los datos extendidos de la tanda. En su lugar, es el propio modal quien los consulta una única vez. En realidad, este cambio era necesario para que los datos de LOTE y CADUCIDAD estén disponibles al formulario de edición.
- Ahora los inputs de lote y caducidad en el modal de edición de tanda muestran un mensaje de cargando mientras los datos de la tanda a editar no están disponibles.
- Ahora el selector de fechas de caducidad es un componente DatePicker
- La lista de materiales permitidos muestra el GTIN del material


**19 octubre** v1.4-beta3
- El filtro por estado de tanda, ahora muestra un boton de "Seleccionar todo"
- Al crear/editar tandas, el selector de materiales indica si el material es o no GTIN
- Al editar una tanda que tiene asignado un material inactivo o eliminado, aparece marcado como INACTIVO. 


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
- 19oct - 1h
- 20oct - 3h
- *TOTAL - 25h* 
