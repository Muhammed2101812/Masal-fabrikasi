// lib/ageLengths.ts

export interface AgeLengthConfig {
  minLength: number;
  maxLength: number;
  targetLength: number;
}

export const ageLengths: Record<string, AgeLengthConfig> = {
  '3-5': {
    minLength: 80,
    maxLength: 120,
    targetLength: 100
  },
  '6-8': {
    minLength: 150,
    maxLength: 250,
    targetLength: 200
  },
  '9-12': {
    minLength: 250,
    maxLength: 350,
    targetLength: 300
  }
};

export const getAgeLengthConfig = (ageGroup: string): AgeLengthConfig => {
  return ageLengths[ageGroup] || ageLengths['6-8']; // Default to 6-8 if not found
};