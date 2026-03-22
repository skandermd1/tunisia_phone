-- Tunisia Phone — Seed data for brands and categories

INSERT INTO brands (name, slug, sort_order) VALUES
    ('Samsung', 'samsung', 1),
    ('Infinix', 'infinix', 2),
    ('Oppo', 'oppo', 3),
    ('Honor', 'honor', 4),
    ('Redmi', 'redmi', 5),
    ('Xiaomi', 'xiaomi', 6)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);

INSERT INTO categories (name, slug, icon, sort_order) VALUES
    ('Telephones', 'telephones', 'smartphone', 1),
    ('Accessoires', 'accessoires', 'headphones', 2),
    ('Chargeurs', 'chargeurs', 'battery-charging', 3),
    ('AirPods', 'airpods', 'headset', 4),
    ('Coques', 'coques', 'shield', 5),
    ('Cables', 'cables', 'cable', 6),
    ('Tablettes', 'tablettes', 'tablet', 7)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
