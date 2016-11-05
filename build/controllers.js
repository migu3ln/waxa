/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('app.controllers', []).constant('PersonSchema', {
    type: 'object',
    properties: {
        name: {type: 'string', title: 'Name'},
        company: {type: 'string', title: 'Company'},
        phone: {type: 'string', title: 'Phone'},
        'address.city': {type: 'string', title: 'City'}
    }
}).controller('AppCtrl', function ($scope, $interval, CalendarEvent, $http, uiGridConstants, $modal) {
    $scope.title_gestion = "Administracion";
    $scope.title_proceso = "Pedidos";
    $scope.CurrentDate = new Date();
    $scope.hideGridParent = false;
    $scope.hideGridChildren = true;
    $scope.data_row_info = {};
//-------------GESTION INIT------
    $scope.entity = {};
    $scope.change_info = function (grid, row) {
        $scope.data_row_info = angular.copy(row.entity);
        id_pedido = $scope.data_row_info.id;
        $scope.title_gestion = "Detalle";
        $scope.title_proceso = "Pedidos";
        $scope.getDataDetalle(id_pedido);
        $scope.hideGridParent = true;
        $scope.hideGridChildren = false;
    }
    $scope.return_admin = function () {
        $scope.title_gestion = "Administracion";
        $scope.title_proceso = "Pedidos";
        $scope.getDataDetalle(id_pedido);
        $scope.hideGridParent = false;
        $scope.hideGridChildren = true;
    }
//---editar---
    $scope.storeFile = function (gridRow, gridCol, files) {
        // ignore all but the first file, it can only select one anyway
        // set the filename into this column
        gridRow.entity.filename = files[0].name;

        // read the file and set it into a hidden column, which we may do stuff with later
        var setFile = function (fileContent) {
            gridRow.entity.file = fileContent.currentTarget.result;
            // put it on scope so we can display it - you'd probably do something else with it
            $scope.lastFile = fileContent.currentTarget.result;
            $scope.$apply();
        };
        var reader = new FileReader();
        reader.onload = setFile;
        reader.readAsText(files[0]);
    };
//   -------PEDIDOS PARENT----
    var data = [];
    $scope.changeInfo = function (data, grid, row) {
        console.log(data, grid, row.entity);
    }
    var cont = 0;
    $scope.multipleSelect = {};
    $scope.data_key = function (data, info) {
        console.log(info);
        data = info;
        cont++;
        var multipleSelect = [];
        multipleSelect.push({id: cont, info: info})
        return multipleSelect;

    }
    $scope.gridOptions = {
//        ----view informacion init
        enableSorting: true,
        enableFiltering: true,
        showTreeExpandNoChildren: true,
//        ----view informacion end---
//        showGridFooter: true,
        showColumnFooter: true,
        columnDefs: [
            {
                field: 'id',
                name: "",
                cellTemplate: '<div class="ui-grid-cell-contents" >  <button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.change_info(grid,row)" ><i class="fa fa-eye"></i></button></div>',
                width: 34,
                enableFiltering: false,
            },
            {
                field: 'fecha_pedido',
                width: '15%',
                enableFiltering: false
            },
            {
                field: 'nombres',
                filter: {
                    placeholder: 'Ingrese la informacion a buscar.',
                    ariaLabel: 'I have a custom aria label for this field.'
                },
                width: '25%'
            },
            {field: 'origen', width: '25%'},
            {
                field: 'direccion',
                width: '25%'
            },
            {
                field: 'telefono',
                width: '10%',
                enableFiltering: false,
            },
            {
                field: 'total_pedido',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                enableFiltering: false,
                footerCellFilter: 'number:2',
                width: '13%'
            },
            {
                field: 'estado',
                cellFilter: 'mapStatus',
                cellTemplate: '<div class="ui-grid-cell-contents" >  <select   ng-change="grid.appScope.changeInfo(multipleSelect,grid,row)" ng-model="multipleSelect" ><option value="1">Activo</option><option value="2">Inactivo</option> <option value="3">Rechazado</option></select></div>',
                enableCellEdit: true,
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        {value: '1', label: 'Activo'},
                        {value: '2', label: 'Inactivo'},
                        {value: '3', label: 'Rechazado'},
                    ],
                },
                width: '10%'
            },
        ],
//        *----menu exportar--
//        enableGridMenu: true,
//        enableSelectAll: true,
//        exporterCsvFilename: 'myFile.csv',
////        exporterPdfDefaultStyle: {fontSize: 9},
//        exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
//        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
//        exporterPdfHeader: {text: "My Header", style: 'headerStyle'},
//        exporterPdfFooter: function (currentPage, pageCount) {
//            return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
//        },
//        exporterPdfCustomFormatter: function (docDefinition) {
//            docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
//            docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
//            return docDefinition;
//        },
//        exporterPdfOrientation: 'portrait',
//        exporterPdfPageSize: 'LETTER',
//        exporterPdfMaxGridWidth: 500,
//        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
//            this.gridApi = gridApi;
//            if (gridApi) {
//
//            }
//            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
//                $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
//                $scope.$apply();
//            });

        },
        data: data,
    };

    $http.get('http://eparqin.com/json/ordenesjson.php')
            .success(function (data) {
                var array_ready = [];
                angular.forEach(data, function (value, key) {
                    var row_object = {
                        id: value.id_pedido,
                        nombres: value.nombre + " " + value.apellido,
                        pais: value.pais,
                        ciudad: value.ciudad,
                        codigo_postal: value.codigo_postal,
                        origen: "Pais:" + value.pais + " Ciudad:" + value.ciudad + " Codigo Postal:" + value.codigo_postal,
                        direccion: "Direccion Principal:" + value.direccion1 + " Direccion Secundaria:" + value.direccion2,
                        fecha_pedido: value.fecha_pedido,
                        telefono: value.telefono,
                        total_pedido: value.total_pedido,
                        estado: 2,
                    };
                    array_ready.push(row_object);
                });
                for (var i = 0; i < data.length; i++) {
                    data[i].subGridOptions = {
                        columnDefs: [{name: "Id", field: "id"}, {name: "Name", field: "name"}],
                        data: [
                            {id: 1, name: "alex"}, {id: 5, name: "adad"

                            }
                        ]
                    }
                }
                $scope.gridOptions.data = array_ready;
            });

