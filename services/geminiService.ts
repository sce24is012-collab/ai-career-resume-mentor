import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    atsScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing how well the resume passes ATS." },
    summary: { type: Type.STRING, description: "A brief professional summary of the candidate." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of strong points in the resume." },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of weak points or areas for improvement." },
    missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Important skills that seem to be missing for the candidate's target role." },
    grammarIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific grammar or formatting errors found." },
    skills: {
      type: Type.OBJECT,
      properties: {
        technical: { type: Type.ARRAY, items: { type: Type.STRING } },
        soft: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING, description: "The original text from the resume." },
          suggestion: { type: Type.STRING, description: "The improved version." },
          reason: { type: Type.STRING, description: "Why this change improves the resume." }
        }
      }
    },
    careerPaths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          matchReason: { type: Type.STRING },
          roadmap: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step roadmap to achieve this role." }
        }
      }
    }
  },
  required: ["atsScore", "strengths", "weaknesses", "skills", "improvements", "careerPaths"]
};

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  const prompt = `
    You are an expert Career Mentor and Resume Reviewer. 
    Analyze the following resume text. 
    Be strict but constructive. 
    Provide an ATS score, identify key skills, formatting issues, and suggest concrete improvements.
    Also suggest career paths suitable for this profile.
    
    RESUME TEXT:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a professional, motivating, and detailed career coach.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ResumeAnalysis;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

export const generateResource = async (type: 'headline' | 'bio' | 'email', resumeContext: string, extraContext: string = ""): Promise<string> => {
  let prompt = "";
  switch(type) {
    case 'headline':
      prompt = `Based on the resume, generate 5 strong, optimized LinkedIn headlines. Format them as a list. ${extraContext ? `Context: ${extraContext}` : ''}`;
      break;
    case 'bio':
      prompt = `Write a professional "About Me" summary (Bio) suitable for LinkedIn or a Resume, approx 100 words. Keep it engaging. ${extraContext ? `Context: ${extraContext}` : ''}`;
      break;
    case 'email':
      prompt = `Draft a cold email for a job application. ${extraContext ? `Target Role/Company Details: ${extraContext}` : ''}. Keep it concise and impactful.`;
      break;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `RESUME CONTEXT: ${resumeContext}\n\nTASK: ${prompt}`
  });

  return response.text || "Could not generate resource.";
};

export const createChatSession = (resumeContext: string) => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are a helpful, friendly Career Mentor AI. You have access to the user's resume. 
      RESUME CONTEXT: ${resumeContext.substring(0, 10000)}... 
      
      Answer questions about career advice, interview prep, and skill acquisition. Be concise and encouraging.`,
    }
  });
};
