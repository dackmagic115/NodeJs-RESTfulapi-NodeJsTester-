const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/tasks')
const { userOne , userOneId , userTwo , userTwoId , taskOne, taskTwo , taskThree , setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)



////////////////////////// User //////////////////////

test('should create task for user', async () => {
    const response = await request(app)
                        .post('/tasks')
                        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
                        .send({
                            description : 'From my test'
                        })
                        .expect(201)
                    const task = await Task.findById(response.body._id)
                    expect(task).not.toBeNull()
                    expect(task.completed).toEqual(false)
})

test('should fetch user tasks', async () => {
    const response = await request(app)
                        .get('/tasks')
                        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)
                    expect(response.body.length).toEqual(2)
})


test('should fetch user tasks by id  ', async () => {
    const response = await request(app)
                        .get(`/tasks/${taskTwo._id}`)
                        .set('Authorization' , `Bearer ${userTwo.tokens[0].token}`)
                        .send()
                        .expect(200)
                    expect(response.body).not.toBeNull()

})

test('should not fetch user tasks by id if unauthenticated ', async () => {
        const response = await request(app)
                            .get(`/tasks/${taskTwo._id}`)
                            .send()
                            .expect(401)
})

test('should not fetch other user tasks by id ', async () => {
        const response = await request(app)
                            .get(`/tasks/${taskOne._id}`)
                            .set('Authorization' , `Bearer ${userTwo.tokens[0].token}`)
                            .send()
                            .expect(404)
                        const task = await Task.findById(taskTwo._id)
                        expect(task).not.toBeNull()
})



/////////////////////////////// Delete ////////////////////////////

test('Should not delete other users tasks', async () => {
    const response = await request(app)
                    .delete(`/tasks/${taskOne._id}`)
                    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                    .send()
                    .expect(404)
                const task = await Task.findById(taskOne._id)
                expect(task).not.toBeNull()
})

test('should not delete task if unauthenticated', async () => {
        const response =  await request(app)
                            .delete(`/tasks/${taskOne._id}`)
                            .send()
                            .expect(401)
})

test('should fetch only completed tasks', async () => {
        const response = await request(app)
                            .get(`/tasks?completed=true`)
                            .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
                            .send()
                            .expect(200)
                        expect(response.body.length).toEqual(1) 
})

test('should fetch only non completed tasks', async () => {
        const response = await request(app)
                            .get(`/tasks?completed=false`)
                            .set('Authorization' , `Bearer ${userTwo.tokens[0].token}`)
                            .send()
                            .expect(200)
                        expect(response.body.length).toEqual(1)
})

///////////////// UPDATE /////////////////////





