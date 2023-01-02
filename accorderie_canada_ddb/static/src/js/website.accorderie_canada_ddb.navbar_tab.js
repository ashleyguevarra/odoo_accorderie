odoo.define('website.accorderie_canada_ddb.navbar_tabs.instance', function (require) {
    'use strict';

    require('web_editor.ready');
    let PublierForm = require('website.accorderie_canada_ddb.navbar_tabs');

    let $nav = $('.dropdown-nav');
    if (!$nav.length) {
        return null;
    }

    let instance = new PublierForm();
    return instance.appendTo($nav).then(function () {
        return instance;
    });
});

//==============================================================================

odoo.define("website.accorderie_canada_ddb.navbar_tabs", function (require) {

    let ajax = require('web.ajax');
    let Widget = require('web.Widget');

    // Catch registration form event, because of JS for attendee details
    let PublierForm = Widget.extend({
        start: function () {
            let self = this;
            this._super.apply(this.arguments).then(function () {
                $('#BtnTabOffres')
                    .off('click')
                    .click(function (ev) {
                        self.on_click(ev);
                        self.showTab("tabOffres");
                        self.setActive('#BtnTabOffres');
                    });
            });
            this._super.apply(this.arguments).then(function () {
                $('#BtnTabDemandes')
                    .off('click')
                    .click(function (ev) {
                        self.on_click(ev);
                        self.showTab("tabDemandes");
                        self.setActive('#BtnTabDemandes');
                    });
            });
            this._super.apply(this.arguments).then(function () {
                $('#BtnTabMembres')
                    .off('click')
                    .click(function (ev) {
                        self.on_click(ev);
                        self.showTab("tabMembres");
                        self.setActive('#BtnTabMembres');
                    });
            });
            this._super.apply(this.arguments).then(function () {
                $('#BtnTabMessages')
                    .off('click')
                    .click(function (ev) {
                        self.on_click(ev);
                        self.showTab("tabMessages");
                        self.setActive('#BtnTabMessages');
                    });
            });
            this._super.apply(this.arguments).then(function () {
                $('#BtnTabNotifications')
                    .off('click')
                    .click(function (ev) {
                        self.on_click(ev);
                        self.showTab("tabNotifications");
                        self.setActive('#BtnTabNotifications');
                    });
            });
        },
        on_click: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        },

        showTab: function (tab) {
            let x = $('#' + tab).siblings();

            for (let i = 0; i < x.length; i++) {
                x[i].style.display = "none";
            }
            document.getElementById(tab).style.display = "block";
        },

        setActive: function (id) {
            let siblings = $(id).siblings();
            $(id).addClass("active");

            for(let i = 0; i < siblings.length; i++) {
                console.log(siblings[i]);
                $(siblings[i]).removeClass("active");
            }
        }
    });

    return PublierForm;
});
