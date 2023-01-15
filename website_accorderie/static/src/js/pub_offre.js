odoo.define('website.accorderie.pub_offre.instance', function (require) {
    'use strict';

    require('web_editor.ready');
    let PublierForm = require('website.accorderie.pub_offre');

    let $form = $('#pub_form');
    if (!$form.length) {
        return null;
    }

    let instance = new PublierForm();
    return instance.appendTo($form).then(function () {
        return instance;
    });
});

//==============================================================================

odoo.define("website.accorderie.pub_offre", function (require) {

    let ajax = require('web.ajax');
    let Widget = require('web.Widget');

    // Catch registration form event, because of JS for attendee details
    let PublierForm = Widget.extend({
        start: function () {
            let self = this;
            let res = this._super.apply(this.arguments).then(function () {
                $('.submit_container .submit_btn')
                    .off('click')
                    .click(function (ev) {
                        self.on_click(ev);
                        self.showModal();
                    });
            });
            return res;
        },
        on_click: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        },

        showModal: function () {

            let target = $('#submitBtn').attr('data-target');
            console.debug(target);
            $(target).attr("aria-hidden", "false");
            $(target).css("display", "block");
            $(target).addClass("show");

        },
    });

    return PublierForm;
});
