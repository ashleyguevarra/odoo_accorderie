from odoo import _, api, fields, models


class AccorderieDroitsAdmin(models.Model):
    _name = "accorderie.droits.admin"
    _description = "Accorderie Droits Admin"
    _rec_name = "nom_complet"

    nom_complet = fields.Char(
        string="Nom complet",
        compute="_compute_nom_complet",
        store=True,
    )

    consulter_etat_compte = fields.Boolean(string="Consulter état de compte")

    consulter_profil = fields.Boolean(string="Consulter profil")

    gestion_dmd = fields.Boolean(string="Gestion demande de services")

    gestion_fichier = fields.Boolean(string="Gestion fichier")

    gestion_offre = fields.Boolean(string="Gestion offre")

    gestion_offre_service = fields.Boolean(string="Gestion offre de services")

    gestion_profil = fields.Boolean(string="Gestion profil")

    gestion_type_service = fields.Boolean(string="Gestion type de services")

    groupe_achat = fields.Boolean(string="Groupe d'achat")

    membre = fields.Many2one(comodel_name="accorderie.membre")

    saisie_echange = fields.Boolean(string="Saisie échange")

    validation = fields.Boolean()

    @api.depends("membre")
    def _compute_nom_complet(self):
        for rec in self:
            if rec.membre:
                rec.nom_complet = rec.membre.nom_complet
            else:
                rec.nom_complet = False
