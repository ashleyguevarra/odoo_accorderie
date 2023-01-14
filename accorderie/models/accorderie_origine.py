from odoo import _, api, fields, models


class AccorderieOrigine(models.Model):
    _name = "accorderie.origine"
    _description = "Accorderie Origine"
    _rec_name = "nom"

    nom = fields.Char(string="Origine")

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="origine",
        help="Membre relation",
    )
