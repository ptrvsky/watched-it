/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../../src/index');
const Image = require('../../src/models/image');
const Production = require('../../src/models/production');

const directory = process.env.DEVELOPMENT_UPLOADS_DIRECTORY;

const wipeUploads = (done) => {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
            fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
            });
        });
        done();
    });
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

describe('/images', () => {
    let productionId;
    let secondProductionId;

    // Wipe images table before each test
    beforeEach((done) => wipeImages(done));

    // Wipe uploads directory before each test
    beforeEach((done) => wipeUploads(done));

    // Wipe productions table before each test
    before((done) => wipeProductions(done));

    before((done) => {
        Production.create({
            title: 'Movie Title 1',
        })
            .then((production) => {
                productionId = production.id;
                done();
            })
            .catch((err) => done(err));
    });

    before((done) => {
        Production.create({
            title: 'Movie Title 2',
        })
            .then((production) => {
                secondProductionId = production.id;
                done();
            })
            .catch((err) => done(err));
    });

    describe('GET /images', () => {
        let imageId;

        beforeEach((done) => {
            Image.create({
                url: 'update/abcd1.png',
                productionId,
            })
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });

        beforeEach((done) => {
            Image.create({
                url: 'update/abcd2.png',
                productionId,
            })
                .then((image) => {
                    imageId = image.id;
                    done();
                })
                .catch((err) => done(err));
        });

        beforeEach((done) => {
            Image.create({
                url: 'update/abcd3.png',
                productionId,
            })
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and json containing all objects', (done) => {
            request(app)
                .get('/images')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.length).to.be.equal(3);
                    done();
                });
        });

        it('should respond with status 200 and json containing object with the same id as it is in URI', (done) => {
            request(app)
                .get(`/images/${imageId}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(imageId);
                    done();
                });
        });
    });

    describe('POST /images', () => {
        it('should respond with status 201 and json containing new object for regular data with .png image', (done) => {
            request(app)
                .post('/images')
                .attach('image', './tests/test-files/testImage.png')
                .field('productionId', productionId)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(productionId);
                    fs.readdir(directory, (err, files) => {
                        if (err) return done(err);
                        expect(files.length).to.be.greaterThan(0);
                    });
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for regular data with .jpeg image', (done) => {
            request(app)
                .post('/images')
                .attach('image', './tests/test-files/testImage.jpeg')
                .field('productionId', productionId)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(productionId);
                    fs.readdir(directory, (err, files) => {
                        if (err) return done(err);
                        expect(files.length).to.be.greaterThan(0);
                    });
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for regular data with .jpg image', (done) => {
            request(app)
                .post('/images')
                .attach('image', './tests/test-files/testImage.jpg')
                .field('productionId', productionId)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(productionId);
                    fs.readdir(directory, (err, files) => {
                        if (err) return done(err);
                        expect(files.length).to.be.greaterThan(0);
                    });
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of wrong type image file', (done) => {
            request(app)
                .post('/images')
                .attach('image', './tests/test-files/testFile.txt')
                .field('productionId', productionId)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing image file', (done) => {
            request(app)
                .post('/images')
                .field('productionId', productionId)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing arguments', (done) => {
            request(app)
                .post('/images')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });


        it('should respond with status 400 and json containing error message because of missing productionId', (done) => {
            request(app)
                .post('/images')
                .attach('image', './tests/test-files/testImage.png')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of productionId that points for non-existent production', (done) => {
            request(app)
                .post('/images')
                .attach('image', './tests/test-files/testImage.png')
                .field('productionId', 3)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });
    });

    describe('PUT /images/:id', () => {
        let imageId;

        beforeEach((done) => {
            Image.create({
                url: 'update/abcd1.png',
                productionId,
            })
                .then((image) => {
                    imageId = image.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and json containing new object for regular data with .png image', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .attach('image', './tests/test-files/testImage.png')
                .field('productionId', secondProductionId)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(secondProductionId);
                    fs.readdir(directory, (err, files) => {
                        if (err) return done(err);
                        expect(files.length).to.be.greaterThan(0);
                    });
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for regular data with .jpeg image', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .attach('image', './tests/test-files/testImage.jpeg')
                .field('productionId', secondProductionId)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(secondProductionId);
                    fs.readdir(directory, (err, files) => {
                        if (err) return done(err);
                        expect(files.length).to.be.greaterThan(0);
                    });
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for regular data with .jpg image', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .attach('image', './tests/test-files/testImage.jpg')
                .field('productionId', secondProductionId)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.productionId).to.be.equal(secondProductionId);
                    fs.readdir(directory, (err, files) => {
                        if (err) return done(err);
                        expect(files.length).to.be.greaterThan(0);
                    });
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of wrong type image file', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .attach('image', './tests/test-files/testFile.txt')
                .field('productionId', secondProductionId)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing image file', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .field('productionId', secondProductionId)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of missing arguments', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });


        it('should respond with status 400 and json containing error message because of missing productionId', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .attach('image', './tests/test-files/testImage.png')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of productionId that points for non-existent production', (done) => {
            request(app)
                .put(`/images/${imageId}`)
                .attach('image', './tests/test-files/testImage.png')
                .field('productionId', 3)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });
    });

    describe('PATCH /images/:id', () => {
        let imageId;

        beforeEach((done) => {
            Image.create({
                url: 'update/abcd1.png',
                productionId,
            })
                .then((image) => {
                    imageId = image.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 204 for regular data', (done) => {
            request(app)
                .patch(`/images/${imageId}`)
                .field('productionId', secondProductionId)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of productionId that points for non-existent production', (done) => {
            request(app)
                .patch(`/images/${imageId}`)
                .send({
                    productionId: 3,
                })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });
    });

    describe('DELETE /images', () => {
        let imageId;

        beforeEach((done) => {
            Image.create({
                url: 'update/abcd2.png',
                productionId,
            })
                .then((image) => {
                    imageId = image.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and remove object from database', (done) => {
            request(app)
                .delete(`/images/${imageId}`)
                .expect(200)
                .then(() => {
                    Image.findByPk(imageId)
                        .then((image) => {
                            expect(image).to.be.null;
                            done();
                        });
                });
        });
    });

    // Wipe images table after all tests
    after((done) => wipeImages(done));

    // Wipe productions table after all tests
    after((done) => wipeProductions(done));

    // Wipe uploads directory after all tests
    after((done) => wipeUploads(done));
});
