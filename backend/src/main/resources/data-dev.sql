INSERT INTO app_user (email, password_hash, role)
SELECT 'mail@example.com',
       '$2a$10$8iKv3QoBEbUY4SZSJJGGGeaBMxd8od4NpZ5tzqWdPF5vfjAhsxS1G',
       'USER'
WHERE NOT EXISTS (SELECT 1 FROM app_user WHERE email = 'mail@example.com');