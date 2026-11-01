import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('records',{id:text('id').primaryKey(),data:text('data').notNull(),canonicalUrl:text('canonical_url').notNull().unique(),createdBy:text('created_by').notNull(),createdAt:text('created_at').notNull()});
export const sessions=sqliteTable('sessions',{token:text('token').primaryKey(),role:text('role').notNull(),name:text('name').notNull(),expires:integer('expires').notNull()});
export const settings=sqliteTable('settings',{key:text('key').primaryKey(),value:text('value').notNull()});
export const audit=sqliteTable('audit',{id:text('id').primaryKey(),actor:text('actor').notNull(),action:text('action').notNull(),recordId:text('record_id'),createdAt:text('created_at').notNull()});
export const users=sqliteTable('users',{id:text('id').primaryKey(),name:text('name').notNull(),email:text('email').notNull().unique(),role:text('role').notNull(),jobTitle:text('job_title').notNull(),portfolio:text('portfolio').notNull(),chain:text('chain').notNull(),product:text('product').notNull(),boOwner:text('bo_owner').notNull(),active:integer('active').notNull()});
