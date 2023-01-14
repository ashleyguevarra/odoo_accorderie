from odoo import _, api, fields, models


class AccorderieSituationMaison(models.Model):
    _name = "accorderie.situation.maison"
    _description = "Accorderie Situation Maison"
    _rec_name = "nom"

    nom = fields.Char(string="Situation")

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="situation_maison",
        help="Membre relation",
    )
