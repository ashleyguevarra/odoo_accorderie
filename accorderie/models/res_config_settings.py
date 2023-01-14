from odoo import api, fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    accorderie_auto_accept_adhesion = fields.Boolean(
        "Auto accept adhesion",
        config_parameter="accorderie.accorderie_auto_accept_adhesion",
    )
