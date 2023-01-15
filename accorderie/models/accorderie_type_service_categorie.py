from odoo import _, api, fields, models


class AccorderieTypeServiceCategorie(models.Model):
    _name = "accorderie.type.service.categorie"
    _description = "Les catégories de types de services des Accorderies"
    _rec_name = "nom"

    nom = fields.Char(help="Le nom de la catégorie des services")

    active = fields.Boolean(
        string="Actif",
        default=True,
        help=(
            "Lorsque non actif, cette catégorie n'est plus en fonction, mais"
            " demeure accessible."
        ),
    )

    approuve = fields.Boolean(
        string="Approuvé",
        help="Permet d'approuver cette catégorie.",
    )

    icon = fields.Binary(help="Icon représentant la catégorie")

    nocategorie = fields.Integer(required=True)

    type_service_sous_categorie = fields.One2many(
        comodel_name="accorderie.type.service.sous.categorie",
        inverse_name="categorie",
        help="Type Service Sous Categorie relation",
    )

    @api.model
    def _get_html_nom(self):
        return "<br/>".join([a.strip() for a in self.nom.split("/")]) + "<br/>"

    @api.model
    def _get_separate_list_nom(self):
        return ", ".join([a.strip() for a in self.nom.split("/")])
