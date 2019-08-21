const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../src/index');
const Person = require('../../src/models/person');
const Production = require('../../src/models/production');
const ProductionPerson = require('../../src/models/productionPerson');

const wipeProductionsPeople = (done) => {
    ProductionPerson.destroy({
            truncate: true,
            cascade: true,
            restartIdentity: true
        })
        .then(() => {
            done();
        })
        .catch(err => console.log(err));
}

const wipeProductions = (done) => {
    Production.destroy({
            truncate: true,
            cascade: true,
            restartIdentity: true
        })
        .then(() => {
            done();
        })
        .catch(err => console.log(err));
}

const wipePeople = (done) => {
    Person.destroy({
            truncate: true,
            cascade: true,
            restartIdentity: true
        })
        .then(() => {
            done();
        })
        .catch(err => console.log(err));
}

describe('/production-person', () => {

    let productionId;
    let secondProductionId;
    let personId;
    let secondPersonId;

    // Wipe productions-people table before each test
    beforeEach((done) => wipeProductionsPeople(done));

    before((done) => {
        Production.create({
            title: "Movie Title 1"
        })
        .then(production => {
            productionId = production.id
            done();
        })
        .catch(err => console.log(err));
    })

    before((done) => {
        Production.create({
            title: "Movie Title 2"
        })
        .then(production => {
            secondProductionId = production.id
            done();
        })
        .catch(err => console.log(err));
    })

    before((done) => {
        Person.create({
            name: "John Doe 1"
        })
        .then(person => {
            personId = person.id
            done();
        })
        .catch(err => console.log(err));
    })

    before((done) => {
        Person.create({
            name: "John Doe 2"
        })
        .then(person => {
            secondPersonId = person.id
            done();
        })
        .catch(err => console.log(err));
    })

    describe('GET /productions-people', () => {

        let id;

        beforeEach((done) => {
            ProductionPerson.create({
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Anthony"
            })
            .then(productionPerson => {
                done();
            })
            .catch(err => console.log(err));
        });

        beforeEach((done) => {
            ProductionPerson.create({
                productionId: productionId,
                personId: secondPersonId,
                role: "Actor",
                description: "Bobby"
            })
            .then(productionPerson => {
                id = productionPerson.id;
                done();
            })
            .catch(err => console.log(err));
        });

        beforeEach((done) => {
            ProductionPerson.create({
                productionId: secondProductionId,
                personId: personId,
                role: "Writer"
            })
            .then(productionPerson => {
                done();
            })
            .catch(err => console.log(err));
        });

        it('should respond with status 200 and json containing all objects', (done) => {
            request(app)
                .get('/productions-people')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.length).to.be.equal(3);
                    done();
                });
        });

        it('should respond with status 200 and json containing object with the same id as it is in the URI', (done) => {
            request(app)
                .get('/productions-people/' + id)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    done();
                });
        });

    });

    describe('POST /productions-people', () => {

        it('should respond with status 201 and json containing new object for regular data', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Adam"
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(data.productionId);
                    expect(res.body.personId).to.be.equal(data.personId);
                    expect(res.body.role).to.be.equal(data.role);
                    expect(res.body.description).to.be.equal(data.description);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor"
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(data.productionId);
                    expect(res.body.personId).to.be.equal(data.personId);
                    expect(res.body.role).to.be.equal(data.role);
                    expect(res.body.description).to.be.equal(null);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because object with the same key {productionId, personId, role} already exists', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor"
            };

            ProductionPerson.create(data)
            .then(productionPerson => {
                request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
            })
            .catch(err => console.log(err));
        });

        it('should respond with status 400 and json containing error message because of productionId that points for non-existent production', (done) => {
            const data = {
                productionId: 3,
                personId: personId,
                role: "Actor"
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of personId that points for non-existent person', (done) => {
            const data = {
                productionId: productionId,
                personId: 3,
                role: "Actor"
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing productionId', (done) => {
            const data = {
                personId: personId,
                role: "Actor"
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing personId', (done) => {
            const data = {
                productionId: productionId,
                role: "Actor"
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing role attribute', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of role that is not included in role enum', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "NotARole",
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for description that is on the upper edge of the character limit', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Text Text Text Text Text Text Text Text Text Text " // 50 letter description
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.description).to.be.equal(data.description);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long description', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Text Text Text Text Text Text Text Text Text Text T" // 51 letter description
            };
            request(app)
                .post('/productions-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

    });

    describe('PUT /productions-people', () => {

        let id;

        beforeEach((done) => {
            ProductionPerson.create({
                productionId: secondProductionId,
                personId: secondPersonId,
                role: "Writer",
                description: "Text"
            })
            .then(productionPerson => {
                id = productionPerson.id;
                done();
            })
            .catch(err => console.log(err));
        });

        it('should respond with status 200 and json containing new object for regular data', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Adam"
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(data.productionId);
                    expect(res.body.personId).to.be.equal(data.personId);
                    expect(res.body.role).to.be.equal(data.role);
                    expect(res.body.description).to.be.equal(data.description);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor"
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(data.productionId);
                    expect(res.body.personId).to.be.equal(data.personId);
                    expect(res.body.role).to.be.equal(data.role);
                    expect(res.body.description).to.be.equal(null);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because object with the same key {productionId, personId, role} already exists', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor"
            };

            ProductionPerson.create(data)
            .then(productionPerson => {
                request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
            })
            .catch(err => console.log(err));
        });

        it('should respond with status 400 and json containing error message because of productionId that points for non-existent production', (done) => {
            const data = {
                productionId: 3,
                personId: personId,
                role: "Actor"
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of personId that points for non-existent person', (done) => {
            const data = {
                productionId: productionId,
                personId: 3,
                role: "Actor"
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing productionId', (done) => {
            const data = {
                personId: personId,
                role: "Actor"
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing personId', (done) => {
            const data = {
                productionId: productionId,
                role: "Actor"
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing role attribute', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of role that is not included in role enum', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "NotARole",
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for description that is on the upper edge of the character limit', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Text Text Text Text Text Text Text Text Text Text " // 50 letter description
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.description).to.be.equal(data.description);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long description', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Text Text Text Text Text Text Text Text Text Text T" // 51 letter description
            };
            request(app)
                .put('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

    });

    describe('PATCH /productions-people', () => {

        let id;

        beforeEach((done) => {
            ProductionPerson.create({
                productionId: secondProductionId,
                personId: secondPersonId,
                role: "Writer",
                description: "Text"
            })
            .then(productionPerson => {
                id = productionPerson.id;
                done();
            })
            .catch(err => console.log(err));
        });

        it('should respond with status 204 for regular data', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Adam"
            };
            request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor"
            };
            request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect(204, done);

        });

        it('should respond with status 400 and json containing error message because object with the same key {productionId, personId, role} already exists', (done) => {
            const data = {
                productionId: productionId,
                personId: personId,
                role: "Actor"
            };

            ProductionPerson.create(data)
            .then(productionPerson => {
                request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
            })
            .catch(err => console.log(err));
        });

        it('should respond with status 400 and json containing error message because of productionId that points for non-existent production', (done) => {
            const data = {
                productionId: 3
            };
            request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of personId that points for non-existent person', (done) => {
            const data = {
                personId: 3
            };
            request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of role that is not included in role enum', (done) => {
            const data = {
                role: "NotARole"
            };
            request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 204 for description that is on the upper edge of the character limit', (done) => {
            const data = {
                description: "Text Text Text Text Text Text Text Text Text Text " // 50 letter description
            };
            request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of too long description', (done) => {
            const data = {
                description: "Text Text Text Text Text Text Text Text Text Text T" // 51 letter description
            };
            request(app)
                .patch('/productions-people/' + id)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

    });

    describe('DELETE /productions-people', () => {

        let id;

        beforeEach((done) => {
            ProductionPerson.create({
                productionId: productionId,
                personId: personId,
                role: "Actor",
                description: "Adam"
            })
            .then(productionPerson => {
                id = productionPerson.id;
                done();
            })
            .catch(err => console.log(err));
        });

        it('should respond with status 200 and remove object from database', (done) => {
            request(app)
                .delete('/productions-people/' + id)
                .expect(200)
                .then(() => {
                    ProductionPerson.findByPk(id)
                        .then(productionPerson => {
                            expect(productionPerson).to.be.null;
                            done();
                        })
                });
        });

    });

    // Wipe people table after all tests
    after((done) => wipeProductionsPeople(done));

    // Wipe people table after all tests
    after((done) => wipeProductions(done));

    // Wipe people table after all tests
    after((done) => wipePeople(done));

});