odoo.define('website.accorderie.debug_not_implemented.instance', function (require) {
    'use strict';

    require('web_editor.ready');
    let Debug = require('website.accorderie.debug_not_implemented');

    let $debug = $('.debug-item');
    if (!$debug.length) {
        return null;
    }

    let instance = new Debug();
    return instance.appendTo($debug).then(function () {
        return instance;
    });
});

//==============================================================================

odoo.define("website.accorderie.debug_not_implemented", function (require) {

    let Widget = require('web.Widget');
    let session = require('web.session');

    const uniqueIdHideNotImplemented = "unique_hide_debug_unimplemented";
    const debugHideClass = "hide_not_implemented";
    const debugHideCSS = "website_debugger_hide.css";

    const uniqueIdHighLight = "unique_highlight_debug_unimplemented";
    const debugHighLightClass = "highlight_not_implemented";
    const debugHighLightCSS = "website_debugger_highlight.css";

    const uniqueIdDebugDebug = "unique_debug_debug_unimplemented";
    const debugDebugClass = "btn_debug_debug";
    const debugDebugCSS = "website_debugger_debug_debug.css";

    let Debug = Widget.extend({
        start: function () {
            let self = this;
            let debugHide = false; //hide mode
            let debugHighlighted = false; //highlight mode
            let debugDebug = false; //hide mode

            $(document).ready(function () {
                let is_debug = session.debug || !_.isEmpty(session.debug);
                if (is_debug) {
                    debugDebug = true;
                    self.LoadCss(debugDebug, uniqueIdDebugDebug, debugDebugCSS)
                    self.ActivateDebug(debugDebugClass, debugDebug, true);
                }
                if (!session.is_admin && !is_debug) {
                    debugHide = true;
                    self.LoadCss(debugHide, uniqueIdHideNotImplemented, debugHideCSS)
                    self.ActivateDebug(debugHideClass, debugHide);
                }
                // session.user_has_group('base.group_portal').then(function (has_group) {
                //     if (has_group) {
                //         debugHide = true;
                //         self.ActivateDebug("hide_not_implemented", true);
                //         self.HideNotImplemented(true);
                //     }
                // });
            });

            $(document).on("click", "." + debugHighLightClass, function (ev) {
                console.debug("Click " + debugHighLightClass);
                ev.preventDefault();
                ev.stopPropagation();
                debugHighlighted = !debugHighlighted;
                self.LoadCss(debugHighlighted, uniqueIdHighLight, debugHighLightCSS)
                self.ActivateDebug(debugHighLightClass, debugHighlighted);
                // turn off other mode
                debugHide = false;
                self.LoadCss(debugHide, uniqueIdHideNotImplemented, debugHideCSS)
            })

            $(document).on("click", "." + debugHideClass, function (ev) {
                console.debug("Click " + debugHideClass);
                ev.preventDefault();
                ev.stopPropagation();
                debugHide = !debugHide;
                self.LoadCss(debugHide, uniqueIdHideNotImplemented, debugHideCSS)
                self.ActivateDebug(debugHideClass, debugHide);
                // turn off other mode
                debugHighlighted = false;
                self.LoadCss(debugHighlighted, uniqueIdHighLight, debugHighLightCSS)
            })

            $(document).on("click", "." + debugDebugClass, function (ev) {
                console.debug("Click " + debugDebugClass);
                ev.preventDefault();
                ev.stopPropagation();
                debugDebug = !debugDebug;
                self.LoadCss(debugDebug, uniqueIdDebugDebug, debugDebugCSS)
                self.ActivateDebug(debugDebugClass, debugDebug, true);
            })
        },
        LoadCss: function (isLoad, uniqueIdName, cssName) {
            if (isLoad) {
                let link = document.createElement('link');
                link.rel = "stylesheet";
                link.type = "text/css";
                link.id = uniqueIdName;
                link.href = document.location.origin + "/website_accorderie/static/src/scss/" + cssName;

                document.head.appendChild(link);
            } else {
                let unique_id = document.getElementById(uniqueIdName);
                if (!_.isNull(unique_id)) {
                    unique_id.remove();
                }
            }
        },
        ActivateDebug: function (debugType, debugActive, ignoreSibling = false) {
            let debugBtn = document.getElementsByClassName(debugType);
            let siblings = $('.' + debugType).siblings();

            // deactivate sibling buttons
            if (!ignoreSibling) {
                for (let i = 0; i < siblings.length; i++) {
                    // Ignore debug_debug button
                    if (siblings[i].className.indexOf(debugDebugClass) === -1) {
                        siblings[i].style.backgroundColor = "unset";
                    }
                }
            }
            // activate/deactivate target button
            for (let i = 0; i < debugBtn.length; i++) {
                if (debugActive) {
                    debugBtn[i].style.backgroundColor = "lightgrey";
                } else {
                    debugBtn[i].style.backgroundColor = "unset";
                }
            }
        }
    });

    return Debug;
});