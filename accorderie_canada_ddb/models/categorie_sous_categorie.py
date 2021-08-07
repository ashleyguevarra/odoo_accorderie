from odoo import _, api, models, fields


class CategorieSousCategorie(models.Model):
    _name = "categorie.sous.categorie"
    _description = "Model Categorie_sous_categorie belonging to Module Tbl"

    approuver = fields.Integer()

    description = fields.Char()

    name = fields.Char()

    nocategorie = fields.Integer()

    nocategoriesouscategorie = fields.Integer(required=True)

    nooffre = fields.Integer()

    nosouscategorie = fields.Char()

    supprimer = fields.Integer()

    titreoffre = fields.Char()
