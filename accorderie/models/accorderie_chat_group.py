import logging
from datetime import datetime

from odoo import _, api, fields, models

_logger = logging.getLogger(__name__)


class AccorderieChatGroup(models.Model):
    _name = "accorderie.chat.group"
    _description = "Accorderie chat group"

    name = fields.Char()

    active = fields.Boolean(default=True)

    membre_ids = fields.Many2many(
        comodel_name="accorderie.membre",
        string="Membres",
        help="Membres du groupe.",
    )

    msg_ids = fields.One2many(
        comodel_name="accorderie.chat.message",
        string="Messages",
        inverse_name="msg_group_id",
    )

    def first_to_json(self, actual_membre_id):
        obj = self[0]
        lst_other_membre_id = [
            a for a in obj.membre_ids if a.id != actual_membre_id
        ]
        if not obj.membre_ids:
            _logger.warning("Why members is empty?")
            data = {}
        else:
            if lst_other_membre_id:
                other_membre_id = lst_other_membre_id[0]
            else:
                # Same member
                other_membre_id = obj.membre_ids[0]
            last_msg = obj.msg_ids[-1].name if obj.msg_ids else ""
            data = {
                # "id": obj.id,
                "id": other_membre_id.id,
                "id_group": obj.id,
                "name": other_membre_id.nom_complet,
                "resume_msg": last_msg,
                "lst_msg": [a.first_to_json() for a in obj.msg_ids],
            }
        return data
