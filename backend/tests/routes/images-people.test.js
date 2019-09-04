/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/index');
const Production = require('../../src/models/production');
const Person = require('../../src/models/person');
const Image = require('../../src/models/image');
const ImagePerson = require('../../src/models/imagePerson');

const wipeImagesPeople = (done) => {
    ImagePerson.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    })
        .then(() => {
            done();
        })
        .catch((err) => done(err));
};

const wipeImages = (done) => {
    Image.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    })
        .then(() => {
            done();
        })
        .catch((err) => done(err));
};

const wipePeople = (done) => {
    Person.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    })
        .then(() => {
            done();
        })
        .catch((err) => done(err));
};

const wipeProductions = (done) => {
    Production.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    })
        .then(() => {
            done();
        })
        .catch((err) => done(err));
};

describe('/api/images-people', () => {
    let personId;
    let secondPersonId;
    let imageId;
    let secondImageId;
    let productionId;

    // Wipe images-people table before each test
    beforeEach((done) => wipeImagesPeople(done));

    before((done) => {
        Production.create({
            title: 'Movie Title',
        })
            .then((production) => {
                productionId = production.id;
                done();
            })
            .catch((err) => done(err));
    });

    before((done) => {
        Image.create({
            url: 'api/uploads/abcd1.png',
            productionId,
        })
            .then((image) => {
                imageId = image.id;
                done();
            })
            .catch((err) => done(err));
    });

    before((done) => {
        Image.create({
            url: 'api/uploads/abcd2.png',
            productionId,
        })
            .then((image) => {
                secondImageId = image.id;
                done();
            })
            .catch((err) => done(err));
    });

    before((done) => {
        Person.create({
            name: 'John Doe 1',
        })
            .then((person) => {
                personId = person.id;
                done();
            })
            .catch((err) => done(err));
    });

    before((done) => {
        Person.create({
            name: 'John Doe 2',
        })
            .then((person) => {
                secondPersonId = person.id;
                done();
            })
            .catch((err) => done(err));
    });

    describe('GET /api/images-people', () => {
        let id;

        beforeEach((done) => {
            ImagePerson
                .create({
                    imageId,
                    personId,
                })
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });

        beforeEach((done) => {
            ImagePerson
                .create({
                    imageId,
                    personId: secondPersonId,
                })
                .then((imagePerson) => {
                    id = imagePerson.id;
                    done();
                })
                .catch((err) => done(err));
        });

        beforeEach((done) => {
            ImagePerson
                .create({
                    imageId: secondImageId,
                    personId,
                })
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and json containing all objects', (done) => {
            request(app)
                .get('/api/images-people')
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
                .get(`/api/images-people/${id}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    done();
                });
        });
    });

    describe('POST /api/images-people', () => {
        it('should respond with status 201 and json containing new object for regular data', (done) => {
            const data = {
                imageId,
                personId,
            };
            request(app)
                .post('/api/images-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.imageId).to.be.equal(data.imageId);
                    expect(res.body.personId).to.be.equal(data.personId);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because object with the same key {imageId, personId} already exists', (done) => {
            const data = {
                imageId,
                personId,
            };

            ImagePerson.create(data)
                .then(() => {
                    request(app)
                        .post('/api/images-people')
                        .send(data)
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body).to.haveOwnProperty('error');
                            done();
                        });
                })
                .catch((err) => done(err));
        });

        it('should respond with status 400 and json containing error message because of imageId that points for non-existent image', (done) => {
            const data = {
                imageId: 3,
                personId,
            };
            request(app)
                .post('/api/images-people')
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
                imageId,
                personId: 3,
            };
            request(app)
                .post('/api/images-people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing imageId', (done) => {
            const data = {
                personId,
            };
            request(app)
                .post('/api/images-people')
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
                imageId,
            };
            request(app)
                .post('/api/images-people')
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

    describe('PUT /api/images-people', () => {
        let id;

        beforeEach((done) => {
            ImagePerson.create({
                imageId: secondImageId,
                personId: secondPersonId,
            })
                .then((imagePerson) => {
                    id = imagePerson.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and json containing new object for regular data', (done) => {
            const data = {
                imageId,
                personId,
            };
            request(app)
                .put(`/api/images-people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.imageId).to.be.equal(data.imageId);
                    expect(res.body.personId).to.be.equal(data.personId);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because object with the same key {imageId, personId} already exists', (done) => {
            const data = {
                imageId,
                personId,
            };

            ImagePerson.create(data)
                .then(() => {
                    request(app)
                        .put(`/api/images-people/${id}`)
                        .send(data)
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body).to.haveOwnProperty('error');
                            done();
                        });
                })
                .catch((err) => done(err));
        });

        it('should respond with status 400 and json containing error message because of imageId that points for non-existent image', (done) => {
            const data = {
                imageId: 3,
                personId,
            };
            request(app)
                .put(`/api/images-people/${id}`)
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
                imageId,
                personId: 3,
            };
            request(app)
                .put(`/api/images-people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing imageId', (done) => {
            const data = {
                personId,
            };
            request(app)
                .put(`/api/images-people/${id}`)
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
                imageId,
            };
            request(app)
                .put(`/api/images-people/${id}`)
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

    describe('PATCH /api/images-people', () => {
        let id;

        beforeEach((done) => {
            ImagePerson.create({
                imageId: secondImageId,
                personId: secondPersonId,
            })
                .then((imagePerson) => {
                    id = imagePerson.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 204 for regular data', (done) => {
            const data = {
                imageId,
                personId,
            };
            request(app)
                .patch(`/api/images-people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because object with the same key {imageId, personId} already exists', (done) => {
            const data = {
                imageId,
                personId,
            };

            ImagePerson
                .create(data)
                .then(() => {
                    request(app)
                        .patch(`/api/images-people/${id}`)
                        .send(data)
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body).to.haveOwnProperty('error');
                            done();
                        });
                })
                .catch((err) => done(err));
        });

        it('should respond with status 400 and json containing error message because of imageId that points for non-existent image', (done) => {
            const data = {
                imageId: 3,
                personId,
            };
            request(app)
                .patch(`/api/images-people/${id}`)
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
                imageId,
                personId: 3,
            };
            request(app)
                .patch(`/api/images-people/${id}`)
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

    describe('DELETE /api/images-people', () => {
        let id;

        beforeEach((done) => {
            ImagePerson.create({
                imageId,
                personId,
            })
                .then((imagePerson) => {
                    id = imagePerson.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and remove object from database', (done) => {
            request(app)
                .delete(`/api/images-people/${id}`)
                .expect(200)
                .then(() => {
                    ImagePerson
                        .findByPk(id)
                        .then((imagePerson) => {
                            expect(imagePerson).to.be.null;
                            done();
                        });
                });
        });
    });

    // Wipe images-people table after all tests
    after((done) => wipeImagesPeople(done));

    // Wipe images table after all tests
    after((done) => wipeImages(done));

    // Wipe people table after all tests
    after((done) => wipePeople(done));

    // Wipe productions table after all tests
    after((done) => wipeProductions(done));
});