//------------CHILDREN DATA----

    $scope.detalle_data = {};
    $scope.detalle_data_pedido = {}
    $scope.items_productos = [];
    $scope.items_products_exist = function (key_item_producto) {
        var exist = false;
        angular.forEach($scope.items_productos, function (value, key) {
            if (value.id == key_item_producto) {
                exist = true;
            }
        });
        return exist;
    }
    $http.get('http://eparqin.com/json/detallejson.php')
            .success(function (data) {
                var array_ready = [];
                angular.forEach(data, function (value, key) {
                    id_producto = value.id_producto;
                    $nombre_item = value.nombre_item;
                    var subtotal = parseFloat(value.subtotal).toFixed(2);
                    var subtotal_iva = parseFloat(value.subtotal_iva).toFixed(2);
                    var row_object = {
                        id_item: value.id_item,
                        id_pedido: value.id_pedido,
                        nombre_item: $nombre_item,
                        id_producto: id_producto,
                        cantidad: value.cantidad,
                        subtotal: subtotal,
                        subtotal_iva: subtotal_iva,
                    };

                    if (!$scope.items_products_exist(id_producto)) {///agregar solo productos q no esten 
                        var row_object_items = {id: id_producto, name: $nombre_item};
                        $scope.items_productos.push(row_object_items);
                    }
                    array_ready.push(row_object);
                });

                $scope.detalle_data = array_ready;
            });
    //    ---DATA DETALLE ALL---
    $scope.getDataDetalle = function (id_pedido) {
        var array_ready = [];
        angular.forEach($scope.detalle_data, function (value, key) {
            if (id_pedido == value.id_pedido) {
                array_ready.push(value);
            }
        });
        $scope.gridOptionsDetalle.data = array_ready;
    };
    var data_pedido_detalle = [];
    $scope.gridOptionsDetalle = {
//        ----view informacion init
        enableSorting: true,
        enableFiltering: true,
        showTreeExpandNoChildren: true,
//        ----view informacion end---
        showGridFooter: true,
        showColumnFooter: true,
        columnDefs: [
            {
                field: 'id_item',
                name: "",
                width: 34,
                enableFiltering: false,
            },
            {
                field: 'nombre_item',
                name: 'Detalle Producto',
                width: '55%',
            },
            {
                field: 'cantidad',
                name: 'Cant.',
                width: '10%',
            },
            {
                field: 'subtotal',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                enableFiltering: false,
                footerCellFilter: 'number:2',
                width: '15%'
            },
            {
                field: 'subtotal_iva',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                enableFiltering: false,
                footerCellFilter: 'number:2',
                width: '15%'
            },
        ],
//        *----menu exportar--
//        enableGridMenu: true,
//        enableSelectAll: true,
//        exporterCsvFilename: 'myFile.csv',
////        exporterPdfDefaultStyle: {fontSize: 9},
//        exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
//        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
//        exporterPdfHeader: {text: "My Header", style: 'headerStyle'},
//        exporterPdfFooter: function (currentPage, pageCount) {
//            return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
//        },
//        exporterPdfCustomFormatter: function (docDefinition) {
//            docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
//            docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
//            return docDefinition;
//        },
//        exporterPdfOrientation: 'portrait',
//        exporterPdfPageSize: 'LETTER',
//        exporterPdfMaxGridWidth: 500,
//        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            this.gridApi = gridApi;
            if (gridApi) {

            }

        },
        data: data_pedido_detalle,
    };


}).filter('mapStatus', function () {
    var genderHash = {
        1: 'Activo',
        2: 'Inactivo',
        3: 'Rechazado'
    };
    return function (input) {
        if (!input) {
            return '';
        } else {
            return genderHash[input];
        }
    };
})
        ;
RowEditor.$inject = ['$rootScope', '$modal'];
function RowEditor($rootScope, $modal) {
    var service = {};
    service.editRow = editRow;
    function editRow(grid, row) {
        $modal.open({
            templateUrl: 'edit-modal.html',
            controller: ['$modalInstance', 'PersonSchema', 'grid', 'row', RowEditCtrl],
            controllerAs: 'vm',
            resolve: {
                grid: function () {
                    return grid;
                },
                row: function () {
                    return row;
                }
            }
        });
    }

    return service;
}

function RowEditCtrl($modalInstance, PersonSchema, grid, row) {
    var vm = this;
    vm.schema = PersonSchema;
    vm.entity = angular.copy(row.entity);
    vm.form = [
        'name',
        'company',
        'phone',
        {
            'key': 'address.city',
            'title': 'City'
        },
    ];
    vm.save = save;
    function save() {
        // Copy row values over
        row.entity = angular.extend(row.entity, vm.entity);
        $modalInstance.close(row.entity);
    }
}
