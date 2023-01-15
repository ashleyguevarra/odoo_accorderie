from odoo import _, api, fields, models


class AccorderieArrondissement(models.Model):
    _name = "accorderie.arrondissement"
    _description = "Ensemble des arrondissement des Accorderies"
    _rec_name = "nom"

    nom = fields.Char()

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="arrondissement",
        help="Membre relation",
    )

    ville = fields.Many2one(comodel_name="accorderie.ville")
