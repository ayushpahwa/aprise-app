CREATE TYPE "account_types" AS ENUM (
  'CASH',
  'SAVINGS_ACCOUNT',
  'CHECKING_ACCOUNT',
  'LOAN',
  'CREDIT_CARD'
);

CREATE TYPE "group_types" AS ENUM (
  'PERSONAL',
  'HOME',
  'TRAVEL'
);

CREATE TYPE "transaction_type" AS ENUM (
  'EXPENSE',
  'INCOME',
  'TRANSFER'
);

CREATE TYPE "transaction_split_type" AS ENUM (
  'EQUAL'
);

CREATE TYPE "transaction_contribution_type" AS ENUM (
    'INPUT',
    'OUTPUT'
);

-- To allow JPA to map the enum types to Java enums, we need to create casts for each enum type.
create cast (varchar as account_types) with inout as implicit;
create cast (varchar as group_types) with inout as implicit;
create cast (varchar as transaction_type) with inout as implicit;
create cast (varchar as transaction_split_type) with inout as implicit;
create cast (varchar as transaction_contribution_type) with inout as implicit;

-- Create sequences for generating unique IDs
CREATE SEQUENCE users_seq;
CREATE SEQUENCE currencies_seq;
CREATE SEQUENCE accounts_seq;
CREATE SEQUENCE groups_seq;
CREATE SEQUENCE group_members_seq;
CREATE SEQUENCE group_currencies_seq;
CREATE SEQUENCE categories_seq;
CREATE SEQUENCE transactions_seq;
CREATE SEQUENCE transaction_tags_seq;
CREATE SEQUENCE transaction_members_seq;

