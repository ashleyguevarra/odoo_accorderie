from odoo import SUPERUSER_ID, _, api, fields, models, tools


class ResPartner(models.Model):
    _inherit = "res.partner"

    accorderie_membre_ids = fields.One2many(
        comodel_name="accorderie.membre",
        string="Membre",
        inverse_name="membre_partner_id",
    )
