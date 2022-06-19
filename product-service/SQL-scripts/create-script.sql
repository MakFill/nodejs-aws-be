--CREATE TABLE products (
-- id uuid primary key default uuid_generate_v4(),
-- title text not null,
-- description text,
-- price integer,
-- image text
--)
--
--create table stocks (
--	product_id uuid, 
--	count integer,
--	foreign key ("product_id") references "products" ("id")
--)

--DELETE FROM products

--create extension if not exists "uuid-ossp"