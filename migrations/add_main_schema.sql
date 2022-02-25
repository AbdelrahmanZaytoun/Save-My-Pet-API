CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "firstName" varchar(50),
  "lastName" varchar(50),
  "email" varchar(100) UNIQUE,
  "password" varchar,
  "phone" varchar(45),
  "createdAt" timestamp DEFAULT (now())
);

CREATE TABLE "pets" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(50),
  "type" varchar(50),
  "license" varchar(50),
  "userId" int,
  "createdAt" timestamp DEFAULT (now())
);

ALTER TABLE "pets" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
