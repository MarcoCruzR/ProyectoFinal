const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cascoRoutes = require('../src/routes/cascoRoutes');
const authRoutes = require('../src/routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/cascos', cascoRoutes);
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Cascos', () => {
  test('GET /api/cascos debe retornar lista de cascos', async () => {
    const res = await request(app).get('/api/cascos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('cascos');
  });

  test('POST /api/cascos sin token debe retornar 401', async () => {
    const res = await request(app).post('/api/cascos').send({
      nombre: 'Test',
      descripcion: 'Test',
      precio: 100,
      stock: 5,
      imagen: 'https://imagen.com/img.jpg'
    });
    expect(res.statusCode).toBe(401);
  });

  test('Login debe retornar token', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'marco@gmail.com',
      password: 'L3GeNDZ75'
    });
    console.log('Login response:', loginRes.body);
    expect(loginRes.statusCode).toBe(200);
  });

  test('POST /api/cascos sin nombre debe retornar 400', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'marco@gmail.com',
      password: 'L3GeNDZ75'
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/cascos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descripcion: 'Sin nombre',
        precio: 100,
        stock: 5,
        imagen: 'https://imagen.com/img.jpg'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('El nombre es obligatorio');
  });
});