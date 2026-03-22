-- =====================================================
-- 003_seed_products.sql
-- Seed all phone products and variants for Tunisia Phone
-- =====================================================

SET @cat_telephones = 1;

-- =====================================================
-- SAMSUNG (brand_id = 1)
-- =====================================================

-- Samsung Galaxy A56
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy A56',
  'samsung-galaxy-a56',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-a56.jpg',
  'Le Galaxy A56 offre un ecran Super AMOLED 6.7 pouces, un processeur Exynos 1580 performant et un appareil photo 50MP pour des cliches exceptionnels.',
  '{"display":"6.7\\" Super AMOLED, 120Hz, 1080x2340","processor":"Exynos 1580","camera":"50MP + 12MP + 5MP arriere, 12MP avant","battery":"5000 mAh, charge rapide 25W","os":"Android 15, One UI 7"}',
  '["Noir","Bleu","Lilas"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 128, 'GB', 1149.00, 1),
(@last_id, 8, 256, 'GB', 1299.00, 0);

-- Samsung Galaxy A36
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy A36',
  'samsung-galaxy-a36',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-a36.jpg',
  'Le Galaxy A36 combine un design elegant avec un ecran Super AMOLED 6.6 pouces et une batterie longue duree de 5000 mAh.',
  '{"display":"6.6\\" Super AMOLED, 120Hz, 1080x2340","processor":"Snapdragon 6 Gen 3","camera":"50MP + 8MP + 5MP arriere, 13MP avant","battery":"5000 mAh, charge rapide 25W","os":"Android 15, One UI 7"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 128, 'GB', 899.00, 1),
(@last_id, 8, 256, 'GB', 999.00, 0);

-- Samsung Galaxy A26
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy A26',
  'samsung-galaxy-a26',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-a26.jpg',
  'Le Galaxy A26 propose un excellent rapport qualite-prix avec son ecran AMOLED 6.5 pouces et ses performances fiables au quotidien.',
  '{"display":"6.5\\" Super AMOLED, 90Hz, 1080x2340","processor":"Exynos 1380","camera":"50MP + 8MP + 2MP arriere, 13MP avant","battery":"5000 mAh, charge rapide 25W","os":"Android 15, One UI 7"}',
  '["Noir","Bleu Clair","Jaune"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 6, 128, 'GB', 749.00, 1),
(@last_id, 8, 256, 'GB', 849.00, 0);

-- Samsung Galaxy A17 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy A17 5G',
  'samsung-galaxy-a17-5g',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-a17-5g.jpg',
  'Le Galaxy A17 5G offre la connectivite 5G a un prix accessible avec un ecran 6.5 pouces et 8Go de RAM.',
  '{"display":"6.5\\" PLS LCD, 90Hz, 1080x2340","processor":"Dimensity 6300","camera":"50MP + 2MP arriere, 8MP avant","battery":"5000 mAh, charge rapide 15W","os":"Android 15, One UI 7"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 820.00, 1);

-- Samsung Galaxy A17 4G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy A17 4G',
  'samsung-galaxy-a17-4g',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-a17-4g.jpg',
  'Le Galaxy A17 4G est un smartphone polyvalent avec un ecran 6.5 pouces et plusieurs configurations memoire disponibles.',
  '{"display":"6.5\\" PLS LCD, 90Hz, 720x1600","processor":"Helio G85","camera":"50MP + 2MP arriere, 8MP avant","battery":"5000 mAh, charge rapide 15W","os":"Android 14, One UI 6"}',
  '["Noir","Bleu","Or"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 4, 128, 'GB', 599.00, 1),
(@last_id, 6, 128, 'GB', 649.00, 0),
(@last_id, 8, 256, 'GB', 779.00, 0);

-- Samsung Galaxy A16
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy A16',
  'samsung-galaxy-a16',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-a16.jpg',
  'Le Galaxy A16 est un smartphone d''entree de gamme fiable avec un ecran 6.5 pouces et une autonomie impressionnante.',
  '{"display":"6.5\\" PLS LCD, 90Hz, 1080x2340","processor":"Exynos 1330","camera":"50MP + 5MP + 2MP arriere, 13MP avant","battery":"5000 mAh, charge rapide 25W","os":"Android 14, One UI 6"}',
  '["Noir","Bleu","Or"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 4, 128, 'GB', 549.00, 1),
