// Set up test environment variables
process.env.GOOGLE_GEMINI_API_KEY = 'test-api-key';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
process.env.NODE_ENV = 'test';
process.env.SMTP_HOST = 'smtp.test.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_USER = 'test@test.com';
process.env.SMTP_PASS = 'testpass';
process.env.FRONTEND_URL = 'http://localhost:3000';
