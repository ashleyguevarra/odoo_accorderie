from odoo import _, api, fields, models


class AccorderieTypeCommunication(models.Model):
    _name = "accorderie.type.communication"
    _description = "Accorderie Type Communication"
    _rec_name = "nom"

    nom = fields.Char(string="Typecommunication")

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="type_communication",
        help="Membre relation",
    )
