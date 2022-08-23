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

The store consists of a homepage (where all products are displayed), a page of a single product, a cart page, a user account functionality, logging in, registering a new user, a user profile page, updating user profile, a checkout functionality and an admin screen.

This is a training project. The goal was to practice use of **Django**, **PostgreSQL** and **React** in a real project.

## Features
- Creating an account
- Logging in & out
- User profile with listed orders
- Top products carousel
- Browsing products
- Product reviews and ratings
- Product pagination
- Adding products to a cart
- Placing order
- PayPal / credit card integration
- Product search feature
- Ability to manage users (for admins)
- Ability to manage products (for admins)
- Order details page (for admins)
- Mark orders as delivered option (for admins)

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
![image](https://user-images.githubusercontent.com/96448777/185259109-bfe8c106-d125-497d-96fe-332787306d43.png)

![image](https://user-images.githubusercontent.com/96448777/185259243-3fe589a4-6fab-4147-a2bf-80224d51ec8a.png)

![image](https://user-images.githubusercontent.com/96448777/185259337-d606b8f0-12e8-4318-9103-8b0216553695.png)

![image](https://user-images.githubusercontent.com/96448777/185259736-bcbea413-708c-42c4-afeb-92edf9bf58b6.png)

![image](https://user-images.githubusercontent.com/96448777/185259991-cb37e260-3508-42a0-bd6e-4cd1cdc342bd.png)

![image](https://user-images.githubusercontent.com/96448777/185260218-fba27012-7a28-452e-9f4d-ab95c93bded8.png)

![image](https://user-images.githubusercontent.com/96448777/185260292-5dbd77e1-b006-483e-bd38-d7229a84f8e6.png)

![image](https://user-images.githubusercontent.com/96448777/185260347-4e3296ad-43d9-41b8-af0c-1485d2d39c4e.png)

![image](https://user-images.githubusercontent.com/96448777/185260425-ca1c3c19-710f-4669-88a5-3bc942b1dc58.png)

![image](https://user-images.githubusercontent.com/96448777/185260987-5b732d66-e775-4f5c-a602-52ca8406ecc7.png)

![image](https://user-images.githubusercontent.com/96448777/185261168-1f9a9751-4d56-4c93-aeb1-06e99029569c.png)

![image](https://user-images.githubusercontent.com/96448777/185261282-c3ba8279-2782-4c63-a3d1-35530362cd35.png)

![image](https://user-images.githubusercontent.com/96448777/185261600-301fd867-8e13-4108-a200-afc1a7a46704.png)

![image](https://user-images.githubusercontent.com/96448777/185261726-b6ae050f-88c0-4c5c-bfe2-051c34b48b2e.png)

![image](https://user-images.githubusercontent.com/96448777/185262079-b78fb4ac-a49b-4fc3-aba1-0b00b01ef432.png)

![image](https://user-images.githubusercontent.com/96448777/185262253-de70f3ea-ac5a-4127-829b-d62466626abd.png)




## Technical overview
**Frontend**: React is used to build a frontend part of the store. The application is a SPA: appropiate screens are loaded from App.js. The app takes advantage of Redux for updating states of components. According to Redux pattern I set up a store, which is a kind of client-side database. When there is an event on a website, an action is dispatched to a reducer and that reducer updates the store. That cycle handles states of components of the app.

**Backend**: Backend part is mainly located in Django app called 'base'. Frontend and backend are communicating with each other using REST APIs (Django REST Framework comes here in handy). Web requests from frontend are handled by view functions which return web respones back to frontend. The urls files assign URLs to appropriate views. Postgres is used for database management. Connection with database is realized by using models.py file, where models are defined. Every model is a class. Every class is a database table. Attributes in those classes are database table columns.

## The project status
The development of the project is finished. The project will be soon deployed to a live server.

## Other information
Author [**Bartłomiej Filipowicz**](https://github.com/Bartlomiej-Filipowicz)

Email <ins>filipowicz@student.agh.edu.pl</ins>