(@last_id, 6, 128, 'GB', 579.00, 0);

-- Samsung Galaxy A07
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy A07',
  'samsung-galaxy-a07',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-a07.jpg',
  'Le Galaxy A07 est le compagnon ideal pour les usages essentiels avec son grand ecran 6.7 pouces et sa batterie longue duree.',
  '{"display":"6.7\\" PLS LCD, 60Hz, 720x1600","processor":"Helio G85","camera":"50MP + 2MP arriere, 8MP avant","battery":"5000 mAh, charge 15W","os":"Android 14, One UI 6"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 4, 128, 'GB', 449.00, 1),
(@last_id, 6, 128, 'GB', 499.00, 0);

-- Samsung Galaxy S25 Ultra
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy S25 Ultra',
  'samsung-galaxy-s25-ultra',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-s25-ultra.jpg',
  'Le Galaxy S25 Ultra est le fleuron de Samsung avec un ecran Dynamic AMOLED 6.9 pouces, le Snapdragon 8 Elite et un appareil photo 200MP.',
  '{"display":"6.9\\" Dynamic AMOLED 2X, 120Hz, 1440x3120","processor":"Snapdragon 8 Elite","camera":"200MP + 50MP + 10MP + 50MP arriere, 12MP avant","battery":"5000 mAh, charge rapide 45W","os":"Android 15, One UI 7"}',
  '["Noir Titane","Bleu Titane","Gris Titane","Argent Titane"]',
  1, 0, 'Premium'
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 256, 'GB', 3200.00, 1);

-- Samsung Galaxy S26 Ultra
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy S26 Ultra',
  'samsung-galaxy-s26-ultra',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-s26-ultra.jpg',
  'Le tout nouveau Galaxy S26 Ultra repousse les limites avec son ecran 6.9 pouces, son processeur de derniere generation et des capacites IA avancees.',
  '{"display":"6.9\\" Dynamic AMOLED 2X, 120Hz, 1440x3120","processor":"Snapdragon 8 Elite 2","camera":"200MP + 50MP + 10MP + 50MP arriere, 12MP avant","battery":"5500 mAh, charge rapide 65W","os":"Android 16, One UI 8"}',
  '["Noir Titane","Bleu Titane","Argent Titane","Vert Titane"]',
  1, 1, 'Nouveau'
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 256, 'GB', 4300.00, 1);

-- Samsung Galaxy Z Flip 7
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy Z Flip 7',
  'samsung-galaxy-z-flip-7',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-z-flip-7.jpg',
  'Le Z Flip 7 est le smartphone pliable compact de Samsung avec un design iconique et des performances de pointe.',
  '{"display":"6.7\\" Dynamic AMOLED 2X pliable, 120Hz + 3.4\\" ecran externe","processor":"Snapdragon 8 Elite","camera":"50MP + 12MP arriere, 10MP avant","battery":"4000 mAh, charge rapide 25W","os":"Android 15, One UI 7"}',
  '["Noir","Bleu","Vert Menthe","Jaune"]',
  1, 0, 'Nouveau'
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 256, 'GB', 2700.00, 1);

-- Samsung Galaxy Z Fold 7
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Samsung Galaxy Z Fold 7',
  'samsung-galaxy-z-fold-7',
  1, @cat_telephones,
  '/uploads/products/samsung-galaxy-z-fold-7.jpg',
  'Le Z Fold 7 transforme votre experience mobile avec son grand ecran pliable 7.6 pouces et ses capacites multitache inegalees.',
  '{"display":"7.6\\" Dynamic AMOLED 2X pliable, 120Hz + 6.2\\" ecran externe","processor":"Snapdragon 8 Elite","camera":"50MP + 12MP + 10MP arriere, 4MP sous ecran + 10MP couverture","battery":"4400 mAh, charge rapide 25W","os":"Android 15, One UI 7"}',
  '["Noir","Bleu Marine","Argent"]',
  1, 0, 'Premium'
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 512, 'GB', 4900.00, 1);

-- =====================================================
-- INFINIX (brand_id = 2)
-- =====================================================

