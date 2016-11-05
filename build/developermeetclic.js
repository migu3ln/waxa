/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Este metodo oculta y muestra un elemento
 * @param {type} $params
 * $params.object_gestion=$("elemento") elemente a ocultar u mostrar
 * $params.view_object=true o false true=muestra elemento
 * 
 * @returns {undefined}
 */
function viewInformacion($params) {
    var $object_gestion = $params.object_gestion;
    var $duration = $params.duration ? $params.duration : 700;
    var $view_object = $params.view_object;
    if ($view_object) {

        $object_gestion.show($duration);
    } else {
        $object_gestion.hide($duration);

    }
}