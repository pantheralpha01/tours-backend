-- Drop existing unique indexes on phone and idNumber to allow multiple NULLs
DROP INDEX IF EXISTS "User_phone_key" CASCADE;
DROP INDEX IF EXISTS "User_idNumber_key" CASCADE;

