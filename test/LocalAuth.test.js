const request = require('supertest');
const app = require('../index'); // Assuming this is the file where your Express app is defined

describe('LocalAuth Routes', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/local-auth/register')
      .send({
        id: 1,
        email: 'test@example.com',
        fullname: 'John Doe',
        password: 'password123',
        avatar: 'avatar.jpg',
        phone: '1234567890',
        type: 'candidate',
        job_title: 'Software Engineer',
        description: 'Experienced software engineer',
        speciality: 'Web development',
        employment_type: 'Full-time',
        experience: '5 years',
        location: 'New York',
        resume: 'resume.pdf',
        skills: ['JavaScript', 'React', 'Node.js'],
        company: 'ABC Company',
        position: 'Manager',
        department: 'Engineering',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).toHaveProperty('fullname', 'John Doe');
    // Add more assertions for other properties if needed
  });
});