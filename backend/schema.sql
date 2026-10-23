CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
    is_complited BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- テストデータ
INSERT INTO item (name)
VALUES ('牛乳'), ('食パン'), ('卵');