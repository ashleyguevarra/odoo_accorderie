from odoo import _, api, fields, models


class AccorderieProvenance(models.Model):
    _name = "accorderie.provenance"
    _description = "Accorderie Provenance"
    _rec_name = "nom"

    nom = fields.Char(string="Provenance")

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="provenance",
        help="Membre relation",
    )
