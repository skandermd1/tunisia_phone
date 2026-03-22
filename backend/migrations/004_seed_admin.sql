-- =====================================================
-- 004_seed_admin.sql
-- Seed default admin user for Tunisia Phone
-- =====================================================

INSERT INTO admin_users (username, password_hash, display_name)
VALUES (
  'admin',
  '$2y$10$e0MYzXyjpJS7Pd0RVDFKdu.7Y3mAGczjHNwjR7vVyYBr7.QG8GOSK',
  'Administrateur'
);
