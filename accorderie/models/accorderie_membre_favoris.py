from datetime import datetime

from odoo import _, api, fields, models


class AccorderieMembre(models.Model):
    _name = "accorderie.membre.favoris"
    _description = "Accorderie Membre Favoris des membres"
    _rec_name = "membre_id"

    membre_id = fields.Many2one(
        comodel_name="accorderie.membre",
        string="Membre",
    )
