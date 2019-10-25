/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/index');
const Production = require('../../src/models/production');
const Image = require('../../src/models/image');

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

describe('/api/productions', () => {
    // Wipe images table before tests
    beforeEach((done) => wipeImages(done));

    // Wipe productions table before each test
    beforeEach((done) => wipeProductions(done));

    let productionId;
    let secondProductionId;
    let imageId;
    let secondImageId;

    beforeEach((done) => {
        Production.create({
            title: 'Movie 1',
        })
            .then((production) => {
                productionId = production.id;
                done();
            })
            .catch((err) => done(err));
    });

    beforeEach((done) => {
        Production.create({
            title: 'Movie 2',
        })
            .then((production) => {
                secondProductionId = production.id;
                done();
            })
            .catch((err) => done(err));
    });

    beforeEach((done) => {
        Production.create({
            title: 'Movie 3',
        })
            .then(() => {
                done();
            })
            .catch((err) => done(err));
    });

    beforeEach((done) => {
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

    beforeEach((done) => {
        Image.create({
            url: 'api/uploads/abcd2.png',
            productionId: secondProductionId,
        })
            .then((image) => {
                secondImageId = image.id;
                done();
            })
            .catch((err) => done(err));
    });

    describe('GET /api/productions', () => {
        it('should respond with status 200 and json containing all objects', (done) => {
            request(app)
                .get('/api/productions')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.count).to.be.equal(3);
                    done();
                });
        });

        it('should respond with status 200 and json containing object with the same id as it is in URI', (done) => {
            request(app)
                .get(`/api/productions/${productionId}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(productionId);
                    done();
                });
        });
    });

    describe('POST /api/productions', () => {
        it('should respond with status 201 and json containing new object for regular data', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 90,
                releaseDate: '2014-06-05',
                isSerie: true,
                genre: ['Action', 'Adventure'],
                description: 'Incredible story about 2 people acting in the movie.',
                posterId: imageId,
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.title).to.be.equal(data.title);
                    expect(res.body.length).to.be.equal(data.length);
                    expect(res.body.releaseDate).to.be.equal(data.releaseDate);
                    expect(res.body.isSerie).to.be.equal(data.isSerie);
                    expect(res.body.genre).to.be.eql(data.genre);
                    expect(res.body.description).to.be.equal(data.description);
                    expect(res.body.posterId).to.be.equal(data.posterId);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                title: 'Movie Title 1',
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.title).to.be.equal(data.title);
                    expect(res.body.length).to.be.equal(null);
                    expect(res.body.releaseDate).to.be.equal(null);
                    expect(res.body.isSerie).to.be.equal(null);
                    expect(res.body.genre).to.be.eql(null);
                    expect(res.body.description).to.be.equal(null);
                    expect(res.body.posterId).to.be.equal(null);
                    done();
                });
        });

        // Title

        it('should respond with status 400 and json containing error message because of missing title', (done) => {
            const data = {
                length: 90,
                releaseDate: '2014-06-05',
                isSerie: true,
                genre: ['Action', 'Adventure'],
                description: 'Incredible story about 2 people acting in the movie.',
                posterId: imageId,
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for title that is on the bottom edge of the character limit', (done) => {
            const data = {
                title: 'A', // 1 letter title
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.title).to.be.equal(data.title);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for title that is on the upper edge of the character limit', (done) => {
            const data = {
                title: 'Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Mo', // 100 letter title
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.title).to.be.equal(data.title);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of empty title', (done) => {
            const data = {
                title: '', // empty title
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long title', (done) => {
            const data = {
                title: 'Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Mov', // 101 letter title
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Length

        it('should respond with status 201 and json containing new object for length on the bottom edge of the length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 1, // min length is 1
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.length).to.be.equal(data.length);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for length on the upper edge of the length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 999999, // max length is 999999
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.length).to.be.equal(data.length);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is smaller than length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 0, // min length is 1
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is bigger than length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 1000000, // max length is 999999
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is not an integer', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 90.5, // length is restricted to integer values
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Release Date

        it('should respond with status 201 and json containing new object for release date on the bottom edge of the date limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                releaseDate: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.releaseDate).to.be.equal(data.releaseDate);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because release date is earlier than date limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                releaseDate: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // isSerie

        it('should respond with status 400 and json containing error message because of wrong type of isSerie attribute', (done) => {
            const data = {
                title: 'Movie Title 1',
                isSerie: 'yes', // isSerie is restricted to boolean values
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Genre

        it('should respond with status 201 and json containing new object for empty genre collection', (done) => {
            const data = {
                title: 'Movie Title 1',
                genre: [],
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.genre).to.be.eql(data.genre);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of genre collection element that is not included in genre enum', (done) => {
            const data = {
                title: 'Movie Title 1',
                genre: ['notAGenre', 'Action'],
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Description

        it('should respond with status 201 and json containing new object for description that is on the upper edge of the character limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                description: 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text', // 500 letter description
            };
            request(app)
                .post('/api/productions')
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
                title: 'Movie Title 1',
                description: 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text T', // 501 letter description
            };
            request(app)
                .post('/api/productions')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // PosterId

        it('should respond with status 400 and json containing error message because of posterId that points for non-existent image', (done) => {
            const data = {
                title: 'Movie Title 1',
                posterId: 3, // non-existing posterId
            };
            request(app)
                .post('/api/productions')
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

    describe('PUT /api/productions/:id', () => {
        let id;

        beforeEach((done) => {
            Production.create({
                title: 'Movie Title 2',
                length: 10,
                relaseDate: '2000-01-01',
                isSerie: true,
                genre: ['History', 'Horror'],
                description: 'Description before put operation',
                posterId: secondImageId,
            })
                .then((production) => {
                    id = production.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and json containing new object for regular data', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 90,
                releaseDate: '2014-06-05',
                isSerie: false,
                genre: ['Action', 'Adventure'],
                description: 'Incredible story about 2 people acting in the movie.',
                posterId: imageId,
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.title).to.be.equal(data.title);
                    expect(res.body.length).to.be.equal(data.length);
                    expect(res.body.releaseDate).to.be.equal(data.releaseDate);
                    expect(res.body.isSerie).to.be.equal(data.isSerie);
                    expect(res.body.genre).to.be.eql(data.genre);
                    expect(res.body.description).to.be.equal(data.description);
                    expect(res.body.posterId).to.be.equal(data.posterId);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                title: 'Movie Title 1',
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.title).to.be.equal(data.title);
                    expect(res.body.length).to.be.equal(null);
                    expect(res.body.releaseDate).to.be.equal(null);
                    expect(res.body.isSerie).to.be.equal(false);
                    expect(res.body.genre).to.be.eql(null);
                    expect(res.body.description).to.be.equal(null);
                    expect(res.body.posterId).to.be.equal(null);
                    done();
                });
        });

        // Title

        it('should respond with status 400 and json containing error message because of missing title', (done) => {
            const data = {
                length: 90,
                releaseDate: '2014-06-05',
                isSerie: true,
                genre: ['Action', 'Adventure'],
                description: 'Incredible story about 2 people acting in the movie.',
                posterId: imageId,
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for title that is on the bottom edge of the character limit', (done) => {
            const data = {
                title: 'A', // 1 letter title
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.title).to.be.equal(data.title);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for title that is on the upper edge of the character limit', (done) => {
            const data = {
                title: 'Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Mo', // 100 letter title
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.title).to.be.equal(data.title);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of empty title', (done) => {
            const data = {
                title: '', // empty title
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long title', (done) => {
            const data = {
                title: 'Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Mov', // 101 letter title
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Length

        it('should respond with status 200 and json containing new object for length on the bottom edge of the length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 1, // min length is 1
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.length).to.be.equal(data.length);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for length on the upper edge of the length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 999999, // max length is 999999
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.length).to.be.equal(data.length);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is smaller than length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: -1, // min length is 1, 0 would be converted to null which is accepted
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is bigger than length limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 1000000, // max length is 999999
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is not an integer', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 90.5, // length is restricted to integer values
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Release Date

        it('should respond with status 200 and json containing new object for release date on the bottom edge of the date limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                releaseDate: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.releaseDate).to.be.equal(data.releaseDate);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because release date is earlier than date limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                releaseDate: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // isSerie

        it('should respond with status 200 and json containing new object for isSerie that is set to false by default value', (done) => {
            const data = {
                title: 'Movie Title 1',
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.isSerie).to.be.equal(false);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of wrong type of isSerie attribute', (done) => {
            const data = {
                title: 'Movie Title 1',
                isSerie: 'yes', // isSerie is restricted to boolean values
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Genre

        it('should respond with status 200 and json containing new object for empty genre collection', (done) => {
            const data = {
                title: 'Movie Title 1',
                genre: [],
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.genre).to.be.eql(data.genre);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of genre collection element that is not included in genre enum', (done) => {
            const data = {
                title: 'Movie Title 1',
                genre: ['notAGenre', 'Action'],
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Description

        it('should respond with status 200 and json containing new object for description that is on the upper edge of the character limit', (done) => {
            const data = {
                title: 'Movie Title 1',
                description: 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text', // 500 letter description
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.description).to.be.equal(data.description);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long description', (done) => {
            const data = {
                title: 'Movie Title 1',
                description: 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text T', // 501 letter description
            };
            request(app)
                .put(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // PosterId

        it('should respond with status 400 and json containing error message because of posterId that points for non-existent image', (done) => {
            const data = {
                title: 'Movie Title 1',
                posterId: 3, // non-existing posterId
            };
            request(app)
                .put(`/api/productions/${id}`)
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

    describe('PATCH /api/productions/:id', () => {
        let id;

        beforeEach((done) => {
            Production.create({
                title: 'Movie Title 2',
                length: 10,
                relaseDate: '2000-01-01',
                isSerie: true,
                genre: ['History', 'Horror'],
                description: 'Description before put operation',
                posterId: secondImageId,
            })
                .then((production) => {
                    id = production.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 204 for regular data', (done) => {
            const data = {
                title: 'Movie Title 1',
                length: 90,
                releaseDate: '2014-06-05',
                isSerie: false,
                genre: ['Action', 'Adventure'],
                description: 'Incredible story about 2 people acting in the movie.',
                posterId: imageId,
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                title: 'Movie Title 1',
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        // Title

        it('should respond with status 204 for title that is on the bottom edge of the character limit', (done) => {
            const data = {
                title: 'A', // 1 letter title
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for title that is on the upper edge of the character limit', (done) => {
            const data = {
                title: 'Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Mo', // 100 letter title
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of empty title', (done) => {
            const data = {
                title: '', // empty title
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long title', (done) => {
            const data = {
                title: 'Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Movie Title 1 Mov', // 101 letter title
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Length

        it('should respond with status 204 for length on the bottom edge of the length limit', (done) => {
            const data = {
                length: 1, // min length is 1
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for length on the upper edge of the length limit', (done) => {
            const data = {
                length: 999999, // max length is 999999
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because length is smaller than length limit', (done) => {
            const data = {
                length: 0, // min length is 1
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is bigger than length limit', (done) => {
            const data = {
                length: 1000000, // max length is 999999
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because length is not an integer', (done) => {
            const data = {
                length: 90.5, // length is restricted to integer values
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Release Date

        it('should respond with status 204 for release date on the bottom edge of the date limit', (done) => {
            const data = {
                releaseDate: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because release date is earlier than date limit', (done) => {
            const data = {
                releaseDate: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // isSerie

        it('should respond with status 204 for isSerie that is set to false by default value', (done) => {
            const data = {
                title: 'Movie Title 1',
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of wrong type of isSerie attribute', (done) => {
            const data = {
                isSerie: 'yes', // isSerie is restricted to boolean values
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Genre

        it('should respond with status 204 for empty genre collection', (done) => {
            const data = {
                genre: [],
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of genre collection element that is not included in genre enum', (done) => {
            const data = {
                genre: ['notAGenre', 'Action'],
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Description

        it('should respond with status 204 for description that is on the upper edge of the character limit', (done) => {
            const data = {
                description: 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text', // 500 letter description
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of too long description', (done) => {
            const data = {
                description: 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text '
                    + 'Text Text Text Text Text Text Text Text Text Text T', // 501 letter description
            };
            request(app)
                .patch(`/api/productions/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // PosterId

        it('should respond with status 400 and json containing error message because of posterId that points for non-existent image', (done) => {
            const data = {
                title: 'Movie Title 1',
                posterId: 3, // non-existing posterId
            };
            request(app)
                .patch(`/api/productions/${id}`)
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

    describe('DELETE /api/productions', () => {
        let id;

        beforeEach((done) => {
            Production.create({
                title: 'Movie Title 1',
                length: 90,
                releaseDate: '2014-06-05',
                isSerie: false,
                genre: ['Action', 'Adventure'],
                description: 'Incredible story about 2 people acting in the movie.',
                posterId: imageId,
            })
                .then((production) => {
                    id = production.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and remove object from database', (done) => {
            request(app)
                .delete(`/api/productions/${id}`)
                .expect(200)
                .then(() => {
                    Production.findByPk(id)
                        .then((production) => {
                            expect(production).to.be.null;
                            done();
                        });
                });
        });
    });

    // Wipe productions table after all tests
    after((done) => wipeProductions(done));

    // Wipe images table after all tests
    after((done) => wipeImages(done));
});
