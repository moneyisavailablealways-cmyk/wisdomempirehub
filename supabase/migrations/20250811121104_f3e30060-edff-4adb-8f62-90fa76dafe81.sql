-- Insert sample similes with the new categories
INSERT INTO similes (text, origin, subcategory, meaning, example, type) VALUES
-- People category
('As busy as a bee', 'English', 'People', 'Someone who is very active and hardworking', 'She''s as busy as a bee with all her projects.', 'simile'),
('As stubborn as a mule', 'English', 'People', 'Someone who is very difficult to persuade or change their mind', 'He''s as stubborn as a mule when it comes to his opinions.', 'simile'),
('As wise as an owl', 'English', 'People', 'Someone who is very intelligent and knowledgeable', 'The professor is as wise as an owl.', 'simile'),

-- Animals category  
('As sly as a fox', 'English', 'Animals', 'Very cunning and clever in a deceptive way', 'The con artist was as sly as a fox.', 'simile'),
('As strong as an ox', 'English', 'Animals', 'Very physically strong', 'The weightlifter is as strong as an ox.', 'simile'),
('As graceful as a swan', 'English', 'Animals', 'Moving with beauty and elegance', 'The ballerina was as graceful as a swan.', 'simile'),

-- Nature category
('As solid as a rock', 'English', 'Nature', 'Very reliable and dependable', 'You can count on him - he''s as solid as a rock.', 'simile'),
('As fresh as morning dew', 'English', 'Nature', 'Very new, clean, or refreshing', 'Her ideas were as fresh as morning dew.', 'simile'),
('As tall as a mountain', 'English', 'Nature', 'Extremely tall or high', 'The basketball player was as tall as a mountain.', 'simile'),

-- Behavior category
('As quiet as a mouse', 'English', 'Behavior', 'Very silent or making no noise', 'The children were as quiet as mice during story time.', 'simile'),
('As fast as lightning', 'English', 'Behavior', 'Extremely quick or rapid', 'She responded to the question as fast as lightning.', 'simile'),
('As patient as a saint', 'English', 'Behavior', 'Extremely tolerant and calm', 'The teacher was as patient as a saint with the difficult students.', 'simile'),

-- Appearance category
('As white as snow', 'English', 'Appearance', 'Completely white or pure', 'Her dress was as white as snow.', 'simile'),
('As red as a rose', 'English', 'Appearance', 'A bright red color', 'Her cheeks were as red as a rose from the cold.', 'simile'),
('As bright as the sun', 'English', 'Appearance', 'Very bright or brilliant', 'His smile was as bright as the sun.', 'simile');

-- Insert sample idioms with the new Life category
INSERT INTO idioms (text, origin, subcategory, meaning, example, type) VALUES
-- Life category
('Life is not a bed of roses', 'English', 'Life', 'Life is not always easy and comfortable', 'Starting your own business - life is not a bed of roses.', 'idiom'),
('Life is what you make it', 'English', 'Life', 'Your life depends on your own actions and choices', 'Don''t blame others for your problems - life is what you make it.', 'idiom'),
('Life is too short', 'English', 'Life', 'Life should be enjoyed because it doesn''t last long', 'Don''t waste time on grudges - life is too short.', 'idiom'),
('Life begins at forty', 'English', 'Life', 'People can start new experiences and adventures at any age', 'She started her new career at 45 - life begins at forty.', 'idiom'),
('Life is a journey, not a destination', 'English', 'Life', 'Focus on experiences rather than just goals', 'Enjoy each day - life is a journey, not a destination.', 'idiom');