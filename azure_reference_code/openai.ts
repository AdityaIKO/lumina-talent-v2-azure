/**
 * AZURE OPENAI SERVICE INTEGRATION
 * Core feature for:
 * 1. Matchmaking Co-Pilot (Employer <-> Freelancer)
 * 2. Auto-Draft Proposal
 * 3. AI Smart Sorting (Applicants)
 * 4. AI Chatbot (Messaging)
 * 5. Profile Settings Summary
 */

import { AzureOpenAI } from "openai";

const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

// Initialize Azure OpenAI Client
let client: AzureOpenAI | null = null;

if (API_KEY && ENDPOINT && DEPLOYMENT_NAME) {
  client = new AzureOpenAI({
    endpoint: ENDPOINT,
    apiKey: API_KEY,
    deployment: DEPLOYMENT_NAME,
    apiVersion: "2024-02-15-preview"
  });
}

export class AzureOpenAIService {
  
  /**
   * Matchmaking Co-Pilot: Analyze job requirements vs Freelancer CV
   */
  static async analyzeMatch(jobDescription: string, freelancerProfile: any) {
    if (!client) {
      console.warn("Azure OpenAI client not initialized. Returning mock data.");
      return { matchScore: 85, summary: "Highly compatible based on React skills." };
    }
    
    try {
      const response = await client.chat.completions.create({
        model: DEPLOYMENT_NAME || "",
        messages: [
          { role: "system", content: "You are an AI matchmaking assistant. Given a job description and a freelancer profile, determine a match score out of 100 and a short summary of why they are a match. Output JSON format: { \"matchScore\": number, \"summary\": \"string\" }" },
          { role: "user", content: `Job: ${jobDescription}\n\nProfile: ${JSON.stringify(freelancerProfile)}` }
        ],
        response_format: { type: "json_object" }
      });
      
      const content = response.choices[0]?.message?.content;
      if (content) return JSON.parse(content);
      return { matchScore: 0, summary: "Failed to analyze match." };
    } catch (error) {
      console.error("Error analyzing match:", error);
      return { matchScore: 0, summary: "Error occurred during matching." };
    }
  }

  /**
   * Auto-Draft Proposal for Freelancer
   */
  static async generateProposalDraft(jobDetails: any, freelancerProfile: any) {
    if (!client) return "This is a mock AI-generated proposal draft.";
    
    try {
      const response = await client.chat.completions.create({
        model: DEPLOYMENT_NAME || "",
        messages: [
          { role: "system", content: "You are an expert proposal writer for freelancers. Create a compelling, professional proposal based on the job details and the freelancer's profile." },
          { role: "user", content: `Job Details: ${JSON.stringify(jobDetails)}\n\nFreelancer Profile: ${JSON.stringify(freelancerProfile)}` }
        ]
      });
      
      return response.choices[0]?.message?.content || "Draft generated from Azure OpenAI";
    } catch (error) {
      console.error("Error generating proposal draft:", error);
      return "Error generating proposal draft.";
    }
  }

  /**
   * AI Smart Sorting for Employers (Rank applicants)
   */
  static async rankApplicants(jobRequirements: any, applicants: any[]) {
    if (!client) return applicants.map(app => ({ ...app, aiScore: Math.floor(Math.random() * 100) }));

    try {
      const response = await client.chat.completions.create({
        model: DEPLOYMENT_NAME || "",
        messages: [
          { role: "system", content: "You are an AI smart sorting system. Given a list of applicants and job requirements, assign an aiScore (0-100) to each applicant. Return a JSON array of objects with applicant id and aiScore: [{ \"id\": string, \"aiScore\": number }]" },
          { role: "user", content: `Job Requirements: ${JSON.stringify(jobRequirements)}\n\nApplicants: ${JSON.stringify(applicants)}` }
        ],
        response_format: { type: "json_object" }
      });
      
      const content = response.choices[0]?.message?.content;
      if (content) {
        const result = JSON.parse(content);
        const scores = result.scores || result;
        return applicants.map(app => {
          const scoreObj = scores.find((s: any) => s.id === app.id);
          return { ...app, aiScore: scoreObj ? scoreObj.aiScore : 0 };
        }).sort((a, b) => b.aiScore - a.aiScore);
      }
      return applicants;
    } catch (error) {
      console.error("Error ranking applicants:", error);
      return applicants;
    }
  }

  /**
   * AI Chatbot (Messaging feature)
   */
  static async getChatbotResponse(messageHistory: any[]) {
    if (!client) return "I am Lumina AI, how can I help you today?";
    
    try {
      const response = await client.chat.completions.create({
        model: DEPLOYMENT_NAME || "",
        messages: [
          { role: "system", content: "You are Lumina AI, a helpful assistant for the Lumina Talent marketplace." },
          ...messageHistory
        ]
      });
      
      return response.choices[0]?.message?.content || "Response from Azure OpenAI";
    } catch (error) {
      console.error("Error generating chatbot response:", error);
      return "Error processing your message.";
    }
  }
}
