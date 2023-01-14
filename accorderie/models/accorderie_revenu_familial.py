from odoo import _, api, fields, models


class AccorderieRevenuFamilial(models.Model):
    _name = "accorderie.revenu.familial"
    _description = "Accorderie Revenu Familial"
    _rec_name = "nom"

    nom = fields.Char(string="Revenu")

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="revenu_familial",
        help="Membre relation",
    )
