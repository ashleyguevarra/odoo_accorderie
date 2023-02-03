from odoo import _, api, fields, models


class AccorderieFichier(models.Model):
    _name = "accorderie.fichier"
    _description = "Accorderie Fichier"
    _rec_name = "nom"

    nom = fields.Char(required=True)

    accorderie = fields.Many2one(
        comodel_name="accorderie.accorderie",
        required=True,
    )

    date_mise_a_jour = fields.Datetime(
        string="Dernière mise à jour",
        help="Date de la dernière mise à jour",
    )

    fichier = fields.Binary(required=True)

    si_accorderie_local_seulement = fields.Boolean(
        string="Accorderie local seulement"
    )

    si_admin = fields.Boolean(string="Admin")

    si_disponible = fields.Boolean(string="Disponible")

    type_fichier = fields.Many2one(
        comodel_name="accorderie.type.fichier",
        string="Type fichier",
        required=True,
    )
