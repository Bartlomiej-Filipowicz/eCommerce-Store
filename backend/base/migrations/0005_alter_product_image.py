# Generated by Django 4.0.4 on 2022-08-12 18:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_product_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, default='/placeholder.png', null=True, upload_to=''),
        ),
    ]