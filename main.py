from distutils.command.build_scripts import first_line_re
import os
import stripe
from flask import Flask, jsonify, abort, request, redirect, render_template, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.sql import expression
from sqlalchemy.orm import relationship
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import sys
import json


app = Flask(__name__, static_folder='../client', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'TDDD83'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.config['STRIPE_PUBLIC_KEY'] = 'pk_test_51Kd8ehDYoGpi5znVEOHO9ugHtBtGdzeobbrHs6xAcuBjY8TYSrogyf8R9SKRwpCMUS25tn0ZRYsnpXTaiG8XoyVb0062UzM8UF'
app.config['STRIPE_SECRET_KEY'] = 'sk_test_51Kd8ehDYoGpi5znVuhuw2x6b6TefeqVTkRnPblatYafD23XgtQdYMJMJ259xVHLbiNUmY7L4zF9LYuAHLdgOGQWH00viFr0jEC'
stripe.api_key = app.config['STRIPE_SECRET_KEY']

userOrders = db.Table('userOrders',
                      db.Column('purchase_id', db.Integer, db.ForeignKey(
                          'purchase.id'), primary_key=True),
                      db.Column('user_id', db.Integer, db.ForeignKey(
                          'user.id'), primary_key=True)
                      )


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String, nullable=False)
    lastname = db.Column(db.String, nullable=True)
    email = db.Column(db.String, nullable=False)
    is_admin = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    orders = db.relationship('Purchase', backref='order', lazy=True)
    

    def __repr__(self):
        return '<user {}: {} {} {} {} {} {}>'.format(self.id, self.firstname, self.lastname, self.email, self.password_hash, is_admin=self.is_admin)

    def serialize(self):
        return dict(id=self.id, firstname=self.firstname, lastname=self.lastname, email=self.email, is_admin=self.is_admin)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password).decode('utf8')


class Purchase(db.Model):
    __tablename__ = 'purchase'
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.String, nullable=False)
    day = db.Column(db.Integer, nullable=False)
    buyer = db.Column(db.Integer, ForeignKey('user.id'))
    payed = db.Column(db.Boolean, default=False, server_default="false", nullable=True)
    contains = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Purchase {}: {} {} {} {} {} {}>'.format(self.id, self.price, self.year, self.month, self.day, self.payed, self.contains, self.buyer, self.amount)

    def serialize(self):
        return dict(id=self.id, price=self.price, year=self.year, month=self.month, day=self.day, payed=self.payed, contains=self.contains, buyer=self.buyer, amount=self.amount)


class Product(db.Model):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, nullable=False)
    price = 1
    image = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    # typ för att kunna sortera olika produkter
    #resa, pendling, mat, present, mängd, egen
    typ = db.Column(db.String, nullable=True)

    def __repr__(self):
        return '<Product {}: {} {} {} {} {} {}>'.format(self.id, self.amount, self.price, self.name, self.description, self.image, self.typ)

    def serialize(self):
        return dict(id=self.id, amount=self.amount, price=self.price, name=self.name, description=self.description, image=self.image, typ=self.typ)


@app.route('/purchases', methods=['POST', 'GET'])
# @jwt_required()
def purchases():
    if request.method == 'GET':
        all_purchases = []
        purchases = Purchase.query.all()
        for purchase in purchases:
            all_purchases.append(Purchase.serialize(purchase))
        return jsonify(all_purchases)

    elif request.method == 'POST':
        new_purchase = request.get_json()
        x = Purchase()

        if new_purchase.get('price', False):
            x.price = new_purchase['price']

        if new_purchase.get('year', False):
            x.year = new_purchase['year']

        if new_purchase.get('month', False):
            x.month = new_purchase['month']

        if new_purchase.get('day', False):
            x.day = new_purchase['day']

        if new_purchase.get('payed', False):
            x.payed = new_purchase['payed']

        if new_purchase.get('contains', False):
            x.contains = new_purchase['contains']

        if new_purchase.get('buyer', False):
             x.buyer = new_purchase['buyer']

        if new_purchase.get('amount', False):
             x.amount = new_purchase['amount']

        db.session.add(x)
        db.session.commit()

        return Purchase.serialize(x)


