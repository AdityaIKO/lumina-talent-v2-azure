/**
 * AZURE COSMOS DB INTEGRATION
 * Core database for:
 * 1. User Profiles (Freelancers & Employers)
 * 2. Job Postings & Applications
 * 3. Chat Messages
 * 4. Financial Transactions (Escrow, Invoicing)
 */

import { CosmosClient, Database } from "@azure/cosmos";

const ENDPOINT = process.env.AZURE_COSMOS_DB_ENDPOINT;
const KEY = process.env.AZURE_COSMOS_DB_KEY;
const DB_NAME = process.env.AZURE_COSMOS_DB_DATABASE_NAME || "LuminaTalentDB";

let client: CosmosClient | null = null;
let database: Database | null = null;

export class CosmosDBService {
  
  static async connect() {
    if (!ENDPOINT || !KEY) {
      console.warn("Cosmos DB credentials missing. Running in mock mode.");
      return null;
    }
    
    if (!client) {
      client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
      database = client.database(DB_NAME);
      
      // Ensure database and containers exist (uncomment in production or run initialization script)
      // await client.databases.createIfNotExists({ id: DB_NAME });
      // await database.containers.createIfNotExists({ id: "Users", partitionKey: "/id" });
      // await database.containers.createIfNotExists({ id: "Jobs", partitionKey: "/employerId" });
      // await database.containers.createIfNotExists({ id: "Transactions", partitionKey: "/id" });
      
      console.log(`Connected to CosmosDB at ${ENDPOINT}`);
    }
    return client;
  }

  /**
   * Create or Update User Profile
   */
  static async upsertUserProfile(userId: string, profileData: any) {
    await this.connect();
    if (!database) return { id: userId, ...profileData };

    try {
      const container = database.container("Users");
      const { resource } = await container.items.upsert({ id: userId, ...profileData });
      return resource;
    } catch (error) {
      console.error("Error upserting user profile in CosmosDB:", error);
      throw error;
    }
  }

  /**
   * Save new Job Posting
   */
  static async createJobPosting(employerId: string, jobData: any) {
    await this.connect();
    const jobId = `job-${Date.now()}`;
    if (!database) return { id: jobId, employerId, ...jobData };

    try {
      const container = database.container("Jobs");
      const { resource } = await container.items.create({ id: jobId, employerId, ...jobData });
      return resource;
    } catch (error) {
      console.error("Error creating job posting in CosmosDB:", error);
      throw error;
    }
  }

  /**
   * Record Escrow/Financial Transaction
   */
  static async recordTransaction(transactionData: any) {
    await this.connect();
    const trxId = `trx-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    if (!database) return { id: trxId, ...transactionData, timestamp };

    try {
      const container = database.container("Transactions");
      const { resource } = await container.items.create({ id: trxId, ...transactionData, timestamp });
      return resource;
    } catch (error) {
      console.error("Error recording transaction in CosmosDB:", error);
      throw error;
    }
  }
}
