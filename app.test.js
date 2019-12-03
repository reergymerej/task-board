import app from './app'
import request from 'supertest'

describe('GET /', () => {
  it('should be OK', async () => {
    await request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /text/)
      .expect(/task-board/)
  })
})

fdescribe('/tasks', () => {
  test('integration', async () => {
    let entity1
    let entity2
    let entity3

    await request(app)
      .get('/tasks')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body).toEqual({
          data: [],
        })
      })

    await request(app)
      .post('/tasks')
      .send({ value: 'foo' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const { body } = response
        const { data } = body
        entity1 = data[1]
        expect(response.body).toEqual({
          data: [
            null,
            {
              value: 'foo',
              prev: null,
              next: null,
            },
            null,
          ],
        })
      })

    await request(app)
      .get('/tasks')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body).toEqual({
          data: [
            entity1,
          ],
        })
      })

    await request(app)
      .post('/tasks')
      .send({ value: 'bar' })
      .then(response => {
        const { body } = response
        const { data } = body
        entity1 = data[0]
        entity2 = data[1]
        expect(response.body).toEqual({
          data: [
            {
              prev: null,
              value: 'foo',
              next: 'bar',
            },
            {
              prev: 'foo',
              value: 'bar',
              next: null,
            },
            null,
          ],
        })
      })

    await request(app)
      .get('/tasks')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body).toEqual({
          data: [
            entity1,
            entity2,
          ],
        })
      })

    await request(app)
      .post('/tasks')
      .send({ value: 'baz' })
      .then(response => {
        const { body } = response
        const { data } = body
        entity2 = data[0]
        entity3 = data[1]
        expect(response.body).toEqual({
          data: [
            {
              prev: 'foo',
              value: 'bar',
              next: 'baz',
            },
            {
              prev: 'bar',
              value: 'baz',
              next: null,
            },
            null,
          ],
        })
      })

    await request(app)
      .get('/tasks')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body).toEqual({
          data: [
            entity1,
            entity2,
            entity3,
          ],
        })
      })

    await request(app)
      .post('/tasks/move/')
      .send({
        data: [
        ],
      })
      .then(response => {
        const { body } = response
        const { data } = body
        entity2 = data[0]
        entity3 = data[1]
        expect(response.body).toEqual({
          data: [
            {
              prev: 'foo',
              value: 'bar',
              next: 'baz',
            },
            {
              prev: 'bar',
              value: 'baz',
              next: null,
            },
            null,
          ],
        })
      })
  })
})