-- Infinix Note 50S 5G+
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Infinix Note 50S 5G+',
  'infinix-note-50s-5g-plus',
  2, @cat_telephones,
  '/uploads/products/infinix-note-50s-5g-plus.jpg',
  'Le Note 50S 5G+ d''Infinix offre la connectivite 5G avec un ecran AMOLED 6.78 pouces et une charge rapide 33W.',
  '{"display":"6.78\\" AMOLED, 120Hz, 1080x2400","processor":"Dimensity 7025","camera":"108MP + 2MP arriere, 32MP avant","battery":"5000 mAh, charge rapide 33W","os":"Android 14, XOS 14"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 830.00, 1);

-- Infinix Hot 60 Pro+
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Infinix Hot 60 Pro+',
  'infinix-hot-60-pro-plus',
  2, @cat_telephones,
  '/uploads/products/infinix-hot-60-pro-plus.jpg',
  'Le Hot 60 Pro+ offre un ecran IPS 6.78 pouces, 8Go de RAM et une autonomie exceptionnelle de 6000 mAh.',
  '{"display":"6.78\\" IPS LCD, 120Hz, 1080x2460","processor":"Helio G100","camera":"108MP + 2MP arriere, 8MP avant","battery":"6000 mAh, charge rapide 33W","os":"Android 14, XOS 14"}',
  '["Noir Volcanique","Bleu Glacier","Or"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 750.00, 1);

-- Infinix Hot 60 Pro
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Infinix Hot 60 Pro',
  'infinix-hot-60-pro',
  2, @cat_telephones,
  '/uploads/products/infinix-hot-60-pro.jpg',
  'Le Hot 60 Pro combine performances et autonomie avec sa batterie 6000 mAh et son ecran 6.78 pouces fluide.',
  '{"display":"6.78\\" IPS LCD, 90Hz, 720x1612","processor":"Helio G85","camera":"50MP + 2MP arriere, 8MP avant","battery":"6000 mAh, charge rapide 18W","os":"Android 14, XOS 14"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 650.00, 1);

-- Infinix Hot 60i
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Infinix Hot 60i',
  'infinix-hot-60i',
  2, @cat_telephones,
  '/uploads/products/infinix-hot-60i.jpg',
  'Le Hot 60i est un smartphone abordable avec un ecran 6.56 pouces et une batterie genereuse de 5000 mAh.',
  '{"display":"6.56\\" IPS LCD, 90Hz, 720x1612","processor":"Helio G36","camera":"13MP + 0.08MP arriere, 8MP avant","battery":"5000 mAh, charge 10W","os":"Android 14 Go, XOS 14"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 6, 128, 'GB', 480.00, 1),
(@last_id, 8, 256, 'GB', 530.00, 0);

-- Infinix Smart 10
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Infinix Smart 10',
  'infinix-smart-10',
  2, @cat_telephones,
  '/uploads/products/infinix-smart-10.jpg',
  'Le Smart 10 est le smartphone essentiel d''Infinix avec un prix accessible et des fonctionnalites de base fiables.',
  '{"display":"6.6\\" IPS LCD, 60Hz, 720x1612","processor":"Helio A24","camera":"13MP arriere, 5MP avant","battery":"5000 mAh, charge 10W","os":"Android 14 Go, XOS 14"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 3, 64, 'GB', 370.00, 1),
(@last_id, 4, 128, 'GB', 400.00, 0);

-- =====================================================
-- OPPO (brand_id = 3)
-- =====================================================

-- Oppo Reno 14F
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo Reno 14F',
  'oppo-reno-14f',
  3, @cat_telephones,
  '/uploads/products/oppo-reno-14f.jpg',
  'Le Reno 14F d''Oppo brille par son ecran AMOLED 6.7 pouces, 12Go de RAM et un systeme photo 64MP polyvalent.',
  '{"display":"6.7\\" AMOLED, 120Hz, 1080x2400","processor":"Dimensity 7300","camera":"64MP + 8MP + 2MP arriere, 32MP avant","battery":"5000 mAh, charge rapide SUPERVOOC 67W","os":"Android 15, ColorOS 15"}',
  '["Noir","Bleu","Rose"]',
  1, 1, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 256, 'GB', 1180.00, 1),
(@last_id, 12, 512, 'GB', 1350.00, 0);

