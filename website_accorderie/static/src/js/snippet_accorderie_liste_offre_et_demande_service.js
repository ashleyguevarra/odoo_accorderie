odoo.define(
    "accorderie_liste_offre_et_demande_service.animation",
    function (require) {
        "use strict";

        let sAnimation = require("website.content.snippets.animation");

        sAnimation.registry.accorderie_liste_offre_et_demande_service =
            sAnimation.Class.extend({
                selector:
                    ".o_accorderie_liste_offre_et_demande_service",

                start: function () {
                    let self = this;
                    this._eventList = this.$(".container");
                    this._originalContent = this._eventList[0].outerHTML;
                    let def = this._rpc({
                        route: "/accorderie/offre_service_accorderie_offre_service_and_demande_service_accorderie_demande_service_list",
                    }).then(function (data) {
                        if (data.error) {
                            return;
                        }

                        if (_.isEmpty(data)) {
                            return;
                        }

                        self._$loadedContent = $(data);
                        self._eventList.replaceWith(self._$loadedContent);
                    });

                    return $.when(this._super.apply(this, arguments), def);
                },
                destroy: function () {
                    this._super.apply(this, arguments);
                    if (this._$loadedContent) {
                        this._$loadedContent.replaceWith(this._originalContent);
                    }
                },
            });
    }
);
