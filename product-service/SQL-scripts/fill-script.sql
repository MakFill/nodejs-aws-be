--insert into products (title, description, price, image) values
--('Sunshine', 'Taking place in the year 2057, the story follows a group of astronauts on a dangerous mission to reignite the dying Sun.', 18.4, 'https://upload.wikimedia.org/wikipedia/en/6/68/Sunshine_poster.jpg'),
--('Interstellar', 'Set in a dystopian future where humanity is struggling to survive, the film follows a group of astronauts who travel through a wormhole near Saturn in search of a new home for humanity.', 10, 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'),
--('Prometheus', 'Centers on the crew of the spaceship Prometheus as it follows a star map discovered among the artifacts of several ancient Earth cultures.', 23, 'https://upload.wikimedia.org/wikipedia/en/a/a3/Prometheusposterfixed.jpg'),
--('The Martian', 'The film depicts an astronaut is (Damon) lone struggle to survive on Mars after being left behind, and the efforts of NASA to rescue him and bring him home to Earth.', 15, 'https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg'),
--('Edge of Tomorrow', 'The film takes place in a future where most of Europe is invaded by an alien race.', 23, 'https://upload.wikimedia.org/wikipedia/en/f/f9/Edge_of_Tomorrow_Poster.jpg'),
--('Moon', 'The film follows a man who experiences a personal crisis as he nears the end of a three-year solitary stint mining helium-3 on the far side of the Moon.', 15, 'https://upload.wikimedia.org/wikipedia/en/a/af/Moon_%282009_film%29.jpg'),
--('Arrival', 'The film follows a linguist enlisted by the United States Army to discover how to communicate with extraterrestrial aliens who have arrived on Earth, before tensions lead to war.', 23, 'https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg'),
--('Blade Runner', 'The film is set in a dystopian future Los Angeles of 2019, in which synthetic humans known as replicants are bio-engineered by the powerful Tyrell Corporation to work at space colonies.', 15, 'https://upload.wikimedia.org/wikipedia/en/9/9f/Blade_Runner_%281982_poster%29.png')

--insert into stocks (product_id, count) values
--('3fad538f-1632-4c69-ad78-00042f186e68', 4),
--('68ae1b24-ac80-41e6-87b4-95cf61b8b5e4', 6),
--('5c5adb01-6111-4c34-8c53-b98fa639e310', 7),
--('bcd3232c-7c4b-4766-a2ea-3a459e2cd1bd', 12),
--('b1d08d40-c7fa-40e3-a00d-7a0cf4dc5b45', 23),
--('aa9c8536-c58e-4edc-b7a1-9a1af7f1a387', 15),
--('214ea3e7-73dd-4027-a58f-f92a0a1bc0b9', 23),
--('8560879b-5f8f-4185-93b6-ffc65cfd32f9', 15)


--begin;
--insert into products (title, description, price, image) values ('title', 'baer', 1, 'fad');
--insert into stocks (product_id, count) values ((select id from products where products.title='title'), 1);
--commit;

--DROP table stocks

--SELECT p.id, p.description, p.price, p.title, s.count FROM products p LEFT JOIN stocks s 
--on p.id=s.product_id

--begin;
--DELETE FROM stocks where count = 1;
--delete from products where title = 'title';
--commit;

--select * from products