-- Oppo A6 Pro 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo A6 Pro 5G',
  'oppo-a6-pro-5g',
  3, @cat_telephones,
  '/uploads/products/oppo-a6-pro-5g.jpg',
  'L''A6 Pro 5G offre la connectivite 5G dans un design premium avec un ecran AMOLED 6.7 pouces et une charge rapide 45W.',
  '{"display":"6.7\\" AMOLED, 120Hz, 1080x2400","processor":"Dimensity 7050","camera":"50MP + 2MP arriere, 16MP avant","battery":"5100 mAh, charge rapide 45W","os":"Android 14, ColorOS 14"}',
  '["Noir","Bleu Ocean","Violet"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 1050.00, 1);

-- Oppo Reno 12 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo Reno 12 5G',
  'oppo-reno-12-5g',
  3, @cat_telephones,
  '/uploads/products/oppo-reno-12-5g.jpg',
  'Le Reno 12 5G combine elegance et puissance avec son Dimensity 7300 et son ecran AMOLED 6.7 pouces incurve.',
  '{"display":"6.7\\" AMOLED, 120Hz, 1080x2412","processor":"Dimensity 7300","camera":"50MP + 8MP + 2MP arriere, 32MP avant","battery":"5000 mAh, charge rapide SUPERVOOC 67W","os":"Android 14, ColorOS 14"}',
  '["Noir","Argent","Bleu"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 512, 'GB', 1150.00, 1);

-- Oppo Reno 12F 4G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo Reno 12F 4G',
  'oppo-reno-12f-4g',
  3, @cat_telephones,
  '/uploads/products/oppo-reno-12f-4g.jpg',
  'Le Reno 12F 4G offre un excellent rapport qualite-prix avec son ecran AMOLED 6.67 pouces et sa charge rapide 45W.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1080x2400","processor":"Helio G99","camera":"50MP + 8MP + 2MP arriere, 32MP avant","battery":"5000 mAh, charge rapide 45W","os":"Android 14, ColorOS 14"}',
  '["Noir","Vert","Orange"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 720.00, 1);

-- Oppo A5 Pro 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo A5 Pro 5G',
  'oppo-a5-pro-5g',
  3, @cat_telephones,
  '/uploads/products/oppo-a5-pro-5g.jpg',
  'L''A5 Pro 5G offre la 5G et une construction robuste avec certification IP69 pour une resistance maximale.',
  '{"display":"6.7\\" AMOLED, 120Hz, 1080x2400","processor":"Dimensity 7025","camera":"50MP + 2MP arriere, 8MP avant","battery":"5100 mAh, charge rapide 45W","os":"Android 14, ColorOS 14"}',
  '["Noir","Bleu","Blanc"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 800.00, 1);

-- Oppo A5 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo A5 5G',
  'oppo-a5-5g',
  3, @cat_telephones,
  '/uploads/products/oppo-a5-5g.jpg',
  'L''A5 5G est un smartphone 5G accessible avec un ecran 6.6 pouces et une batterie de 5100 mAh.',
  '{"display":"6.6\\" IPS LCD, 90Hz, 720x1612","processor":"Dimensity 6300","camera":"13MP + 2MP arriere, 5MP avant","battery":"5100 mAh, charge rapide 15W","os":"Android 14, ColorOS 14"}',
  '["Noir","Bleu","Blanc"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 6, 128, 'GB', 670.00, 1);

-- Oppo A3
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo A3',
  'oppo-a3',
  3, @cat_telephones,
  '/uploads/products/oppo-a3.jpg',
  'L''Oppo A3 est un smartphone resistant avec certification IP54, ecran 6.67 pouces et charge rapide 45W.',
  '{"display":"6.67\\" IPS LCD, 90Hz, 720x1604","processor":"Snapdragon 680","camera":"50MP + 2MP arriere, 8MP avant","battery":"5000 mAh, charge rapide 45W","os":"Android 14, ColorOS 14"}',
  '["Noir","Bleu Etoile","Blanc"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 570.00, 1);

-- Oppo A3x
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Oppo A3x',
  'oppo-a3x',
  3, @cat_telephones,
  '/uploads/products/oppo-a3x.jpg',
  'L''Oppo A3x est un smartphone d''entree de gamme fiable avec un ecran 6.67 pouces et une autonomie solide.',
  '{"display":"6.67\\" IPS LCD, 90Hz, 720x1604","processor":"Helio G36","camera":"8MP arriere, 5MP avant","battery":"5100 mAh, charge rapide 10W","os":"Android 14, ColorOS 14"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 4, 128, 'GB', 480.00, 1);

