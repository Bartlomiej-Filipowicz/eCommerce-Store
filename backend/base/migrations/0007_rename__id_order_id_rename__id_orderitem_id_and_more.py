# Generated by Django 4.0.4 on 2022-08-25 12:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_review_createdat'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='orderitem',
            old_name='_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='review',
            old_name='_id',
            new_name='id',
        ),
        migrations.RenameField(
            model_name='shippingaddress',
            old_name='_id',
            new_name='id',
        ),
    ]