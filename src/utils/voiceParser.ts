import OpenAI from 'openai';
import type { VoiceParseResult } from '../types/voice';

function getOpenAIClient() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env.local file.');
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    
    console.log('🎤 Transcribing audio...', { size: audioBlob.size, type: audioBlob.type });
    
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    console.log('📝 Transcription result:', transcription.text);
    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

export async function parseVoiceInput(transcript: string): Promise<VoiceParseResult> {
  try {
    console.log('🔍 Parsing transcript:', transcript);
    
    const openai = getOpenAIClient();
    const prompt = `Analyze the following transcription and extract relevant information for a construction estimate. Return ONLY valid JSON in this format:
{
  "type": "lineItems" | "projectDetails" | "scope" | "mixed",
  "items": [
    {
      "description": "item description",
      "quantity": number,
      "unitCost": number,
      "confidence": 0.0-1.0,
      "needsReview": boolean
    }
  ],
  "projectDetails": {
    "projectName": "string",
    "client": "string", 
    "address": "string",
    "projectType": "Multi-Family" | "Townhome" | "Commercial TI",
    "buildings": number,
    "units": number,
    "bidDate": "YYYY-MM-DD"
  },
  "scope": {
    "inclusions": ["string"],
    "exclusions": ["string"],
    "deliveryTerms": ["string"],
    "comments": "string"
  }
}

Transcription: "${transcript}"

ANALYSIS INSTRUCTIONS:
1. DETERMINE TYPE:
   - "lineItems" if talking about materials, costs, quantities
   - "projectDetails" if talking about project name, client, address, dates
   - "scope" if talking about what's included/excluded, delivery terms, comments
   - "mixed" if multiple types detected

2. FOR LINE ITEMS:
   - Look for quantities, descriptions, and costs
   - If quantity missing, use 1 as default
   - If cost missing, use 0 and set needsReview true
   - Examples: "10 bags concrete at $15", "Add paint", "5 gallons at $30"

3. FOR PROJECT DETAILS:
   - Extract project name, client name, address
   - Identify project type from context
   - Extract building/unit counts
   - Parse dates (convert to YYYY-MM-DD format)

4. FOR SCOPE:
   - Identify inclusions (what's included)
   - Identify exclusions (what's not included)  
   - Extract delivery terms and conditions
   - Capture general comments

5. CONFIDENCE & REVIEW:
   - Set confidence 1.0 if very clear, lower if uncertain
   - Set needsReview true if any field is ambiguous or missing

EXAMPLES:
- "Add 10 bags of concrete at $15 each" → type: "lineItems", items: [...]
- "This is for ABC Construction, 123 Main St" → type: "projectDetails", projectDetails: {...}
- "Include installation and warranty" → type: "scope", scope: {inclusions: [...]}
- "Add concrete for ABC Construction" → type: "mixed", items: [...], projectDetails: {...}`;

    console.log('🤖 Sending to GPT-4 for parsing...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an intelligent construction estimate parser. Analyze voice input and extract structured data for project details, line items, and scope information. Return only valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const rawResponse = completion.choices[0].message.content || '{}';
    console.log('🤖 Raw GPT response:', rawResponse);
    
    const response = JSON.parse(rawResponse);
    console.log('📊 Parsed response:', response);
    
    return {
      type: response.type || 'lineItems',
      items: response.items || [],
      projectDetails: response.projectDetails,
      scope: response.scope,
      success: true,
    };
  } catch (error) {
    console.error('❌ Error parsing voice input:', error);
    return {
      type: 'lineItems',
      items: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Keep the old function for backward compatibility
export async function parseLineItems(transcript: string): Promise<VoiceParseResult> {
  const result = await parseVoiceInput(transcript);
  return {
    ...result,
    type: 'lineItems',
    projectDetails: undefined,
    scope: undefined,
  };
}

export async function processVoiceInput(audioBlob: Blob): Promise<VoiceParseResult> {
  try {
    const transcript = await transcribeAudio(audioBlob);
    const result = await parseVoiceInput(transcript);
    return result;
  } catch (error) {
    return {
      type: 'lineItems',
      items: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