-- =====================================================
-- HONOR (brand_id = 4)
-- =====================================================

-- Honor 400
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Honor 400',
  'honor-400',
  4, @cat_telephones,
  '/uploads/products/honor-400.jpg',
  'Le Honor 400 impressionne avec son ecran AMOLED 6.78 pouces, 12Go de RAM et un systeme photo 108MP pour des cliches detailles.',
  '{"display":"6.78\\" AMOLED, 120Hz, 1080x2400","processor":"Snapdragon 7 Gen 3","camera":"108MP + 8MP + 2MP arriere, 32MP avant","battery":"5200 mAh, charge rapide 100W","os":"Android 15, MagicOS 9"}',
  '["Noir","Bleu","Vert"]',
  1, 1, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 256, 'GB', 1130.00, 1),
(@last_id, 12, 512, 'GB', 1280.00, 0);

-- Honor 400 Lite 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Honor 400 Lite 5G',
  'honor-400-lite-5g',
  4, @cat_telephones,
  '/uploads/products/honor-400-lite-5g.jpg',
  'Le Honor 400 Lite 5G offre la 5G dans un design fin avec un ecran AMOLED 6.7 pouces et 12Go de RAM.',
  '{"display":"6.7\\" AMOLED, 120Hz, 1080x2412","processor":"Dimensity 7025","camera":"108MP + 2MP arriere, 16MP avant","battery":"5200 mAh, charge rapide 35W","os":"Android 15, MagicOS 9"}',
  '["Noir","Bleu Ciel","Rose"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 256, 'GB', 860.00, 1);

-- Honor X9d
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Honor X9d',
  'honor-x9d',
  4, @cat_telephones,
  '/uploads/products/honor-x9d.jpg',
  'Le Honor X9d offre une durabilite exceptionnelle avec certification militaire, un ecran AMOLED 6.78 pouces et 12Go de RAM.',
  '{"display":"6.78\\" AMOLED, 120Hz, 1080x2388","processor":"Snapdragon 6 Gen 1","camera":"108MP + 5MP arriere, 16MP avant","battery":"5300 mAh, charge rapide 35W","os":"Android 14, MagicOS 8"}',
  '["Noir","Bleu Ocean","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 256, 'GB', 1100.00, 1);

-- Honor X9C
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Honor X9C',
  'honor-x9c',
  4, @cat_telephones,
  '/uploads/products/honor-x9c.jpg',
  'Le Honor X9C est un smartphone robuste avec un ecran AMOLED 6.78 pouces et une batterie massive de 5600 mAh.',
  '{"display":"6.78\\" AMOLED, 120Hz, 1080x2388","processor":"Snapdragon 6 Gen 1","camera":"108MP + 5MP arriere, 16MP avant","battery":"5600 mAh, charge rapide 66W","os":"Android 14, MagicOS 8"}',
  '["Noir","Bleu","Titanium"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 900.00, 1);

-- Honor X7d 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Honor X7d 5G',
  'honor-x7d-5g',
  4, @cat_telephones,
  '/uploads/products/honor-x7d-5g.jpg',
  'Le Honor X7d 5G offre la connectivite 5G a un prix competitif avec un ecran AMOLED 6.72 pouces et 8Go de RAM.',
  '{"display":"6.72\\" AMOLED, 90Hz, 1080x2400","processor":"Dimensity 6300","camera":"50MP + 2MP arriere, 8MP avant","battery":"5200 mAh, charge rapide 35W","os":"Android 14, MagicOS 8"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 750.00, 1);

-- Honor X7d 4G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Honor X7d 4G',
  'honor-x7d-4g',
  4, @cat_telephones,
  '/uploads/products/honor-x7d-4g.jpg',
  'Le Honor X7d 4G est un smartphone equilibre avec un ecran 6.72 pouces et une batterie de 5200 mAh pour une utilisation quotidienne confortable.',
  '{"display":"6.72\\" IPS LCD, 90Hz, 720x1604","processor":"Helio G85","camera":"50MP + 2MP arriere, 8MP avant","battery":"5200 mAh, charge rapide 35W","os":"Android 14, MagicOS 8"}',
  '["Noir","Bleu","Or"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 650.00, 1);

-- =====================================================
-- REDMI (brand_id = 5)
-- =====================================================

