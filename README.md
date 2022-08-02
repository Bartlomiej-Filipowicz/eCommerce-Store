# eCommerce Store - web app ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)

### eCommerce Store built with **React**, **Django** and **PostgreSQL**

## Table of contents
* [General info](#general-info)
* [Features](#features)
* [Technologies](#technologies)
* [Launch](#launch)
* [Illustrations](#illustrations)
* [Technical overview](#technical-overview)
* [The project status](#the-project-status)
* [Other information](#other-information)

## General info
eCommerce Store is a web application, where customers can create an account, log in, go through products and place order of desired products.

The store consists of a homepage (where all products are displayed), a page of a single product, a cart page, a user account functionality, logging in, registering a new user, a user profile page, updating user profile, a checkout functionality (coming soon) and an admin screen (coming soon).

This is a training project. The goal was to practice use of **Django**, **PostgreSQL** and **React** in a real project.

## Features
- Creating an account
- Logging in & out
- Updating user details
- Browsing products
- Adding products to a cart
- Placing order [soon]
- Ability to manage users (for admins) [soon]
- Ability to manage products (for admins) [soon]

## Technologies
- Python 3.10.2
- Django 4.0.4
- Django REST Framework 3.13.1
- React 18.2.0
- React Redux 8.0.2
- Bootstrap v5.1.3
- Bootswatch v5.1.3
- React Router DOM 6.2.2
- JSON Web Tokens

## Launch
To launch **Django** server on a local machine (in a **virtual environment** and **backend** folder):

`py manage.py runserver`

To launch **React** server on a local machine (in the **frontend** folder):

`npm start`

The project will be soon deployed to a live server.

## Illustrations
![image](https://user-images.githubusercontent.com/96448777/182486302-2a0fae46-8626-435a-8dd4-0defe74a7485.png)

![image](https://user-images.githubusercontent.com/96448777/182486475-0ee9bc08-2a62-4a1c-a992-10143b301a34.png)

![image](https://user-images.githubusercontent.com/96448777/182486644-9ffc0809-9570-405a-b075-c83b81ad5b49.png)

![image](https://user-images.githubusercontent.com/96448777/182486714-fa7293a4-0928-49d4-9679-8ffc4cd4a9e8.png)

## Technical overview
**Frontend**: React is used to build a frontend part of the store. The application is a SPA: appropiate screens are loaded from App.js. The app takes advantage of Redux for updating states of components. According to Redux pattern I set up a store, which is a kind of client-side database. When there is an event on a website, an action is dispatched to a reducer and that reducer updates the store. That cycle handles states of components of the app.

**Backend**: Backend part is mainly located in Django app called 'base'. Frontend and backend are communicating with each other using REST APIs (Django REST Framework comes here in handy). Web requests from frontend are handled by view functions which return web respones back to frontend. The urls files assign URLs to appropriate views. Postgres is used for database management. Connection with database is realized by using models.py file, where models are defined. Every model is a class. Every class is a database table. Attributes in those classes are database table columns.

## The project status
The project is in the last phase of development. A checkout functionality and admin screen are being developed currently. The project will be soon finished and deployed to a live server.

## Other information
Author [**Bartłomiej Filipowicz**](https://github.com/Bartlomiej-Filipowicz)

Email <ins>filipowicz@student.agh.edu.pl</ins>
