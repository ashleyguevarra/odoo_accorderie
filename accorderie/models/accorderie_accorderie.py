from odoo import _, api, fields, models


class AccorderieAccorderie(models.Model):
    _name = "accorderie.accorderie"
    _description = (
        "Gestion des entitées Accorderie, contient les informations et les"
        " messages d'une Accorderie."
    )
    _rec_name = "nom"

    nom = fields.Char(
        required=True,
        help="Nom de l'Accorderie",
    )

    active = fields.Boolean(
        string="Actif",
        default=True,
        help=(
            "Lorsque non actif, cette accorderie n'est plus en fonction, mais"
            " demeure accessible."
        ),
    )

    adresse = fields.Char(help="Adresse de l'Accorderie")

    arrondissement = fields.Many2one(
        comodel_name="accorderie.arrondissement",
        help="Nom de l'Arrondissement qui contient l'Accorderie.",
    )

    code_postal = fields.Char(
        string="Code postal",
        help="Code postal de l'Accorderie",
    )

    courriel = fields.Char(
        string="Adresse courriel",
        help="Adresse courriel pour joindre l'Accorderie.",
    )

    date_mise_a_jour = fields.Datetime(
        string="Dernière mise à jour",
        help="Date de la dernière mise à jour",
    )

    grp_achat_administrateur = fields.Boolean(
        string="Groupe d'achats des administrateurs",
        help=(
            "Permet de rendre accessible les achats pour les administrateurs."
        ),
    )

    grp_achat_membre = fields.Boolean(
        string="Groupe d'achats membre",
        help="Rend accessible les achats pour les Accordeurs.",
    )

    logo = fields.Binary(help="Logo de l'Accorderie")

    membre = fields.One2many(
        comodel_name="accorderie.membre",
        inverse_name="accorderie",
        help="Membre relation",
    )

    message_accueil = fields.Html(
        string="Message d'accueil",
        help="Message à afficher pour accueillir les membres.",
    )

    message_grp_achat = fields.Html(
        string="Message groupe d'achats",
        help="Message à afficher pour les groupes d'achats.",
    )

    region = fields.Many2one(
        comodel_name="accorderie.region",
        string="Région administrative",
        help="Nom de la région administrative de l'Accorderie",
    )

    telecopieur = fields.Char(
        string="Télécopieur",
        help="Numéro de télécopieur pour joindre l'Accorderie.",
    )

    telephone = fields.Char(
        string="Téléphone",
        help="Numéro de téléphone pour joindre l'Accorderie.",
    )

    url_public = fields.Char(
        string="Lien du site web publique",
        help="Lien du site web publique de l'Accorderie",
    )

    url_transactionnel = fields.Char(
        string="Lien du site web transactionnel",
        help="Lien du site web transactionnel de l'Accorderie",
    )

    ville = fields.Many2one(
        comodel_name="accorderie.ville",
        help="Nom de la ville de l'Accorderie",
    )