-- Redmi Note 15 Pro+
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi Note 15 Pro+',
  'redmi-note-15-pro-plus',
  5, @cat_telephones,
  '/uploads/products/redmi-note-15-pro-plus.jpg',
  'Le Redmi Note 15 Pro+ est le haut de gamme de la serie avec un ecran AMOLED 6.67 pouces, un capteur 200MP et une charge turbo 120W.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1220x2712","processor":"Snapdragon 7s Gen 3","camera":"200MP + 8MP + 2MP arriere, 16MP avant","battery":"5110 mAh, charge rapide 120W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Violet"]',
  1, 1, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 1300.00, 1),
(@last_id, 12, 512, 'GB', 1450.00, 0);

-- Redmi Note 15 Pro
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi Note 15 Pro',
  'redmi-note-15-pro',
  5, @cat_telephones,
  '/uploads/products/redmi-note-15-pro.jpg',
  'Le Redmi Note 15 Pro offre un ecran AMOLED 6.67 pouces, un processeur Snapdragon performant et un appareil photo 200MP.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1080x2400","processor":"Snapdragon 7s Gen 2","camera":"200MP + 8MP + 2MP arriere, 16MP avant","battery":"5100 mAh, charge rapide 67W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 950.00, 1),
(@last_id, 12, 512, 'GB', 1050.00, 0);

-- Redmi Note 15
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi Note 15',
  'redmi-note-15',
  5, @cat_telephones,
  '/uploads/products/redmi-note-15.jpg',
  'Le Redmi Note 15 offre un excellent rapport qualite-prix avec son ecran AMOLED 6.67 pouces et sa charge rapide 33W.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1080x2400","processor":"Snapdragon 4 Gen 2","camera":"108MP + 2MP arriere, 16MP avant","battery":"5100 mAh, charge rapide 33W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Vert Foret"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 6, 128, 'GB', 690.00, 1),
(@last_id, 8, 128, 'GB', 740.00, 0),
(@last_id, 8, 256, 'GB', 780.00, 0);

-- Redmi Note 14 Pro+
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi Note 14 Pro+',
  'redmi-note-14-pro-plus',
  5, @cat_telephones,
  '/uploads/products/redmi-note-14-pro-plus.jpg',
  'Le Redmi Note 14 Pro+ excelle avec son capteur 200MP, son ecran AMOLED 6.67 pouces et sa charge rapide 120W.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1220x2712","processor":"Snapdragon 7s Gen 2","camera":"200MP + 8MP + 2MP arriere, 16MP avant","battery":"5110 mAh, charge rapide 120W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Violet"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 1120.00, 1),
(@last_id, 12, 512, 'GB', 1250.00, 0);

-- Redmi Note 14 Pro 5G
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi Note 14 Pro 5G',
  'redmi-note-14-pro-5g',
  5, @cat_telephones,
  '/uploads/products/redmi-note-14-pro-5g.jpg',
  'Le Redmi Note 14 Pro 5G offre la connectivite 5G avec un ecran AMOLED 6.67 pouces et un appareil photo 50MP OIS.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1080x2400","processor":"Dimensity 7300 Ultra","camera":"50MP OIS + 8MP + 2MP arriere, 16MP avant","battery":"5110 mAh, charge rapide 45W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 1020.00, 1);

-- Redmi Note 14 Pro
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi Note 14 Pro',
  'redmi-note-14-pro',
  5, @cat_telephones,
  '/uploads/products/redmi-note-14-pro.jpg',
  'Le Redmi Note 14 Pro combine un ecran AMOLED 6.67 pouces incurve et un appareil photo 200MP a un prix attractif.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1080x2400","processor":"Helio G99 Ultra","camera":"200MP + 8MP + 2MP arriere, 16MP avant","battery":"5500 mAh, charge rapide 33W","os":"Android 14, MIUI 15"}',
  '["Noir","Violet","Vert Olive"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 8, 256, 'GB', 850.00, 1),
(@last_id, 12, 512, 'GB', 980.00, 0);

-- Redmi Note 14
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi Note 14',
  'redmi-note-14',
  5, @cat_telephones,
  '/uploads/products/redmi-note-14.jpg',
  'Le Redmi Note 14 est un smartphone polyvalent avec un ecran AMOLED 6.67 pouces et un appareil photo 108MP.',
  '{"display":"6.67\\" AMOLED, 120Hz, 1080x2400","processor":"Helio G99 Ultra","camera":"108MP + 2MP arriere, 16MP avant","battery":"5110 mAh, charge rapide 33W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 6, 128, 'GB', 590.00, 1),
