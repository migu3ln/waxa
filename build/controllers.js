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
})
        .controller('AppCtrl', function ($scope, $interval, CalendarEvent, $http, uiGridConstants, $modal) {
            $scope.perrin = "sad";
            // Live Stats Tab
            $scope.init_value = function () {
                console.log($scope.title_dashboard);
                console.log($scope.data_row_info);
            }
            $scope.title_dashboard = "alex";
            $scope.data_row_info = {};
//-------------GESTION INIT------
            $scope.entity = {};
            $scope.change_info = function (grid, row) {
                $scope.data_row_info = angular.copy(row.entity);
                id_pedido = $scope.data_row_info.id;
                $scope.title_dashboard = "Hola q mas alex";
                $scope.getDataDetalle(id_pedido);
            }
            $scope.world = function (row) {
                return 'world';
            };
//   -------NEW----
            var data = [];
            $scope.gridOptions = {
//        ----view informacion init
                enableSorting: true,
                enableFiltering: true,
                showTreeExpandNoChildren: true,
//        ----view informacion end---
                showGridFooter: true,
                showColumnFooter: true,
                columnDefs: [
                    {field: 'id', name: '',
//                        cellTemplate: 'edit-button.html',
                        cellTemplate: '<div class="ui-grid-cell-contents" >  <button type="button" class="btn btn-xs btn-primary" ng-click="grid.appScope.change_info(grid,row)" ><i class="fa fa-edit"></i></button></div>',
                        width: 34},
                    {field: 'fecha_pedido', width: '10%'},
                    {field: 'nombres',
                        filter: {
                            placeholder: 'Busqueda',
                            ariaLabel: 'I have a custom aria label for this field.'
                        },
                        width: '25%'},
                    {field: 'pais', width: '10%'},
                    {field: 'ciudad', width: '10%'},
                    {field: 'codigo_postal', width: '10%'},
                    {field: 'direccion_total', width: '25%'},
                    {field: 'telefono', width: '10%'},
                    {field: 'estado', filter: {
                            type: uiGridConstants.filter.SELECT,
                            selectOptions: [
                                {value: '1', label: 'Activo'},
                                {value: '2', label: 'Inactivo'},
                            ],
                        }, width: '10%'},
                    {field: 'total_pedido', aggregationType: uiGridConstants.aggregationTypes.sum, width: '13%'},
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

//            console.log( gridApi.selection.on);
                    }
//              gridApi.selection.on.rowSelectionChanged($scope, function (row) {
//                  console.log("ros",row);
////                    $state.go("contact.details.view", {contactId: row.entity.contactId});
//                });
//            $scope.gridApi.treeBase.on.rowExpanded($scope, function (row) {
//                if (row.entity.$$hashKey === $scope.gridOptions.data[50].$$hashKey && !$scope.nodeLoaded) {
//                    $interval(function () {
//                        $scope.gridOptions.data.splice(51, 0,
//                                {name: 'Dynamic 1', gender: 'female', age: 53, company: 'Griddable grids', balance: 38000, $$treeLevel: 1},
//                                {name: 'Dynamic 2', gender: 'male', age: 18, company: 'Griddable grids', balance: 29000, $$treeLevel: 1}
//                        );
//                        $scope.nodeLoaded = true;
//                    }, 2000, 1);
//                }
//            });
                },
                data: data,
            };
            $scope.getDataDetalle = function (id_pedido) {
                var array_ready = [];

                angular.forEach($scope.detalle_data, function (value, key) {
                    console.log(key, value.id_pedido, id_pedido);
                    if (id_pedido == value.id_pedido) {
                        array_ready.push(value);

                    }

                });
              $scope.detalle_data_pedido=array_ready;
            };
            $scope.detalle_data = {};
            $scope.detalle_data_pedido = {}
            $http.get('http://eparqin.com/json/detallejson.php')
                    .success(function (data) {
                        $scope.detalle_data = data;
                    });
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
                                direccion_total: "Direccion Principal:" + value.direccion1 + " Direccion Secundaria:" + value.direccion2,
                                fecha_pedido: value.fecha_pedido,
                                estado: value.estado,
                                telefono: value.telefono,
                                total_pedido: value.total_pedido,
                            };
//                    for (i = 0; i < data.length; i++) {
//                        data[i].subGridOptions = {
//                            columnDefs: [{name: "Id", field: "id"}, {name: "Name", field: "name"}],
//                            data: data[i].friends
//                        }
//                    }
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
//                array_ready[0].$$treeLevel = 0;
//                array_ready[1].$$treeLevel = 1;
                        $scope.gridOptions.data = array_ready;
                    });
        });
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