@app.route('/products', methods=['POST', 'GET'])
# @jwt_required()
def products():
    if request.method == 'GET':
        all_products = []
        products = Product.query.all()
        for product in products:
            all_products.append(Product.serialize(product))
        return jsonify(all_products)

    elif request.method == 'POST':
        new_product = request.get_json()
        x = Product()
        if new_product.get('amount', False):
            x.amount = new_product['amount']

        if new_product.get('price', False):
            x.price = new_product['price']

        if new_product.get('image', False):
            x.image = new_product['image']
        else:
            x.image = "creativecontent/isberg.jpeg"

        if new_product.get('name', False):
            x.name = new_product['name']

        if new_product.get('description', False):
            x.description = new_product['description']

        if new_product.get('typ', False):
            x.typ = new_product['typ']

        db.session.add(x)
        db.session.commit()

        return Product.serialize(x)


@app.route('/purchases/<int:purchase_id>', methods=['PUT', 'GET', 'DELETE'])
# @jwt_required()
def purchase(purchase_id):
    if request.method == 'GET':
        purchase = Purchase.query.filter_by(id=purchase_id).first_or_404()
        return Purchase.serialize(purchase)

    elif request.method == 'PUT':
        new_purchase = request.get_json()
        x = Purchase.query.filter_by(id = purchase_id).first_or_404()
        if new_purchase.get('price', False):
            x.price = new_purchase['price']

        if new_purchase.get('year', False):
            x.year = new_purchase['year']

        if new_purchase.get('month', False):
            x.month = new_purchase['month']
        
        if new_purchase.get('day', False):
            x.day = new_purchase['day']
        
        if new_purchase.get('payed', False):
            x.payed = new_purchase['payed']

        if new_purchase.get('contains', False):
            x.contains = new_purchase['contains']

        if new_purchase.get('buyer', False):
             x.buyer = new_purchase['buyer']

        db.session.commit()
        return Purchase.serialize(x)

    elif request.method == 'DELETE':
        x = Purchase.query.filter_by(id=purchase_id).first_or_404()
        db.session.delete(x)
        db.session.commit()
        return {}


@app.route('/products/<int:product_id>', methods=['PUT', 'GET', 'DELETE'])
# @jwt_required()
def product(product_id):
    if request.method == 'GET':
        product = Product.query.filter_by(id=product_id).first_or_404()
        return Product.serialize(product)

    elif request.method == 'PUT':
        new_product = request.get_json()
        x = Product.query.filter_by(id=product_id).first_or_404()
        if new_product.get('amount', False):
            x.amount = new_product['amount']

        if new_product.get('price', False):
            x.price = new_product['price']

        if new_product.get('image', False):
            x.image = new_product['image']
        else:
            x.image = "creativecontent/isberg.jpeg"

        if new_product.get('name', False):
            x.name = new_product['name']

        if new_product.get('description', False):
            x.description = new_product['description']

        if new_product.get('typ', False):
            x.typ = new_product['typ']

        db.session.commit()
        return Product.serialize(x)

    elif request.method == 'DELETE':
        x = Product.query.filter_by(id=product_id).first_or_404()
        db.session.delete(x)
        db.session.commit()
        return {}


@app.route('/users', methods=['POST', 'GET'])
# @jwt_required()
def users():
    if request.method == 'GET':
        all_users = []
        users = User.query.all()
        for user in users:
            all_users.append(User.serialize(user))
        return jsonify(all_users)

    elif request.method == 'POST':
        new_user = request.get_json()
        x = User()
        if new_user.get('firstname', False):
            x.firstname = new_user['firstname']

        if new_user.get('lastname', False):
            x.lastname = new_user['lastname']

        if new_user.get('email', False):
            x.email = new_user['email']
        if new_user.get('is_admin', False):
            x.is_admin = new_user('is_admin')

        db.session.add(x)
        db.session.commit()

        return User.serialize(x)

