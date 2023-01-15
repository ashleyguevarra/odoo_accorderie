odoo.define('website.accorderie.dialog_monaccorderie', function (require) {
    "use strict";

    var ajax = require("web.ajax");
    var core = require('web.core');
    var _t = core._t;
    var Dialog = require('web.Dialog');

    var result = $.Deferred(),
        _templates_loaded = ajax.loadXML(
            "/website_accorderie/static/src/xml/widgets.xml",
            core.qweb
        );


    var AccorderieForm = Dialog.extend({
        template: "accorderie.AccorderieForm",

        /**
         * Store models info before creating widget
         *
         * @param {Object} parent Widget where this dialog is attached
         * @param {Object} options Dialog creation options
         * @returns {Dialog} New Dialog object
         */
        init: function (parent, options) {

            var _options = $.extend({}, {
                title: _t("Mon accorderie"),
                size: "large",
                dialogClass: "modal_accorderie",
                buttons: [{
                    text: _t("Annuler"),
                    close: true,
                    classes: 'btn-primary btn_accorderie'
                    },
                    {
                        text: _t("Enregistrer"),
                        close: true,
                        classes: 'btn-primary btn_accorderie save'
                    }]
            }, options);
            return this._super(parent, _options);
        },

        /**
         * Save data
         */
        save: function () {
            this.final_data = this.$("#model").val();
            console.log("save: " + this.final_data);


            this._super.apply(this, arguments);
        },
    });


    _templates_loaded.done(function () {
        result.resolve({
            AccorderieForm: AccorderieForm,
        });
    });

    $(document).on("click", '.profile_btn.accorderie', function (ev) {
        let optionsDialog = new AccorderieForm(
            $(".accorderie_dialog"), {}
        );
        console.log(typeof optionsDialog);
        console.log(optionsDialog);
        //
        // let container = document.getElementsByClassName("accorderie_dialog");
        // container[0].appendChild(optionsDialog);
        $(".accorderie_dialog").append(optionsDialog);

        optionsDialog.open();


    })

});
