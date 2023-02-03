from odoo import _, api, fields, models


class AccorderieWorkflow(models.Model):
    _name = "accorderie.workflow"
    _description = "Accorderie Workflow"

    name = fields.Char(string="Nom")

    diagram_relation_ids = fields.One2many(
        comodel_name="accorderie.workflow.relation",
        inverse_name="diagram_id",
        string="Relation",
    )

    diagram_state_ids = fields.One2many(
        comodel_name="accorderie.workflow.state",
        inverse_name="diagram_id",
        string="State",
    )
