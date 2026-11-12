
import { pgTable, text, timestamp, uuid, boolean, decimal, jsonb, integer, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
    dataType() {
        return 'bytea';
    },
});

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    userType: text('user_type', { enum: ['consultant', 'client'] }),
    companyName: text('company_name'),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const verificationTokens = pgTable('verification_tokens', {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires').notNull(),
});

export const aiModels = pgTable('ai_models', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    provider: text('provider', { enum: ['openai', 'cohere'] }).notNull(),
    description: text('description'),
    capabilities: text('capabilities').array(), // Stored as text array, e.g. ["reasoning", "vision"]
    costPerMTok: decimal('cost_per_m_tok'),
    isActive: boolean('is_active').default(true),
});

export const quotes = pgTable('quotes', {
    id: uuid('id').primaryKey().defaultRandom(),
    consultantId: uuid('consultant_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    clientId: uuid('client_id').references(() => users.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status', { enum: ['draft', 'pending', 'sent', 'accepted', 'rejected'] }).default('draft'),
    hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
    minimumHours: decimal('minimum_hours', { precision: 10, scale: 2 }),
    estimatedHours: decimal('estimated_hours', { precision: 10, scale: 2 }),
    totalAmount: decimal('total_amount', { precision: 12, scale: 2 }),
    generatedQuote: text('generated_quote'),
    technologies: text('technologies').array(),
    teamMembers: jsonb('team_members'),
    quoteData: jsonb('quote_data'), // Stores structured JSON for editing
    lang: text('lang').default('es'),
    extraDetails: text('extra_details'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const quoteAttachments = pgTable('quote_attachments', {
    id: uuid('id').primaryKey().defaultRandom(),
    quoteId: uuid('quote_id').references(() => quotes.id, { onDelete: 'cascade' }).notNull(),
    fileName: text('file_name').notNull(),
    fileType: text('file_type'),
    fileSize: integer('file_size'),
    fileContent: bytea('file_content'), // Using bytea for storage
    uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const consultantSettings = pgTable('consultant_settings', {
    id: uuid('id').primaryKey().defaultRandom(),
    consultantId: uuid('consultant_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
    aiProvider: text('ai_provider', { enum: ['openai', 'cohere', 'both'] }).default('openai'),
    openaiApiKeyEncrypted: text('openai_api_key_encrypted'),
    cohereApiKeyEncrypted: text('cohere_api_key_encrypted'),
    enableWebSearch: boolean('enable_web_search').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
