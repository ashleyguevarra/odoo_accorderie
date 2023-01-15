from odoo import _, api, fields, models


class AccorderieDemandeAdhesion(models.Model):
    _inherit = "accorderie.demande.adhesion"
    _description = "Accorderie Demande Adhesion DEMO"

    @api.model_create_multi
    def create(self, vals_list):
        vals = super(AccorderieDemandeAdhesion, self).create(vals_list)
        # Automatic accept, create member
        if (
            self.env["ir.config_parameter"]
            .sudo()
            .get_param("accorderie.accorderie_auto_accept_adhesion")
        ):
            lst_data = []
            for val in vals:
                data = {
                    "accorderie": val.accorderie.id,
                    "profil_approuver": True,
                    "nom": val.nom,
                    "prenom": val.prenom,
                    "user_id": val.user_id.id,
                    "membre_partner_id": val.user_id.partner_id.id,
                    "region": self.env.ref(
                        "accorderie_data.accorderie_region_capitale_nationale"
                    ).id,
                    "ville": self.env.ref(
                        "accorderie_data.accorderie_ville_grosse_ile"
                    ).id,
                }
                lst_data.append(data)
            self.env["accorderie.membre"].create(lst_data)
        return vals