(@last_id, 8, 128, 'GB', 620.00, 0),
(@last_id, 8, 256, 'GB', 680.00, 0);

-- Redmi 15
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi 15',
  'redmi-15',
  5, @cat_telephones,
  '/uploads/products/redmi-15.jpg',
  'Le Redmi 15 offre un ecran 6.72 pouces, une batterie 5200 mAh et un design moderne a un prix accessible.',
  '{"display":"6.72\\" IPS LCD, 90Hz, 1080x2400","processor":"Helio G100","camera":"50MP + 2MP arriere, 8MP avant","battery":"5200 mAh, charge rapide 33W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 6, 128, 'GB', 550.00, 1),
(@last_id, 8, 256, 'GB', 620.00, 0);

-- Redmi 15C
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi 15C',
  'redmi-15c',
  5, @cat_telephones,
  '/uploads/products/redmi-15c.jpg',
  'Le Redmi 15C est un smartphone economique fiable avec un grand ecran 6.72 pouces et une batterie longue duree.',
  '{"display":"6.72\\" IPS LCD, 90Hz, 720x1650","processor":"Helio G85","camera":"50MP arriere, 5MP avant","battery":"5160 mAh, charge rapide 18W","os":"Android 14, MIUI 15"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 4, 128, 'GB', 480.00, 1),
(@last_id, 6, 128, 'GB', 500.00, 0),
(@last_id, 8, 256, 'GB', 550.00, 0);

-- Redmi A5
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Redmi A5',
  'redmi-a5',
  5, @cat_telephones,
  '/uploads/products/redmi-a5.jpg',
  'Le Redmi A5 est le smartphone le plus accessible de Redmi avec des fonctionnalites essentielles et une batterie de 5000 mAh.',
  '{"display":"6.7\\" IPS LCD, 60Hz, 720x1600","processor":"Helio A22","camera":"13MP arriere, 5MP avant","battery":"5000 mAh, charge 10W","os":"Android 14 Go, MIUI 15"}',
  '["Noir","Bleu","Vert"]',
  1, 0, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 3, 64, 'GB', 380.00, 1);

-- =====================================================
-- XIAOMI (brand_id = 6)
-- =====================================================

-- Xiaomi 14T Pro
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Xiaomi 14T Pro',
  'xiaomi-14t-pro',
  6, @cat_telephones,
  '/uploads/products/xiaomi-14t-pro.jpg',
  'Le Xiaomi 14T Pro est un flagship avec ecran AMOLED 6.67 pouces, processeur Dimensity 9300+ et optique Leica pour des photos professionnelles.',
  '{"display":"6.67\\" AMOLED, 144Hz, 1220x2712","processor":"Dimensity 9300+","camera":"50MP Leica + 50MP telephoto + 12MP ultra-wide, 32MP avant","battery":"5000 mAh, charge rapide 120W","os":"Android 14, HyperOS"}',
  '["Noir Titane","Bleu Titane","Gris Titane"]',
  1, 1, 'Premium'
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 1, 'TB', 1950.00, 1);

-- Xiaomi 15T
INSERT INTO products (name, slug, brand_id, category_id, image_url, description, specs, colors, is_active, is_featured, badge)
VALUES (
  'Xiaomi 15T',
  'xiaomi-15t',
  6, @cat_telephones,
  '/uploads/products/xiaomi-15t.jpg',
  'Le Xiaomi 15T offre des performances de pointe avec le Snapdragon 8 Gen 3, un ecran AMOLED 6.67 pouces et une optique Leica.',
  '{"display":"6.67\\" AMOLED, 144Hz, 1220x2712","processor":"Snapdragon 8 Gen 3","camera":"50MP Leica + 50MP telephoto + 12MP ultra-wide, 32MP avant","battery":"5100 mAh, charge rapide 90W","os":"Android 15, HyperOS 2"}',
  '["Noir","Bleu","Vert"]',
  1, 1, NULL
);
SET @last_id = LAST_INSERT_ID();
INSERT INTO product_variants (product_id, ram, storage, storage_unit, price, is_default) VALUES
(@last_id, 12, 512, 'GB', 1600.00, 1);