CREATE TABLE "users" (
  "id" BIGINT DEFAULT nextval('users_seq') PRIMARY KEY,
  "full_name" varchar,
  "email" varchar UNIQUE,
  "currency_id" int DEFAULT 1,
  "hash_password" varchar,
  "auth_data" varchar,
  "is_verified" boolean,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "currencies" (
  "id" INT DEFAULT nextval('currencies_seq') PRIMARY KEY,
  "name" varchar,
  "symbol" varchar
);

CREATE TABLE "accounts" (
  "id" INT DEFAULT nextval('accounts_seq') PRIMARY KEY,
  "owner_id" bigint,
  "name" varchar,
  "type" account_types,
  "currency_id" int,
  "current_balance" float,
  "starting_balance" float,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "groups" (
  "id" BIGINT DEFAULT nextval('groups_seq') PRIMARY KEY,
  "name" varchar,
  "type" group_types,
  "currency_id" int,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "group_members" (
  "id" BIGINT DEFAULT nextval('group_members_seq') PRIMARY KEY,
  "group_id" bigint,
  "member_id" bigint,
  "is_owner" boolean DEFAULT false,
  "is_default" boolean DEFAULT false,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "group_currencies" (
  "id" BIGINT DEFAULT nextval('group_currencies_seq') PRIMARY KEY,
  "currency_id" int,
  "group_id" bigint,
  "is_default" boolean DEFAULT false,
  "conversion_rate_to_default" float DEFAULT 1,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "categories" (
  "id" INT DEFAULT nextval('categories_seq') PRIMARY KEY,
  "name" varchar,
  "icon" varchar,
  "created_at" timestamp
);

CREATE TABLE "transactions" (
  "id" BIGINT DEFAULT nextval('transactions_seq') PRIMARY KEY,
  "currency_id" int,
  "group_id" bigint,
  "amount" float,
  "description" varchar,
  "category" int,
  "type" transaction_type,
  "split_type" transaction_split_type,
  "created_by" bigint,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE "transaction_tags" (
  "id" BIGINT DEFAULT nextval('transaction_tags_seq') PRIMARY KEY,
  "transaction_id" bigint,
  "name" varchar,
  "created_at" timestamp
);

CREATE TABLE "transaction_members" (
  "id" BIGINT DEFAULT nextval('transaction_members_seq') PRIMARY KEY,
  "transaction_id" bigint,
  "member_id" bigint,
  "member_account_id" bigint,
  "contribution" transaction_contribution_type,
  "amount" float,
  "is_deleted" boolean DEFAULT false,
  "created_at" timestamp,
  "deleted_at" timestamp
);

CREATE INDEX ON "users" ("email");

CREATE INDEX ON "accounts" ("type", "is_deleted");

CREATE INDEX ON "groups" ("type", "is_deleted");

CREATE INDEX ON "group_members" ("group_id", "is_deleted");

CREATE INDEX ON "group_currencies" ("currency_id", "group_id", "is_deleted");

CREATE INDEX ON "transactions" ("group_id", "created_by", "is_deleted");

CREATE INDEX ON "transaction_members" ("transaction_id", "member_id", "is_deleted");

COMMENT ON COLUMN "users"."id" IS 'Unique identifier for each user';

COMMENT ON COLUMN "users"."full_name" IS 'Full name of the user';

COMMENT ON COLUMN "users"."email" IS 'Email address of the user, must be unique';

COMMENT ON COLUMN "users"."hash_password" IS 'Hashed password for user security';

COMMENT ON COLUMN "users"."currency_id" IS 'Default currency for the user';

COMMENT ON COLUMN "users"."auth_data" IS 'Authentication related data, possibly from OAuth providers';

COMMENT ON COLUMN "users"."is_verified" IS 'Flag to indicate if the user account is verified';

COMMENT ON COLUMN "users"."created_at" IS 'Timestamp when the user account was created';

COMMENT ON COLUMN "users"."deleted_at" IS 'Timestamp for soft deletion, null if not deleted';

COMMENT ON COLUMN "currencies"."id" IS 'Unique identifier for each currency';

COMMENT ON COLUMN "currencies"."name" IS 'Name of the currency (e.g., US Dollar)';

COMMENT ON COLUMN "currencies"."symbol" IS 'Symbol of the currency (e.g., $)';

COMMENT ON COLUMN "accounts"."id" IS 'Unique identifier for each account';

COMMENT ON COLUMN "accounts"."name" IS 'Name of the account';

COMMENT ON COLUMN "accounts"."type" IS 'Type of account (e.g., CASH, SAVINGS_ACCOUNT)';

COMMENT ON COLUMN "accounts"."currency_id" IS 'Default currency of the account';

COMMENT ON COLUMN "accounts"."current_balance" IS 'Current balance in the account';

COMMENT ON COLUMN "accounts"."starting_balance" IS 'Initial balance when the account was created';

COMMENT ON COLUMN "accounts"."is_deleted" IS 'Flag for soft deletion';

COMMENT ON COLUMN "accounts"."created_at" IS 'Timestamp when the account was created';

COMMENT ON COLUMN "accounts"."deleted_at" IS 'Timestamp for soft deletion, null if not deleted';

COMMENT ON COLUMN "groups"."id" IS 'Unique identifier for each group';

COMMENT ON COLUMN "groups"."name" IS 'Name of the group';

COMMENT ON COLUMN "groups"."type" IS 'Type of group (e.g., PERSONAL, HOME)';

COMMENT ON COLUMN "groups"."currency_id" IS 'Default currency of the group';

COMMENT ON COLUMN "groups"."is_deleted" IS 'Flag for soft deletion';

COMMENT ON COLUMN "groups"."created_at" IS 'Timestamp when the group was created';

COMMENT ON COLUMN "groups"."deleted_at" IS 'Timestamp for soft deletion, null if not deleted';

COMMENT ON COLUMN "group_members"."id" IS 'Unique identifier for each group member';

COMMENT ON COLUMN "group_members"."group_id" IS 'Associated group ID';

COMMENT ON COLUMN "group_members"."member_id" IS 'ID of the member user';

COMMENT ON COLUMN "group_members"."is_owner" IS 'Indicates if the member is the owner of the group';

COMMENT ON COLUMN "group_members"."is_deleted" IS 'Flag for soft deletion';

COMMENT ON COLUMN "group_members"."created_at" IS 'Timestamp when the member was added to the group';

COMMENT ON COLUMN "group_members"."deleted_at" IS 'Timestamp for soft deletion, null if not deleted';

COMMENT ON COLUMN "group_currencies"."id" IS 'Unique identifier for each user-currency association';

COMMENT ON COLUMN "group_currencies"."currency_id" IS 'Associated currency ID';

COMMENT ON COLUMN "group_currencies"."group_id" IS 'Associated group ID';

COMMENT ON COLUMN "group_currencies"."is_default" IS 'Indicates if this is the default currency for the user';

COMMENT ON COLUMN "group_currencies"."conversion_rate_to_default" IS 'Conversion rate to the default currency, only applicable if not default';

COMMENT ON COLUMN "group_currencies"."is_deleted" IS 'Flag for soft deletion';

COMMENT ON COLUMN "group_currencies"."created_at" IS 'Timestamp when the association was created';

COMMENT ON COLUMN "group_currencies"."deleted_at" IS 'Timestamp for soft deletion, null if not deleted';

COMMENT ON COLUMN "categories"."id" IS 'Unique identifier for each category';

COMMENT ON COLUMN "categories"."name" IS 'Name of the category';

COMMENT ON COLUMN "categories"."icon" IS 'Icon representing the category';

COMMENT ON COLUMN "categories"."created_at" IS 'Timestamp when the category was created';

COMMENT ON COLUMN "transactions"."id" IS 'Unique identifier for each transaction';

COMMENT ON COLUMN "transactions"."currency_id" IS 'Currency used in the transaction';

COMMENT ON COLUMN "transactions"."group_id" IS 'Associated group ID for the transaction';

COMMENT ON COLUMN "transactions"."amount" IS 'Amount involved in the transaction';

COMMENT ON COLUMN "transactions"."description" IS 'Description of the transaction';

COMMENT ON COLUMN "transactions"."category" IS 'Category of the transaction';

COMMENT ON COLUMN "transactions"."type" IS 'Type of transaction (e.g., EXPENSE, INCOME)';

COMMENT ON COLUMN "transactions"."split_type" IS 'Method used for splitting the transaction';

COMMENT ON COLUMN "transactions"."created_by" IS 'Member ID of the person who created the transaction';

COMMENT ON COLUMN "transactions"."is_deleted" IS 'Flag for soft deletion';

COMMENT ON COLUMN "transactions"."created_at" IS 'Timestamp when the transaction was created';

COMMENT ON COLUMN "transactions"."deleted_at" IS 'Timestamp for soft deletion, null if not deleted';

COMMENT ON COLUMN "transaction_tags"."id" IS 'Unique identifier for each transaction tag';

COMMENT ON COLUMN "transaction_tags"."transaction_id" IS 'Associated transaction ID';

COMMENT ON COLUMN "transaction_tags"."name" IS 'Name of the tag';

COMMENT ON COLUMN "transaction_tags"."created_at" IS 'Timestamp when the tag was created';

COMMENT ON COLUMN "transaction_members"."id" IS 'Unique identifier for each transaction member';

COMMENT ON COLUMN "transaction_members"."transaction_id" IS 'Associated transaction ID';

COMMENT ON COLUMN "transaction_members"."member_id" IS 'ID of the member involved in the transaction';

COMMENT ON COLUMN "transaction_members"."member_account_id" IS 'Account ID used by the member for the transaction';

COMMENT ON COLUMN "transaction_members"."contribution" IS 'Type of contribution by the member (INPUT/OUTPUT)';

COMMENT ON COLUMN "transaction_members"."amount" IS 'Amount contributed or owed by the member, sum should equal the transaction amount';

COMMENT ON COLUMN "transaction_members"."is_deleted" IS 'Flag for soft deletion';

COMMENT ON COLUMN "transaction_members"."created_at" IS 'Timestamp when the member was added to the transaction';

COMMENT ON COLUMN "transaction_members"."deleted_at" IS 'Timestamp for soft deletion, null if not deleted';

-- You can set the current value of each sequence to the maximum existing ID value for each table.

SELECT setval('users_seq', (SELECT MAX(id) FROM "users"));
SELECT setval('currencies_seq', (SELECT MAX(id) FROM "currencies"));
SELECT setval('accounts_seq', (SELECT MAX(id) FROM "accounts"));

-- Foreign keys

ALTER TABLE "accounts" ADD FOREIGN KEY ("currency_id") REFERENCES "currencies" ("id");

ALTER TABLE "accounts" ADD FOREIGN KEY ("owner_id") REFERENCES "users" ("id");

ALTER TABLE "groups" ADD FOREIGN KEY ("currency_id") REFERENCES "currencies" ("id");

ALTER TABLE "group_members" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "group_members" ADD FOREIGN KEY ("member_id") REFERENCES "users" ("id");

ALTER TABLE "group_currencies" ADD FOREIGN KEY ("currency_id") REFERENCES "currencies" ("id");

ALTER TABLE "group_currencies" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("currency_id") REFERENCES "currencies" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("category") REFERENCES "categories" ("id");

ALTER TABLE "transactions" ADD FOREIGN KEY ("created_by") REFERENCES "group_members" ("id");

ALTER TABLE "transaction_tags" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id");

ALTER TABLE "transaction_members" ADD FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("id");

ALTER TABLE "transaction_members" ADD FOREIGN KEY ("member_id") REFERENCES "group_members" ("id");

ALTER TABLE "transaction_members" ADD FOREIGN KEY ("member_account_id") REFERENCES "accounts" ("id");