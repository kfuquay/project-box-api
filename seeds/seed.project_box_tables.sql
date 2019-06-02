BEGIN;

TRUNCATE
    projects, users RESTART IDENTITY CASCADE;

INSERT INTO users (id, username, password)
VALUES
    (1, 'dunder', '11AAaa!'),
    (2, 'testing', 'Testing123!'),
    (3, 'user', 'User999!'),
    (4, 'KnitPearl66!!', 'Password9!');

INSERT INTO projects (title, summary, user_id, materials, steps)
VALUES
    ('knit sweater', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 1, ARRAY['yarn', 'needles'], ARRAY['one', 'two', 'three']),
    ('ring', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?', 2, ARRAY['silver', 'ring mandrel', 'hammer', 'file'], ARRAY['one', 'two', 'three', 'four']),
    ('tatting', 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.', 1, ARRAY['thread', 'shuttle', 'time', 'patience'], ARRAY['one', 'two', 'three']),
    ('bird box', 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.', 1, ARRAY['wood', 'saws', 'tape measure', 'drill', 'screws'], ARRAY[['one', 'two', 'three']]);

COMMIT;