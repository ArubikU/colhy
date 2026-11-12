import { z } from 'zod';

export const quoteTeamMemberSchema = z.object({
    name: z.string().describe("Full name of the team member"),
    role: z.string().describe("Role in the project (e.g., Senior Developer, UI Designer)"),
    hourlyRate: z.number().optional(),
    allocatedHours: z.number().optional(),
});

export const quoteSignatorySchema = z.object({
    name: z.string(),
    role: z.string(),
    signerIdentifier: z.string().optional().describe("Identification such as DNI, RUC, etc."),
    signatureDate: z.string().optional(),
    signatureLine: z.boolean().optional(),
});

export const quotePhaseSchema = z.object({
    name: z.string().describe("Name of the phase (e.g., Discovery, Development)"),
    description: z.string().describe("Detailed description of what happens in this phase"),
    estimatedHours: z.number(),
    deliverables: z.array(z.string()).describe("List of tangible deliverables"),
    riskFactors: z.array(z.string()).optional(),
});

export const costBreakdownSchema = z.object({
    category: z.string(),
    description: z.string(),
    hours: z.number(),
    hourlyRate: z.number(),
    subtotal: z.number(),
});

export const paymentTermSchema = z.object({
    percentage: z.number(),
    description: z.string(),
    dueDate: z.string().optional(),
});

export const quoteSchema = z.object({
    // Metadata
    quoteNumber: z.string(),
    dateIssued: z.string().describe("ISO date string YYYY-MM-DD"),
    validUntil: z.string().describe("ISO date string YYYY-MM-DD"),
    currency: z.string().default("USD"),

    // Client Info
    clientName: z.string().default("Cliente"),
    clientEmail: z.string().optional(),
    clientCompany: z.string().optional(),

    // Consultant Info
    consultantName: z.string().default("Consultor"),
    consultantCompany: z.string().optional(),
    consultantEmail: z.string().optional(),
    consultantPhone: z.string().optional(),

    // Project Details
    projectTitle: z.string(),
    projectDescription: z.string(),
    projectScope: z.string(),
    objectives: z.array(z.string()),
    keyAssumptions: z.array(z.string()),
    limitations: z.array(z.string()),

    // Technical Details
    technologies: z.array(z.string()),
    methodologies: z.array(z.string()),
    skillsRequired: z.array(z.string()),

    // Team
    teamMembers: z.array(quoteTeamMemberSchema),
    signatories: z.array(quoteSignatorySchema),

    // Delivery Plan
    phases: z.array(quotePhaseSchema),
    estimatedStartDate: z.string().describe("ISO date string"),
    estimatedEndDate: z.string().describe("ISO date string"),
    timeline: z.string().describe("Narrative description of the timeline"),

    // Costs
    costBreakdown: z.array(costBreakdownSchema),
    subtotal: z.number(),
    taxes: z.object({
        type: z.string(),
        rate: z.number(),
        amount: z.number(),
    }).optional(),
    total: z.number(),
    minimumHours: z.number(),

    // Payment Terms
    paymentTerms: z.array(paymentTermSchema),
    paymentMethod: z.string(),
    bankDetails: z.string().optional(),

    // Terms & Conditions
    maintenanceSupport: z.string().optional(),
    warrantyPeriod: z.string().optional().describe("Terms and duration of the project warranty"),
    confidentiality: z.boolean(),
    intellectualProperty: z.string(),
    cancellationPolicy: z.string(),
    revisionRounds: z.number().optional(),

    // Additional
    notes: z.string().optional(),
    specialConditions: z.array(z.string()).optional(),
    attachments: z.array(z.string()).optional(),

    // Extra Details
    extraDetails: z.string().optional().describe("Any additional project-specific details or clauses not covered elsewhere"),
});
