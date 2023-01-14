# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

import logging
from datetime import datetime

from pytz import timezone

from odoo import SUPERUSER_ID, _, api, tools

_logger = logging.getLogger(__name__)
tz_montreal = timezone("America/Montreal")


def post_init_hook(cr, e):
    with api.Environment.manage():
        env = api.Environment(cr, SUPERUSER_ID, {})

        website_accueil = env["ir.ui.view"].search(
            [("key", "=", "website.accueil")]
        )
        arch = website_accueil.arch
        last_index = arch.find("</h1>") + 6
        html_message = f"""                    <div class="s_alert s_alert_md alert-delta w-100 clearfix">
                      <i class="fa fa-2x fa-info-circle s_alert_icon"/>
                      <div class="s_alert_content">
                        <p data-original-title="" title="" aria-describedby="tooltip23978">Ceci est une démonstration, les données sont fictives et toutes les données seront purgées à la prochaine mise à jour. Dernière mise à jour le {datetime.now(tz_montreal).strftime('%d %B %Y')}.<br/></p>
                      </div>
                    </div>"""
        arch = arch[:last_index] + html_message + arch[last_index:]
        website_accueil.arch = arch
        website_accueil.arch_base = arch

        # General configuration
        # Force accept subscription
        values = {
            "auth_signup_uninvited": "b2c",
        }
        event_config = env["res.config.settings"].sudo().create(values)
        event_config.execute()
