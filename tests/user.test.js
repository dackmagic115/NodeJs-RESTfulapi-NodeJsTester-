/**************************************************** TEST ALL USER FUNCTIONS **********************************************************************/
const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/users')
const { userOne , userOneId , setupDatabase } = require('../tests/fixtures/db')


beforeEach(setupDatabase)

test('Should signup a new user', async () => {
     const response = await request(app).post('/users').send({
        name:"Miona",
        email:"Horimiona@example.com",
        password:"Miona888"
    }).expect(201)

    const user = await User.findById(response.body.user)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name: 'Miona',
            email: 'horimiona@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Miona888')

})




test('Should login existing user', async () => {
    const response =  await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'non-password'
    }).expect(400)
})



test('Should get profile for user', async () => {
    await request(app)
                    .get('/users/me')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
                    .get('/users/me')
                    .send()
                    .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
                    .delete('/users/me')
                    .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
                    .send()
                    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user' , async () => {
    await request(app)
                    .delete('/users/me')
                    .send()
                    .expect(401)
})

test('Should update valid user filds', async () => {
    await request(app)
                .patch('/users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
                .send({
                    name:'Maiyan'
                })
                .expect(200)
            const user = await User.findById(userOneId)
            expect(user.name).toEqual('Maiyan')
})


test('Should not update valid user filds', async () => {
    await request(app)
                .patch('/users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
                .send({
                    location:'4848'
                })
                .expect(400)
   
})

test('should not update if unauthenticated', async () => {
            await request(app)
                        .patch('/users/me')
                        .send()
                        .expect(401)
})


