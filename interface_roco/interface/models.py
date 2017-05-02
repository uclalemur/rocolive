from __future__ import unicode_literals

from django.db import models

# Create your models here.


class SessionSave(models.Model):
    xml_text = models.TextField()
    save_date = models.DateTimeField('date saved')