@app.route('/users/<int:user_id>/products')
@jwt_required()
def user_products(user_id):
    products = []
    user = User.query.filter_by(id=user_id).first_or_404()
    for product in user.products:
        products.append(Product.serialize2(product))
    return jsonify([products])

@app.route('/users/<int:users_id>', methods=['PUT', 'GET', 'DELETE'])
# @jwt_required()
def user(users_id):
    if request.method == 'GET':
        user = User.query.filter_by(id=users_id).first_or_404()
        return user.serialize()

    elif request.method == 'PUT':
        new_user = request.get_json()
        x = User.query.filter_by(id=users_id).first_or_404()
        if new_user.get('firstname', False):
            x.firstname = new_user['firstname']

        if new_user.get('lastname', False):
            x.lastname = new_user['lastname']

        # if new_user.get('totalcompensated', False):
        #     x.is_admin = new_user['totalcompansated']    

        if new_user.get('email', False):
            x.email = new_user['email']

        if new_user.get('is_admin', False):
            x.is_admin = new_user['is_admin']

        db.session.commit()
        all_users = []
        # for user in User.query.all() :
        #   all_users.append(User.serialize())

        # if users_id > len(all_users) or users_id == 0 :
        #    abort(404)

        return User.serialize(x)

    elif request.method == 'DELETE':
        x = User.query.filter_by(id=users_id).first_or_404()
        for product in x.products:
            product.owner = None
        db.session.delete(x)
        db.session.commit()
        return {}

@app.route('/users/changepassword/<int:users_id>', methods=['PUT'])
# @jwt_required()
def changepassword(users_id):
    if request.method == 'PUT':
        new_user = request.get_json()
        x = User.query.filter_by(id=users_id).first_or_404()
        if x:
            if new_user.get('oldpassword', False):
                if bcrypt.check_password_hash(x.password_hash, new_user["oldpassword"]):
                    if new_user.get('newpassword', False):
                        User.set_password(x, new_user["newpassword"])
                        db.session.commit()
                        return User.serialize(x)
        return "Invalid", 401


@app.route("/")
def client():
    return app.send_static_file("client.html")


@app.route('/sign-up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        new_sign_up = request.get_json()
        x = User(firstname=new_sign_up["firstname"],
                 lastname=new_sign_up["lastname"], email=new_sign_up["email"])
        User.set_password(x, new_sign_up["password"])
        db.session.add(x)
        db.session.commit()
        return 'ny anvandare tillagd'


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        input = request.get_json()
        x = User.query.filter_by(email=input["email"]).first()

        if x:
            if bcrypt.check_password_hash(x.password_hash, input["password"]):
                access_token = create_access_token(identity=x.serialize())
                dict = {"token": access_token, "user": x.serialize()}
                return jsonify(dict), 200
        return "Invalid", 401


@app.route('/create-checkout-session/<int:purchase_id>')
def create_checkout_session(purchase_id):
    purchase = Purchase.serialize(
        Purchase.query.filter_by(id=purchase_id).first_or_404())
    cart = purchase["contains"]
    print(cart)
    x = 0
    items = []
    while x != -1:
        t = cart.find("id", x)
        if t == -1:
            break
        r = cart.find(",", t)
        productId = cart[t+4:r]

        t = cart.find("count", r)
        r = cart.find("}", t)
        productCount = cart[t+7:r]
        x = r

        items.append({
            'price_data': {
                'currency': 'SEK',
                'product_data': {
                    'name': Product.serialize(Product.query.filter_by(id = int(productId)).first_or_404())["name"],
                },
                'unit_amount': Product.serialize(Product.query.filter_by(id = int(productId)).first_or_404())["price"] * Product.serialize(Product.query.filter_by(id = int(productId)).first_or_404())["amount"] * 100,
                },
            'quantity': int(productCount),
        })

    session = stripe.checkout.Session.create(
        line_items=items,
        mode='payment',

        success_url='http://127.0.0.1:5000/?thankyou' ,
        cancel_url='http://127.0.0.1:5000/',
    )

    print("sessionURL ===== " + session.url)

    return redirect(session.url, code=303)


if __name__ == "__main__":
    app.run(debug=True)
