/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/index');
const Person = require('../../src/models/person');

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

describe('/api/people', () => {
    // Wipe people table before each test
    beforeEach((done) => wipePeople(done));

    describe('GET /api/people', () => {
        let id;

        beforeEach((done) => {
            Person.create({
                name: 'John Doe',
            })
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });

        beforeEach((done) => {
            Person.create({
                name: 'John Doe 2',
            })
                .then((person) => {
                    id = person.id;
                    done();
                })
                .catch((err) => done(err));
        });

        beforeEach((done) => {
            Person.create({
                name: 'John Doe 3',
            })
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and json containing all objects', (done) => {
            request(app)
                .get('/api/people')
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
                .get(`/api/people/${id}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    done();
                });
        });
    });

    describe('POST /api/people', () => {
        it('should respond with status 201 and json containing new object for regular data', (done) => {
            const data = {
                name: 'John Doe',
                dob: '1934-06-05',
                dod: '1985-08-13',
                birthplace: 'London, United Kingdom',
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.name).to.be.equal(data.name);
                    expect(res.body.dob).to.be.equal(data.dob);
                    expect(res.body.dod).to.be.equal(data.dod);
                    expect(res.body.birthplace).to.be.equal(data.birthplace);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                name: 'John Doe',
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.name).to.be.equal(data.name);
                    expect(res.body.dob).to.be.equal(null);
                    expect(res.body.dod).to.be.equal(null);
                    expect(res.body.birthplace).to.be.equal(null);
                    done();
                });
        });

        // Name

        it('should respond with status 400 and json containing error message because of missing name', (done) => {
            const data = {
                dob: '1934-06-05',
                dod: '1985-08-13',
                birthplace: 'London, United Kingdom',
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for name that is on the bottom edge of the character limit', (done) => {
            const data = {
                name: 'Jo', // 2 letter name
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.name).to.be.equal(data.name);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for name that is on the upper edge of the character limit', (done) => {
            const data = {
                name: 'John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn D', // 70 letter name
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.name).to.be.equal(data.name);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too short name', (done) => {
            const data = {
                name: 'J', // 1 letter name
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long name', (done) => {
            const data = {
                name: 'John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn Do', // 71 letter name
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // DOB

        it('should respond with status 201 and json containing new object for DOB on the bottom edge of the date limit', (done) => {
            const data = {
                name: 'John Doe',
                dob: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.dob).to.be.equal(data.dob);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for DOB on the upper edge of the date limit', (done) => {
            const now = new Date();
            const data = {
                name: 'John Doe',
                dob: `${now.getFullYear()}-${(`0${now.getMonth()}`).slice(-2)}-${(`0${now.getDate()}`).slice(-2)}`, // today's date in format YYYY-MM-DD
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.dob).to.be.equal(data.dob);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOB is earlier than date limit', (done) => {
            const data = {
                name: 'John Doe',
                dob: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOB is later than date limit', (done) => {
            const tomorrow = new Date().setDate(new Date().getDate() + 1);
            const data = {
                name: 'John Doe',
                dob: tomorrow, // max date is today's date
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // DOD

        it('should respond with status 201 and json containing new object for DOD on the bottom edge of the date limit', (done) => {
            const data = {
                name: 'John Doe',
                dod: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.dod).to.be.equal(data.dod);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for DOD on the upper edge of the date limit', (done) => {
            const now = new Date();
            const data = {
                name: 'John Doe',
                dod: `${now.getFullYear()}-${(`0${now.getMonth()}`).slice(-2)}-${(`0${now.getDate()}`).slice(-2)}`, // today's date in format YYYY-MM-DD
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.dod).to.be.equal(data.dod);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOD is earlier than date limit', (done) => {
            const data = {
                name: 'John Doe',
                dod: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOD is later than date limit', (done) => {
            const tomorrow = new Date().setDate(new Date().getDate() + 1);
            const data = {
                name: 'John Doe',
                dod: tomorrow, // max date is today's date
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Birthplace

        it('should respond with status 201 and json containing new object for birthplace that is on the bottom edge of the character limit', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'Lo', // 2 letter birthplace
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.birthplace).to.be.equal(data.birthplace);
                    done();
                });
        });

        it('should respond with status 201 and json containing new object for birthplace that is on the upper edge of the character limit', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'London, United KingdomLondon, United KingdomLondon, United KingdomLond', // 70 character birthplace
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.birthplace).to.be.equal(data.birthplace);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too short birthplace', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'L', // 1 letter birthplace
            };
            request(app)
                .post('/api/people')
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long birthplace', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'London, United KingdomLondon, United KingdomLondon, United KingdomLondo', // 71 letter birthplace
            };
            request(app)
                .post('/api/people')
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

    describe('PUT /api/people/:id', () => {
        let id;

        beforeEach((done) => {
            Person.create({
                name: 'John Doe',
                dob: '2000-01-01',
                dod: '2000-01-01',
                birthplace: 'London, United Kingdom',
            })
                .then((person) => {
                    id = person.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and json containing new object for regular data', (done) => {
            const data = {
                name: 'Ben Smith',
                dob: '1934-06-05',
                dod: '1985-08-13',
                birthplace: 'Paris, France',
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.name).to.be.equal(data.name);
                    expect(res.body.dob).to.be.equal(data.dob);
                    expect(res.body.dod).to.be.equal(data.dod);
                    expect(res.body.birthplace).to.be.equal(data.birthplace);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                name: 'Ben Smith',
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.name).to.be.equal(data.name);
                    expect(res.body.dob).to.be.equal(null);
                    expect(res.body.dod).to.be.equal(null);
                    expect(res.body.birthplace).to.be.equal(null);
                    done();
                });
        });

        // Name

        it('should respond with status 400 and json containing error message because of missing name', (done) => {
            const data = {
                dob: '1934-06-05',
                dod: '1985-08-13',
                birthplace: 'Paris, France',
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for name that is on the bottom edge of the character limit', (done) => {
            const data = {
                name: 'Jo', // 2 letter name
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.name).to.be.equal(data.name);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for name that is on the upper edge of the character limit', (done) => {
            const data = {
                name: 'John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn D', // 70 letter name
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.name).to.be.equal(data.name);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too short name', (done) => {
            const data = {
                name: 'J', // 1 letter name
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long name', (done) => {
            const data = {
                name: 'John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn Do', // 71 letter name
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // DOB

        it('should respond with status 200 and json containing new object for DOB on the bottom edge of the date limit', (done) => {
            const data = {
                name: 'John Doe',
                dob: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.dob).to.be.equal(data.dob);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for DOB on the upper edge of the date limit', (done) => {
            const now = new Date();
            const data = {
                name: 'John Doe',
                dob: `${now.getFullYear()}-${(`0${now.getMonth()}`).slice(-2)}-${(`0${now.getDate()}`).slice(-2)}`, // today's date in format YYYY-MM-DD
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.dob).to.be.equal(data.dob);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOB is earlier than date limit', (done) => {
            const data = {
                name: 'John Doe',
                dob: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOB is later than date limit', (done) => {
            const tomorrow = new Date().setDate(new Date().getDate() + 1);
            const data = {
                name: 'John Doe',
                dob: tomorrow, // max date is today's date
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // DOD

        it('should respond with status 200 and json containing new object for DOD on the bottom edge of the date limit', (done) => {
            const data = {
                name: 'John Doe',
                dod: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.dod).to.be.equal(data.dod);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for DOD on the upper edge of the date limit', (done) => {
            const now = new Date();
            const data = {
                name: 'John Doe',
                dod: `${now.getFullYear()}-${(`0${now.getMonth()}`).slice(-2)}-${(`0${now.getDate()}`).slice(-2)}`, // today's date in format YYYY-MM-DD
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.dod).to.be.equal(data.dod);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOD is earlier than date limit', (done) => {
            const data = {
                name: 'John Doe',
                dod: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOD is later than date limit', (done) => {
            const tomorrow = new Date().setDate(new Date().getDate() + 1);
            const data = {
                name: 'John Doe',
                dod: tomorrow, // max date is today's date
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Birthplace

        it('should respond with status 200 and json containing new object for birthplace that is on the bottom edge of the character limit', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'Lo', // 2 letter birthplace
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.birthplace).to.be.equal(data.birthplace);
                    done();
                });
        });

        it('should respond with status 200 and json containing new object for birthplace that is on the upper edge of the character limit', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'London, United KingdomLondon, United KingdomLondon, United KingdomLond', // 70 character birthplace
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.id).to.be.equal(id);
                    expect(res.body.birthplace).to.be.equal(data.birthplace);
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too short birthplace', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'L', // 1 letter birthplace
            };
            request(app)
                .put(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long birthplace', (done) => {
            const data = {
                name: 'John Doe',
                birthplace: 'London, United KingdomLondon, United KingdomLondon, United KingdomLondo', // 71 letter birthplace
            };
            request(app)
                .put(`/api/people/${id}`)
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

    describe('PATCH /api/people/:id', () => {
        let id;

        beforeEach((done) => {
            Person.create({
                name: 'John Doe',
                dob: '2000-01-01',
                dod: '2000-01-01',
                birthplace: 'London, United Kingdom',
            })
                .then((person) => {
                    id = person.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 204 for regular data', (done) => {
            const data = {
                name: 'Ben Smith',
                dob: '1934-06-05',
                dod: '1985-08-13',
                birthplace: 'Paris, France',
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for data that doesn\'t contain unrequired properties', (done) => {
            const data = {
                name: 'Ben Smith',
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        // Name

        it('should respond with status 204 for name that is on the bottom edge of the character limit', (done) => {
            const data = {
                name: 'Jo', // 2 letter name
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for name that is on the upper edge of the character limit', (done) => {
            const data = {
                name: 'John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn D', // 70 letter name
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of too short name', (done) => {
            const data = {
                name: 'J', // 1 letter name
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long name', (done) => {
            const data = {
                name: 'John DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn DoeJohn Do', // 71 letter name
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // DOB

        it('should respond with status 204 for DOB on the bottom edge of the date limit', (done) => {
            const data = {
                dob: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for DOB on the upper edge of the date limit', (done) => {
            const now = new Date();
            const data = {
                dob: `${now.getFullYear()}-${(`0${now.getMonth()}`).slice(-2)}-${(`0${now.getDate()}`).slice(-2)}`, // today's date in format YYYY-MM-DD
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because DOB is earlier than date limit', (done) => {
            const data = {
                dob: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOB is later than date limit', (done) => {
            const tomorrow = new Date().setDate(new Date().getDate() + 1);
            const data = {
                dob: tomorrow, // max date is today's date
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // DOD

        it('should respond with status 204 for DOD on the bottom edge of the date limit', (done) => {
            const data = {
                dod: '1800-01-01', // min date is 1800-01-01
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for DOD on the upper edge of the date limit', (done) => {
            const now = new Date();
            const data = {
                dod: `${now.getFullYear()}-${(`0${now.getMonth()}`).slice(-2)}-${(`0${now.getDate()}`).slice(-2)}`, // today's date in format YYYY-MM-DD
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because DOD is earlier than date limit', (done) => {
            const data = {
                dod: '1799-12-31', // min date is 1800-01-01
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because DOD is later than date limit', (done) => {
            const tomorrow = new Date().setDate(new Date().getDate() + 1);
            const data = {
                dod: tomorrow, // max date is today's date
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        // Birthplace

        it('should respond with status 204 for birthplace that is on the bottom edge of the character limit', (done) => {
            const data = {
                birthplace: 'Lo', // 2 letter birthplace
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 204 for birthplace that is on the upper edge of the character limit', (done) => {
            const data = {
                birthplace: 'London, United KingdomLondon, United KingdomLondon, United KingdomLond', // 70 character birthplace
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect(204, done);
        });

        it('should respond with status 400 and json containing error message because of too short birthplace', (done) => {
            const data = {
                birthplace: 'L', // 1 letter birthplace
            };
            request(app)
                .patch(`/api/people/${id}`)
                .send(data)
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.haveOwnProperty('error');
                    done();
                });
        });

        it('should respond with status 400 and json containing error message because of too long birthplace', (done) => {
            const data = {
                birthplace: 'London, United KingdomLondon, United KingdomLondon, United KingdomLondo', // 71 letter birthplace
            };
            request(app)
                .patch(`/api/people/${id}`)
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

    describe('DELETE /api/people', () => {
        let id;

        beforeEach((done) => {
            Person.create({
                name: 'John Doe',
                dob: '2000-01-01',
                dod: '2000-01-01',
                birthplace: 'London, United Kingdom',
            })
                .then((person) => {
                    id = person.id;
                    done();
                })
                .catch((err) => done(err));
        });

        it('should respond with status 200 and remove object from database', (done) => {
            request(app)
                .delete(`/api/people/${id}`)
                .expect(200)
                .then(() => {
                    Person.findByPk(id)
                        .then((person) => {
                            expect(person).to.be.null;
                            done();
                        });
                });
        });
    });

    // Wipe people table after all tests
    after((done) => wipePeople(done));
});
