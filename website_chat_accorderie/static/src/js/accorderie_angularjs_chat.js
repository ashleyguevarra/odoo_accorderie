odoo.define('website.accorderie_angularjs_chat', function (require) {
    "use strict";

    require('web.dom_ready');
    require('bus.BusService');
    require('website.accorderie_angularjs_global');
    require('website.accorderie_notification');

    let Widget = require('web.Widget');
    let ajax = require('web.ajax');

    // Get existing module
    let app = angular.module('AccorderieApp');

    app.controller('ChatController', ['$scope', '$controller', '$location', function ($scope, $controller, $location) {
        $scope.$scope_main = angular.element(document.querySelector('[ng-controller="MainController"]')).scope();
        // Inherit MainController
        // $controller('MainController', {$scope: $scope});
        $scope.$scope_main.enable_chat = false
        $scope.$scope_main.lst_membre_message = [];
        $scope.$scope_main.section_membre = "";
        $scope.$scope_main.default_section_membre = "";
        $scope.$scope_main.section_membre_dct = undefined;
        $scope.$scope_main.hide_votre_contact_to_contact = false;

        $scope.update_db_my_personal_chat = function () {
            ajax.rpc("/accorderie/get_personal_chat_information", {}).then(function (data) {
                console.debug("AJAX receive get_personal_chat_information");
                if (data.error || !_.isUndefined(data.error)) {
                    $scope.error = data.error;
                    console.error($scope.error);
                } else if (_.isEmpty(data)) {
                    $scope.error = "Empty 'get_personal_chat_information' data";
                    console.error($scope.error);
                } else {
                    $scope.error = "";
                    $scope.$scope_main.lst_membre_message = data.lst_membre_message;
                }

                // Process all the angularjs watchers
                $scope.$scope_main.$digest();
            })
        }

        $scope.update_db_my_personal_chat();

        $scope.$on('$locationChangeSuccess', function (object, newLocation, previousLocation) {
            if (window.location.pathname !== "/notification") {
                return;
            }
            $scope.$scope_notification = angular.element(document.querySelector('[ng-controller="NotificationController"]')).scope();
            if (!_.isUndefined($scope.$scope_notification)) {
                $scope.$scope_notification.default_section = "message";
                let section = $location.search()["section"];
                if (_.isEmpty(section)) {
                    $scope.$scope_notification.section = $scope.$scope_notification.default_section;
                }
                $scope.$scope_main.hide_votre_contact_to_contact = section !== 'membre';
                $scope.updateMembreFromLocation();
            } else {
                console.error("Cannot find controller NotificationController");
            }
        });

        $scope.$scope_main.$watch('lst_membre_message', function (value) {
            // TODO bad design
            if (!_.isEmpty(value) && !_.isUndefined($scope.$scope_main.section_membre_dct)) {
                $scope.updateMembreFromLocation();
            }
        });

        $scope.updateMembreFromLocation = function () {
            let section_membre = $location.search()["membre"];
            let isEmpty = true;
            console.debug("Load chat member");
            if (!_.isEmpty(section_membre)) {
                let membre_id = parseInt(section_membre);
                if (Number.isInteger(membre_id)) {
                    isEmpty = false;
                    $scope.$scope_main.section_membre = membre_id;
                    $scope.update_membre_info(membre_id, "contact_info");

                    let membre_dct = $scope.$scope_main.lst_membre_message.find(ele => ele.id === membre_id)
                    if (!_.isUndefined(membre_dct)) {
                        $scope.$scope_main.section_membre_dct = membre_dct;
                    } else {
                        $scope.$scope_main.section_membre_dct = {
                            "id": membre_id,
                            "lst_msg": [],
                        };
                        // TODO missing "name" of user_name member
                        $scope.$scope_main.lst_membre_message.push($scope.$scope_main.section_membre_dct)
                        setTimeout(function () {
                            $(".chat_body").animate({scrollTop: 20000000}, "slow");
                        }, 125);
                        // $scope.error = "Cannot find this member of id '" + membre_id + "'.";
                    }
                } else {
                    $scope.error = "Parameter 'membre' is not an integer.";
                }
            }
            if (isEmpty) {
                $scope.$scope_main.section_membre = $scope.$scope_main.default_section_membre;
                $scope.$scope_main.section_membre_dct = undefined;
            }
        }

        $scope.$scope_main.send_chat_msg = function () {
            let ele = document.getElementById("input_text_chat");
            let msg = ele.value;
            if (_.isEmpty(msg)) {
                console.debug("Ignore empty chat message.");
                return;
            }
            console.debug("Send msg : '" + msg + "'");
            ele.value = "";
            // let msg = $scope.chat_msg;
            ajax.rpc('/accorderie/submit/chat_msg', {
                "msg": msg,
                "group_id": $scope.$scope_main.section_membre_dct.id_group,
                "membre_id": $scope.$scope_main.section_membre,
            }).then(function (data) {
                console.debug("AJAX receive send_chat_msg");
                if (data.error || !_.isUndefined(data.error)) {
                    $scope.error = data.error;
                    console.error($scope.error);
                } else if (_.isEmpty(data)) {
                    let error = "Empty 'send_chat_msg' data";
                    console.error(error);
                    // TODO mauvaise stratégie, on s'en fou du status, ça permet juste d'Économiser des petites secondes
                    // TODO erreur, il faut inverser le m_id
                    // TODO il faut ajouter l'information avant le ajax et mettre à jour son ID
                    // } else {
                    //     data = {
                    //         "id": status.msg_id,
                    //         "is_read": true,
                    //         // "m_id": $scope.section_membre,
                    //         "m_id": $scope.personal.id,
                    //         "name": msg
                    //     }
                    //     $scope.section_membre_dct.lst_msg.push(data);
                }

                // Process all the angularjs watchers
                // $scope.$digest();
            })
            // $scope.chat_msg = "";
        }

        $scope.$scope_main.press_enter_send_chat_msg = function (keyEvent) {
            if (keyEvent.which === 13) {
                $scope.$scope_main.send_chat_msg();
            }
        }

    }])

    let AccorderieAngularJSChat = Widget.extend({
        init: function (parent) {
            this._super(parent);
        },
        willStart: function () {
            return this._loadQWebTemplate();
        },
        start: function () {
            // TODO use a unique channel, ask server the canal name for the user
            // TODO add a polling heartbeat, because when javascript crash, need to restart the bus_service
            this.call('bus_service', 'addChannel', "accorderie.notification.message");
            this.call('bus_service', 'startPolling');
            this.call('bus_service', 'onNotification', this, this._onNotificationMessage);
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
        _onNotificationMessage: function (notifications) {
            let $scope = angular.element($("[ng-app]")).scope();
            let has_beep = false;
            let has_update = false;
            let canal_notif_chat_msg_update = JSON.stringify([$scope.global.dbname, "accorderie.chat.message", $scope.personal.id]);
            for (let i = 0; i < notifications.length; i++) {
                let notification = notifications[i];
                // let channel = notification[0];
                let message = notification[1];
                let channel = message.canal;
                if (_.isEmpty(message)) {
                    continue;
                }
                if (channel === canal_notif_chat_msg_update) {
                    let data = message.data;
                    if (data.m_id !== $scope.personal.id) {
                        if (!has_beep) {
                            this._beep();
                            has_beep = true;
                        }
                    }
                    if (data.hasOwnProperty("m_id")) {
                        let msg_dct = {
                            "id": data.id,
                            "is_read": data.is_read,
                            "m_id": data.m_id,
                            "name": data.name,
                        };
                        // Find group
                        let membre_dct = $scope.lst_membre_message.find(ele => ele.id_group === data.group_id)
                        if (!_.isUndefined(membre_dct)) {
                            // find if message already, or add it!
                            let existing_msg = membre_dct.lst_msg.find(ele => ele.id === data.id)
                            if (_.isUndefined(existing_msg)) {
                                membre_dct.lst_msg.push(msg_dct);
                                membre_dct.resume_msg = data.name;
                                // Update scroll
                                // let chatBody = document.getElementsByClassName("chat_body");
                                // if (!_.isUndefined(chatBody)) {
                                //     const scroller = chatBody[0];
                                //     scroller.scrollTop = scroller.scrollHeight + document.getElementsByClassName("chat_msg")[0].clientHeight;
                                // }
                                $(".chat_body").animate({scrollTop: 20000000}, "slow");
                            } else {
                                console.warn("Receive message duplicated, check next msg");
                                console.warn(data);
                            }
                        } else {
                            // Check if temporary exist
                            let membre_dct = $scope.lst_membre_message.find(ele => ele.id === data.membre_id)
                            let group_data = {
                                "id": data.membre_id,
                                "id_group": data.group_id,
                                "name": data.membre_name,
                                "resume_msg": data.name,
                                "lst_msg": [msg_dct]
                            }
                            if (!_.isUndefined(membre_dct)) {
                                // update it
                                membre_dct["id"] = group_data.id
                                membre_dct["id_group"] = group_data.id_group
                                membre_dct["name"] = group_data.name
                                membre_dct["resume_msg"] = group_data.resume_msg
                                membre_dct["lst_msg"] = group_data.lst_msg
                                // TODO never use this case
                                console.debug("We use this case, update existing membre_message.")
                            } else {
                                // not exist, create it
                                $scope.lst_membre_message.unshift(group_data);
                                // let $scope_notification = angular.element(document.querySelector('[ng-controller="NotificationController"]')).scope();
                                // if (!_.isUndefined($scope_notification)) {
                                $scope.section_membre_dct = group_data;
                                // }
                            }
                        }
                        has_update = true;
                    }
                }
            }
            if (has_update) {
                // $scope.$apply();
                $scope.$digest();
            }
        }
    });

    return {
        AccorderieAngularJSChat: AccorderieAngularJSChat,
    };

})