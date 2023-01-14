from odoo import _, api, fields, models


class AccorderieWorkflowState(models.Model):
    _name = "accorderie.workflow.state"
    _description = "Accorderie Workflow State"

    name = fields.Char(string="Nom")

    breadcrumb_show_only_last_item = fields.Boolean(
        string="Fil d'ariane affiché dernier item seulement"
    )

    breadcrumb_value = fields.Char(
        string="Contenu fil d'ariane",
        help=(
            "Peut être dynamique, utiliser les %s, et remplir"
            " 'breadcrumb_field_value'"
        ),
    )

    breadcrumb_field_value = fields.Char(
        string="Fil d'ariane valeur dynamique",
        help="Nom des champs, séparé par ;.",
    )

    data = fields.Char(string="Nom base de données")

    submit_button_text = fields.Char(string="Libellé du bouton envoie")

    submit_response_title = fields.Char(string="Titre de la réponse d'envoie")

    submit_response_description = fields.Char(
        string="Description de la réponse d'envoie"
    )

    diagram_id = fields.Many2one(
        comodel_name="accorderie.workflow",
        string="Diagram",
    )

    disable_question = fields.Boolean(string="Désactiver la question")

    key = fields.Char(string="Identifiant", required=True)

    list_is_first_position = fields.Boolean(
        string="Première position dans la sélection"
    )

    is_rectangle = fields.Boolean(
        string="Est rectangle", compute="_is_rectangle"
    )

    message = fields.Char()

    model_field_depend = fields.Char(
        string="État qui dépend de champs",
        help=(
            "Liste de champs nécessaire pour cette état, séparé par ;. Il est"
            " nécessaire d'avoir dans les états précédents avec"
            " 'model_field_name' les éléments de ce champs indépendants."
        ),
    )

    model_field_name = fields.Char(string="Champs du modèle")

    model_field_name_alias = fields.Char(string="Alias champs du modèle")

    data_update_url = fields.Char(
        string="URL sync data",
        help=(
            "Lien pour synchroniser la base de données lors d'une dépendance."
            " Mettre %s pour ajouter les paramètres de 'data_url_field'"
        ),
    )

    data_url_field = fields.Char(
        string="Paramètre url data",
        help=(
            "Paramètre à envoyer au data_update_url. Separé par ';' pour en"
            " avoir plusieurs"
        ),
    )

    force_update_data = fields.Boolean(
        string="Forcer synchronisation data",
        help=(
            "À chaque load du state, on va forcer la mise à jour de la base de"
            " données."
        ),
    )

    maquette_link = fields.Char(
        string="Lien maquette",
        help="Référence de la conception de l'état vers une maquette.",
    )

    not_implemented = fields.Boolean(
        string="Not implemented",
        help="Pas encore implémenté, ignoré pour le moment",
    )

    help_section = fields.Char(
        string="Help section",
        help="Aide - nom de la section",
    )

    help_sub_section = fields.Char(
        string="Help sub section",
        help="Aide - nom de la sous-section",
    )

    help_title = fields.Char(
        string="Help title",
        help="Aide - nom de l'aide",
    )

    help_description = fields.Char(
        string="Help description",
        help="Aide - description de l'aide",
    )

    caract_offre_demande_nouveau_existante = fields.Selection(
        selection=[
            ("Nouvelle offre", "Nouvelle offre"),
            ("Nouvelle demande", "Nouvelle demande"),
            ("Offre existante", "Offre existante"),
            ("Demande existante", "Demande existante"),
        ],
        help="Fonctionnalité un choix pour un état",
    )

    caract_echange_nouvel_existant = fields.Selection(
        selection=[
            ("Nouvel échange", "Nouvel échange"),
            ("Échange existant", "Échange existant"),
        ],
        help="Fonctionnalité un choix pour un état",
    )

    caract_service_offrir_recevoir = fields.Selection(
        selection=[
            ("Service à offrir", "Service à offrir"),
            ("Service à recevoir", "Service à recevoir"),
        ],
        help="Fonctionnalité un choix pour un état",
    )

    caract_valider_echange = fields.Boolean(
        help="Fonctionnalité si valider échange"
    )

    help_caract_lst = fields.Char(
        string="Help caracteristic",
        help="Aide - liste des caractéristiques, séparé par ;",
    )

    help_fast_btn_title = fields.Char(
        string="Help title button",
        help="Aide - titre du bouton pour aller à la page associé",
    )

    help_fast_btn_url = fields.Char(
        string="Help url button",
        help="Aide - lien du bouton pour aller à la page associé",
    )

    help_fast_btn_guide_url = fields.Char(
        string="Help url guide button",
        help="Aide - lien du bouton guide interactif animation",
    )

    help_fast_btn_form_url = fields.Char(
        string="Help url form button",
        help="Aide - lien du bouton formulaire",
    )

    help_date_last_update = fields.Datetime(
        string="Date dernière mise à jour",
        help="Date manuelle de la dernière mise à jour",
    )

    help_validate_bug = fields.Html(
        string="Validate bug",
        help="Information sur l'état, validation et bug connu",
    )

    help_video_url = fields.Char(
        string="Help video url",
        help="Aide - lien de la vidéo de l'aide",
    )

    show_breadcrumb = fields.Boolean(string="Afficher le fil d'ariane")

    state_dst_ids = fields.One2many(
        comodel_name="accorderie.workflow.relation",
        inverse_name="state_dst",
        string="Relation source",
        # Inverse string because one2many
    )

    state_src_ids = fields.One2many(
        comodel_name="accorderie.workflow.relation",
        inverse_name="state_src",
        string="Relation destination",
        # Inverse string because one2many
    )

    type = fields.Selection(
        selection=[
            ("selection_static", "Sélection statique"),
            ("selection_dynamique", "Sélection dynamique"),
            ("choix_categorie_de_service", "Choix catégorie de service"),
            ("choix_membre", "Choix membre"),
            ("calendrier", "Calendrier"),
            ("temps_duree", "Temps et durée"),
            ("form", "Form"),
            ("null", "Nulle"),
        ],
        default="null",
        required=True,
    )

    xpos = fields.Integer(
        string="Diagram position x",
        default=50,
    )

    ypos = fields.Integer(
        string="Diagram position y",
        default=50,
    )

    @api.depends("type")
    def _is_rectangle(self):
        for obj in self:
            obj.is_rectangle = obj.type in (
                "selection_static",
                "selection_dynamique",
                "null",
            )
