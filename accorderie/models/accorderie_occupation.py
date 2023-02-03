from odoo import _, api, fields, models


class AccorderieOccupation(models.Model):
    _name = "accorderie.occupation"
    _description = "Accorderie Occupation"
    _rec_name = "nom"

    nom = fields.Char(string="Occupation")

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="occupation",
        help="Membre relation",
    )
