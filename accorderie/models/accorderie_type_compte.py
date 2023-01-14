from odoo import _, api, fields, models


class AccorderieTypeCompte(models.Model):
    _name = "accorderie.type.compte"
    _description = "Accorderie Type Compte"
    _rec_name = "nom_complet"

    nom_complet = fields.Char(
        string="Nom complet",
        compute="_compute_nom_complet",
        store=True,
    )

    accordeur_simple = fields.Boolean(string="Accordeur simple")

    admin = fields.Boolean()

    admin_chef = fields.Boolean(string="Admin chef")

    admin_ord_point_service = fields.Boolean(
        string="Administrateur ordinaire point service"
    )

    admin_point_service = fields.Boolean(string="Administrateur point service")

    membre = fields.Many2one(comodel_name="accorderie.membre")

    reseau = fields.Boolean(string="Réseau")

    spip = fields.Boolean()

    @api.depends("membre")
    def _compute_nom_complet(self):
        for rec in self:
            value = ""
            if rec.membre:
                value += rec.membre.nom_complet
            if not value:
                value = False
            rec.nom_complet = value
