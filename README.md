## Horas

9sep - 1'5h
9sep - 0'5h
10sep - 1h
11sep - 3h
11sep - 2h
12sep - 2h
13sep - 3h
26 septiembre - 4 horas
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


27 septiembre - 2 horas
- Añadido filtro de tandas


28 septiembre - 2 horas
- En detalle tandas ya no es necesario el campo "reads", ahora de verdad.
- Actualizado Excel con los campos del proveedor, etc ...
- En la lista de usuarios ahora aparece el nombre completo del perfil y parece algo mas bonica
- Dashboard hecho. Cuando le pinchas en un cuadro de info de tanda, te lleva a la lista y te filtra automaticamente por el tipo que hayas seleccionado.
- Revisadas vistas en el móvil

PENDIENTE:
- Hay una cosa que me molaría y es que el pdf se cargue en una ventana nueva 