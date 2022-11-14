odoo.define('website.accorderie_aide', function (require) {
    "use strict";

    require('bus.BusService');
    let ajax = require('web.ajax');
    let core = require('web.core');
    let session = require('web.session');
    let Widget = require('web.Widget');
    let QWeb = core.qweb;

    // Get existing module
    let app = angular.module('AccorderieApp');

    app.controller('AideController', ['$scope', '$location', '$sce', function ($scope, $location, $sce) {
        $scope._ = _;
        $scope.section = "";
        $scope.error = "";
        $scope.guide_user_show = "item" // or "table"
        $scope.guide_user_show_is_concat = "concat" // or "normal"

        // constant
        $scope.default_section = "guide_utilisation";

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        $scope.$on('$locationChangeSuccess', function (object, newLocation, previousLocation) {
            let section = $location.search()["section"];
            if (!_.isEmpty(section)) {
                $scope.section = section;
            } else {
                $scope.section = $scope.default_section;
            }
        });

        $scope.sizeStateValidated = function (state) {
            let size = 0;
            if (!_.isUndefined(state)) {
                size = state.filter(state => state.validate_bug === "<i class=\"fa fa-check\" style=\"color:#00FF00\"></i>").length;
            }
            return size;
        }

        $scope.sizeGuideEchangeService = function (data, state) {
            let size = 0;
            if (!_.isUndefined(state) && !_.isEmpty(data.state_section)) {
                size = state.filter(state => state.section === Object.keys(data.state_section)[0]).length;
            }
            return size;
        }

        $scope.sizeGuideImplemented = function (state) {
            let size = 0;
            if (!_.isUndefined(state)) {
                size = state.filter(state => !state.not_implemented).length;
            }
            return size;
        }

        $scope.getIconCaract = function (state, dctIcon) {
            let item = [];
            for (const [key, value] of Object.entries(dctIcon)) {
                if ("lst_caract" in state && state.lst_caract.includes(key)) {
                    item.push(value);
                }
            }
            // if (!item.length) {
            //     item.push("fa-dash");
            // }

            return item;
        }

        let url = "/accorderie_canada_ddb/get_help_data/";
        ajax.rpc(url, {}).then(function (data) {
            console.debug("AJAX receive get_help_data");
            if (data.error) {
                $scope.error = data.error;
            } else if (_.isEmpty(data)) {
                $scope.error = "Empty data - " + url;
            } else {
                // Init controller or call change_state_name(name)
                $scope.error = "";
                $scope.data = data.data;
                console.debug(data.data);
            }

            // Process all the angularjs watchers
            $scope.$digest();
        })

    }])

    let AccorderieAide = Widget.extend({
        start: function () {
        },
    });

    return {
        AccorderieAide: AccorderieAide,
    };

});
