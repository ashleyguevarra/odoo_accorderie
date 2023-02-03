odoo.define('website.accorderie_notification', function (require) {
    "use strict";

    require('web.dom_ready');
    require('bus.BusService');
    let ajax = require('web.ajax');
    let core = require('web.core');
    let session = require('web.session');
    let Widget = require('web.Widget');
    let QWeb = core.qweb;

    // Get existing module
    let app = angular.module('AccorderieApp');

    app.controller('NotificationController', ['$scope', '$location', function ($scope, $location) {
        // NotificationController to manage page notification (message and notification)
        $scope._ = _;
        // Section 'message' or 'notification'
        $scope.error = "";
        $scope.section = "";

        // constant
        $scope.default_section = "notification";

        $scope.$on('$locationChangeSuccess', function (object, newLocation, previousLocation) {
            if (window.location.pathname !== "/notification") {
                return;
            }
            $scope.error = "";

            let section = $location.search()["section"];
            if (!_.isEmpty(section)) {
                $scope.section = section;
            } else {
                $scope.section = $scope.default_section;
            }
        });
    }])

    let AccorderieNotification = Widget.extend({
        // properties
        _audio: null,

        init: function (parent) {
            this._super(parent);
        },
        willStart: function () {
            return this._loadQWebTemplate();
        },
        start: function () {
            // TODO channel name devrait être un hash unique par membre
            this.call('bus_service', 'addChannel', "accorderie.notification.favorite");
            this.call('bus_service', 'addChannel', "accorderie.notification.echange");
            // TODO a bug can occur if the scope not exist or dbname is not sync fast, block in willStart with angular watch
            // this._canal_membre_update = JSON.stringify([this._global_scope.global.dbname, "accorderie.membre", this._global_scope.personal.id]);
            // console.warn(this._canal_membre_update);
            // this.call('bus_service', 'addChannel', this._canal_membre_update);
            this.call('bus_service', 'startPolling');
            this.call('bus_service', 'onNotification', this, this._onNotification);
            return this._super();
        },
        /**
         * @private
         */
        _loadQWebTemplate: function () {
            let xml_files = [];
            // This is not useful, only need to return an empty apply
            let defs = _.map(xml_files, function (tmpl) {
                return session.rpc('/web/proxy/load', {path: tmpl}).then(function (xml) {
                    QWeb.add_template(xml);
                });
            });
            return $.when.apply($, defs);
        },
        /**
         * Lazily play the 'beep' audio on sent notification
         *
         * @private
         */
        _beep: function () {
            if (typeof (Audio) !== "undefined") {
                if (!this._audio) {
                    this._audio = new Audio();
                    let ext = this._audio.canPlayType("audio/ogg; codecs=vorbis") ? ".ogg" : ".mp3";
                    let session = this.getSession();
                    this._audio.src = session.url("/mail/static/src/audio/ting" + ext);
                }
                this._audio.play();
                console.debug("beep");
            }
        },
        /**
         * @private
         * @param {Array[]} notifications
         */
        _onNotification: function (notifications) {
            let has_beep = false;
            let has_update = false;
            let $scope = angular.element($("[ng-app]")).scope();
            // Recreate it solves a strange bug
            let canal_membre_update = JSON.stringify([$scope.global.dbname, "accorderie.membre", $scope.personal.id]);
            let canal_offre_service_update = JSON.stringify([$scope.global.dbname, "accorderie.offre.service", $scope.personal.id]);
            let canal_demande_service_update = JSON.stringify([$scope.global.dbname, "accorderie.demande.service", $scope.personal.id]);
            let canal_notif_echange_new = JSON.stringify([$scope.global.dbname, "accorderie.echange.service.notification", $scope.personal.id]);
            let canal_notif_echange_update = JSON.stringify([$scope.global.dbname, "accorderie.echange.service.notification", "UPDATE", $scope.personal.id]);
            console.debug(notifications);
            // Cannot use each, because need to update scope at the end for optimisation
            // _.each(notifications, function (notification) {
            for (let i = 0; i < notifications.length; i++) {
                let notification = notifications[i];
                // let channel = notification[0];
                let message = notification[1];
                let channel = message.canal;
                if (_.isEmpty(message)) {
                    continue;
                }
                // TODO can we merge it together?
                if (channel === canal_membre_update) {
                    let data = message.data;
                    for (const [key, value] of Object.entries(data)) {
                        if (key === "membre_favoris_ids") {
                            // Modified field is in update value
                            let field_id = value[0][1];
                            let membre = $scope.personal.dct_membre_favoris[field_id];
                            let membre2 = $scope.dct_membre[field_id];
                            let membre3 = !_.isUndefined($scope.membre_info) && $scope.membre_info.id === field_id ? $scope.membre_info : undefined;
                            // console.debug("action to do " + String(value));
                            if (value[0] === 4 || value[0][0] === 4) {
                                if (!_.isUndefined(membre2)) {
                                    membre2.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(membre)) {
                                    membre.is_favorite = true;
                                    has_update = true;
                                } else {
                                    if (!_.isUndefined(membre2)) {
                                        $scope.personal.dct_membre_favoris[field_id] = membre2;
                                        has_update = true;
                                    } else {
                                        console.warn("Cannot update favorite membre id " + field_id);
                                    }
                                }
                                if (!_.isUndefined(membre3)) {
                                    membre3.is_favorite = true;
                                    has_update = true;
                                }
                            } else if (value[0][0] === 3) {
                                if (!_.isUndefined(membre)) {
                                    membre.is_favorite = false;
                                    has_update = true;
                                    // Remove it
                                    delete $scope.personal.dct_membre_favoris[field_id]
                                }
                                if (!_.isUndefined(membre2)) {
                                    membre2.is_favorite = false;
                                    has_update = true;
                                }
                                if (!_.isUndefined(membre3)) {
                                    membre3.is_favorite = false;
                                    has_update = true;
                                }
                            } else {
                                console.error("Not support value '" + value + "' from membre_favoris_ids channel '" + channel + "' model 'accorderie.membre'");
                            }
                        }
                    }
                } else if (channel === canal_notif_echange_new) {
                    let data = message.data;
                    if (data.hasOwnProperty("type_notification")) {
                        $scope.lst_notification.unshift(data);
                        if (!has_beep) {
                            this._beep();
                            has_beep = true;
                        }
                        has_update = true;
                    }
                } else if (channel === canal_notif_echange_update) {
                    let data = message.data;
                    if (data.hasOwnProperty("type_notification")) {
                        let dataId = data.id;
                        // search notification
                        for (let i = 0; i < $scope.lst_notification.length; i++) {
                            let notif = $scope.lst_notification[i];
                            if (notif.id === dataId) {
                                $scope.lst_notification[i] = data;
                                break;
                            }
                        }
                        has_update = true;
                    }
                } else if (channel === canal_offre_service_update) {
                    let data = message.data;
                    let field_id = message.field_id;
                    // TODO Loop is not necessary, get the key directly
                    for (const [key, value] of Object.entries(data)) {
                        if (key === "membre_favoris_ids") {
                            let offreService = $scope.personal.dct_offre_service_favoris[field_id];
                            let offreService2 = $scope.personal.dct_offre_service[field_id];
                            let offreService3;
                            if (!_.isUndefined($scope.membre_info.dct_offre_service_favoris)) {
                                offreService3 = $scope.membre_info.dct_offre_service_favoris[field_id];
                            }
                            let offreService4;
                            if (!_.isUndefined($scope.membre_info.dct_offre_service)) {
                                offreService4 = $scope.membre_info.dct_offre_service[field_id];
                            }
                            let offreService5 = $scope.offre_service_info.id === field_id ? $scope.offre_service_info : undefined;
                            let offreService6 = $scope.getDatabaseInfo("accorderie.offre.service", field_id);
                            // console.debug("action to do " + String(value));
                            if (value[0][0] === 4) {
                                // let field_id = value[0][1];
                                $scope.$broadcast("notify_favorite", {
                                    "model": "accorderie.offre.service",
                                    "field_id": field_id,
                                    "status": true
                                });
                                if (!_.isUndefined(offreService)) {
                                    offreService.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService2)) {
                                    offreService2.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService6)) {
                                    offreService6.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService3)) {
                                    offreService3.is_favorite = true;
                                    has_update = true;
                                } else {
                                    if (!_.isUndefined(offreService6)) {
                                        $scope.membre_info.dct_offre_service_favoris[field_id] = offreService6;
                                        has_update = true;
                                    } else {
                                        console.warn("Cannot update favorite offre_service id " + field_id);
                                    }
                                }
                                if (!_.isUndefined(offreService4)) {
                                    offreService4.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService5)) {
                                    offreService5.is_favorite = true;
                                    has_update = true;
                                }
                            } else if (value[0][0] === 3) {
                                $scope.$broadcast("notify_favorite", {
                                    "model": "accorderie.offre.service",
                                    "field_id": field_id,
                                    "status": false
                                });
                                if (!_.isUndefined(offreService)) {
                                    offreService.is_favorite = false;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService2)) {
                                    offreService2.is_favorite = false;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService3)) {
                                    offreService3.is_favorite = false;
                                    has_update = true;
                                    // Remove it
                                    delete $scope.membre_info.dct_offre_service_favoris[field_id]
                                }
                                if (!_.isUndefined(offreService4)) {
                                    offreService4.is_favorite = false;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService5)) {
                                    offreService5.is_favorite = false;
                                    has_update = true;
                                }
                                if (!_.isUndefined(offreService6)) {
                                    offreService6.is_favorite = false;
                                    has_update = true;
                                }
                            } else {
                                console.error("Not support value '" + value + "' from membre_favoris_ids channel '" + channel + "' model 'accorderie.offre.service'");
                            }
                        }
                    }
                } else if (channel === canal_demande_service_update) {
                    let data = message.data;
                    let field_id = message.field_id;
                    for (const [key, value] of Object.entries(data)) {
                        if (key === "membre_favoris_ids") {
                            let demandeService = $scope.personal.dct_demande_service_favoris[field_id];
                            let demandeService2 = $scope.personal.dct_demande_service[field_id];
                            let demandeService3;
                            if (!_.isUndefined($scope.membre_info.dct_demande_service_favoris)) {
                                demandeService3 = $scope.membre_info.dct_demande_service_favoris[field_id];
                            }
                            let demandeService4;
                            if (!_.isUndefined($scope.membre_info.dct_demande_service)) {
                                demandeService4 = $scope.membre_info.dct_demande_service[field_id];
                            }
                            let demandeService5 = $scope.demande_service_info.id === field_id ? $scope.demande_service_info : undefined;
                            let demandeService6 = $scope.getDatabaseInfo("accorderie.demande.service", field_id);
                            // console.debug("action to do " + String(value));
                            if (value[0][0] === 4) {
                                // let field_id = value[0][1];
                                $scope.$broadcast("notify_favorite", {
                                    "model": "accorderie.demande.service",
                                    "field_id": field_id,
                                    "status": true
                                });
                                if (!_.isUndefined(demandeService)) {
                                    demandeService.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(demandeService2)) {
                                    demandeService2.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(demandeService6)) {
                                    demandeService6.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(demandeService3)) {
                                    demandeService3.is_favorite = true;
                                    has_update = true;
                                } else {
                                    if (!_.isUndefined(demandeService6)) {
                                        $scope.membre_info.dct_demande_service_favoris[field_id] = demandeService6;
                                        has_update = true;
                                    } else {
                                        console.warn("Cannot update favorite demande_service id " + field_id);
                                    }
                                }
                                if (!_.isUndefined(demandeService4)) {
                                    demandeService4.is_favorite = true;
                                    has_update = true;
                                }
                                if (!_.isUndefined(demandeService5)) {
                                    demandeService5.is_favorite = true;
                                    has_update = true;
                                }
                            } else if (value[0][0] === 3) {
                                $scope.$broadcast("notify_favorite", {
                                    "model": "accorderie.demande.service",
                                    "field_id": field_id,
                                    "status": false
                                });
                                if (!_.isUndefined(demandeService)) {
                                    demandeService.is_favorite = false;
                                    has_update = true;
                                }
                                if (!_.isUndefined(demandeService2)) {
                                    demandeService2.is_favorite = false;
                                }
                                if (!_.isUndefined(demandeService3)) {
                                    demandeService3.is_favorite = false;
                                    // Remove it
                                    delete $scope.membre_info.dct_demande_service_favoris[field_id]
                                }
                                if (!_.isUndefined(demandeService4)) {
                                    demandeService4.is_favorite = false;
                                }
                                if (!_.isUndefined(demandeService5)) {
                                    demandeService5.is_favorite = false;
                                }
                                if (!_.isUndefined(demandeService6)) {
                                    demandeService6.is_favorite = false;
                                }
                            } else {
                                console.error("Not support value '" + value + "' from membre_favoris_ids channel '" + channel + "' model 'accorderie.demande.service'");
                            }
                        }
                    }
                }
            }
            // });

            if (has_update) {
                // $scope.$apply();
                $scope.$digest();
            }
        },
    });

    return {
        AccorderieNotification: AccorderieNotification,
    };

});
