
import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

export type ResearchConsistencyInput = {
  topic: string;
  objectives: string;
  researchQuestions: string;
  methodology: string;
  results?: string;
  conclusions?: string;
};

export type CitationCheckInput = {
  researchText: string;
  references: string;
  citationStyle?: string;
};
export type ProjectCoachInput = {
  topic: string;
  problemStatement?: string;
  objectives?: string;
  researchQuestions?: string;
  methodology?: string;
  literatureReview?: string;
  results?: string;
  conclusion?: string;
  references?: string;
};

@Injectable()
export class AiService {
  private readonly gemini: GoogleGenAI | null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    this.gemini = apiKey ? new GoogleGenAI({ apiKey }) : null;
  }

  async askResearchAssistant(
    question: string,
    projectContext?: string,
  ): Promise<string> {
    if (!this.gemini) {
      throw new ServiceUnavailableException(
        'Gemini is not configured. Check GEMINI_API_KEY in the backend .env file.',
      );
    }

    if (!question?.trim()) {
      throw new BadRequestException('A research question is required.');
    }

    const prompt = `
You are ProjectMate AI Research Assistant, an academic support
assistant for tertiary students.

Help students understand research concepts, develop research ideas,
improve academic writing, and understand research methodology.

Encourage original work, honest citations, and verification of factual
claims. Never invent references or claim unverified sources are real.

${projectContext?.trim() ? `PROJECT CONTEXT:\n${projectContext.trim()}` : ''}

STUDENT'S QUESTION:
${question.trim()}
`;

    return this.generateAiResponse(prompt);
  }

  async checkResearchConsistency(
    input: ResearchConsistencyInput,
  ): Promise<string> {
    if (!this.gemini) {
      throw new ServiceUnavailableException(
        'Gemini is not configured. Check GEMINI_API_KEY in the backend .env file.',
      );
    }

    if (
      !input.topic.trim() ||
      !input.objectives.trim() ||
      !input.researchQuestions.trim() ||
      !input.methodology.trim()
    ) {
      throw new BadRequestException(
        'Topic, objectives, research questions, and methodology are required.',
      );
    }

    const prompt = `
You are ProjectMate's Research Consistency Checker.
You help tertiary students assess the internal consistency of academic
research projects.

Analyze the following research sections:

RESEARCH TOPIC:
${input.topic}

RESEARCH OBJECTIVES:
${input.objectives}

RESEARCH QUESTIONS:
${input.researchQuestions}

METHODOLOGY:
${input.methodology}

RESULTS OR FINDINGS:
${input.results?.trim() || 'Not provided'}

CONCLUSIONS:
${input.conclusions?.trim() || 'Not provided'}

YOUR TASK:

1. Check whether each research question aligns with one or more
   research objectives.
2. Check whether the methodology is suitable for answering the
   research questions and addressing the objectives.
3. If results or findings are provided, check whether they address
   the stated questions and objectives.
4. If conclusions are provided, assess whether they are supported
   by the supplied findings.
5. Identify missing links, possible contradictions, vague objectives,
   unanswered questions, and conclusions that appear unsupported.
6. Provide specific, practical suggestions for improving consistency.

FORMAT YOUR REPORT:

A. Overall assessment
Give a brief overview of the research's apparent consistency.

B. Objective-to-question alignment
Discuss each objective and its corresponding question. Identify
any objective without a clear question or question without a clear
objective.

C. Methodology alignment
Explain whether the described methods appear capable of answering
the questions. Identify information needed to make a sound assessment.

D. Results and conclusion alignment
Assess the supplied results and conclusions, if available.
If either section is missing, state that it cannot yet be assessed.
Do not assume missing sections are errors in a research proposal.

E. Issues requiring attention
For each issue, state:
- The section concerned
- The possible inconsistency
- Why it matters
- A suggested improvement

F. Recommended next steps
List the most important improvements in priority order.

IMPORTANT RULES:
- Base your assessment only on the information supplied.
- Do not invent results, evidence, or missing research details.
- Distinguish apparent inconsistencies from matters requiring clarification.
- If information is insufficient, explicitly say so.
- Present AI findings as suggestions for the student to verify,
  not as unquestionable facts.
- Do not claim that a research method is unsuitable without explaining
  the reason and any relevant assumptions.
- Use clear language appropriate for tertiary students.
`;

    return this.generateAiResponse(prompt);
  }

  async checkCitations(
    input: CitationCheckInput,
  ): Promise<string> {
    if (!this.gemini) {
      throw new ServiceUnavailableException(
        'Gemini is not configured. Check GEMINI_API_KEY in the backend .env file.',
      );
    }

    if (
      typeof input?.researchText !== 'string' ||
      !input.researchText.trim()
    ) {
      throw new BadRequestException(
        'Please provide the research text containing in-text citations.',
      );
    }

    if (
      typeof input?.references !== 'string' ||
      !input.references.trim()
    ) {
      throw new BadRequestException(
        'Please provide the reference list.',
      );
    }

    const citationStyle = input.citationStyle?.trim() || 'APA 7';

    const prompt = `
You are ProjectMate's Citation and Reference Checker.
Help tertiary students check the consistency and formatting of academic
in-text citations and reference lists.

CITATION STYLE REQUESTED:
${citationStyle}

RESEARCH TEXT:
${input.researchText.trim()}

REFERENCE LIST:
${input.references.trim()}

TASKS:

1. Identify the in-text citations that appear in the supplied research text.
2. Compare those citations with the supplied reference list.
3. Identify citations that appear to have no matching reference-list entry.
4. Identify reference-list entries that do not appear to be cited in the
   supplied research text.
5. Check whether author names and publication years appear to match
   between citations and reference entries.
6. Flag potentially incomplete reference entries, such as entries that
   appear to lack an author, date, title, source, publisher, journal
   information, DOI, or URL where applicable.
7. Review formatting against the requested citation style, focusing on
   the elements that can reasonably be assessed from the supplied text.
8. Suggest corrections and explain what information the student must
   verify or provide.

FORMAT YOUR REPORT:

A. Overall assessment
Summarize the apparent consistency of the citations and references.
Do not assign a misleading guarantee of correctness.

B. Citations missing from the reference list
List each suspected unmatched citation, its location or wording where
identifiable, and the action required. If none are found, say so.

C. References not cited in the supplied text
List each reference that appears not to be cited. Explain that it may
still be cited elsewhere in the student's full document.

D. Possible author or year mismatches
Identify discrepancies between in-text citations and reference entries.

E. Incomplete references
For each entry, state the information that appears to be missing.
Do not fill gaps by guessing.

F. Formatting suggestions
Give practical corrections for the requested style. When useful, show
a suggested format using only information actually supplied.

G. Recommended next steps
List the most important corrections in priority order.

IMPORTANT RULES:
- Examine only the research text and reference list provided.
- Do not invent authors, titles, years, journal names, DOIs, URLs,
  publishers, page ranges, or other bibliographic details.
- Do not claim that a source is real, authentic, or independently verified.
- Similar author names may refer to different people; flag uncertainty.
- A citation may be missing because only part of the research document
  was supplied. State this limitation.
- Do not treat every reference not cited in the supplied excerpt as
  definitively unused in the full document.
- Distinguish definite text-matching observations from likely issues
  that need human review.
- Follow the requested citation style as accurately as possible.
- Use clear language appropriate for tertiary students.
`;

    return this.generateAiResponse(prompt);
  }

  async generateProjectCoach(input: ProjectCoachInput): Promise<string> {
    if (!this.gemini) {
      throw new ServiceUnavailableException(
        'Gemini is not configured. Check GEMINI_API_KEY in the backend .env file.',
      );
    }

    if (typeof input?.topic !== 'string' || !input.topic.trim()) {
      throw new BadRequestException(
        'Please provide your research topic.',
      );
    }

    const sections = {
      'Research topic': input.topic,
      'Problem statement': input.problemStatement,
      Objectives: input.objectives,
      'Research questions': input.researchQuestions,
      Methodology: input.methodology,
      'Literature review': input.literatureReview,
      Results: input.results,
      Conclusion: input.conclusion,
      References: input.references,
    };

    const researchDetails = Object.entries(sections)
      .map(([name, content]) =>
        `${name}:\n${
          typeof content === 'string' && content.trim()
            ? content.trim()
            : 'NOT PROVIDED — mark as Not assessed; do not penalize.'
        }`,
      )
      .join('\n\n');

    const prompt = `
You are ProjectMate's Project Intelligence and Research Coach.
Help tertiary students improve their academic research and prepare for project defence.

Review the research information provided below.

IMPORTANT SCORING RULES:
1. Assess only information actually provided.
2. Never penalize a student because a section is missing.
3. Mark missing sections "Not assessed".
4. Give a score out of 100 only when enough supplied information supports a meaningful assessment. Otherwise write "Not enough information to score reliably".
5. Explain that this is guidance, not an official university grade.
6. Do not invent research findings, citations, references, or facts.
7. Use clear, supportive language and practical advice.
8. Identify the most important improvements first.

RESEARCH INFORMATION:
${researchDetails}

Return your report using exactly these headings:

PROJECT INTELLIGENCE SCORE
Give the score or explain why there is not enough information to score reliably. Briefly explain the assessment.

SECTION REVIEW
Review the supplied sections. For missing sections, write "Not assessed".

TOP IMPROVEMENT PRIORITIES

Provide exactly THREE improvement priorities, ranked from most
important to least important, based on the research information supplied.

For each priority, use this format:

1. PRIORITY: [Short, specific title]
   SEVERITY: [High, Medium, or Low]
   AFFECTED SECTION: [Relevant chapter or research section]
   PROBLEM IDENTIFIED: [Explain the specific weakness or inconsistency
   visible in the supplied research.]
   WHY IT MATTERS: [Explain the effect on research quality,
   clarity, validity, or consistency.]
   PRACTICAL CORRECTION: [Give clear, actionable steps the student
   can take to address the problem.]

2. Follow the same format.

3. Follow the same format.

RULES:
- Base every priority on the research information supplied.
- Do not invent weaknesses, evidence, findings, or contradictions.
- Do not repeat the same issue under different priorities.
- Rank issues by their likely importance to the quality of the research.
- If the information is insufficient to identify three genuine
  weaknesses, state this clearly for the remaining priorities instead
  of inventing problems.
- Distinguish confirmed issues from concerns that need verification.
- For missing sections, state "Not assessed" and do not penalize
  the student for their absence.
- Make the advice practical for Nigerian ND, HND, university,
  and college of education students.
DEFENCE PREPARATION

Prepare the student to defend the research project before an academic
panel. Base all questions and guidance on the research information
actually supplied.

A. LIKELY DEFENCE QUESTIONS

Provide 10 relevant defence questions, numbered 1 to 10.

Cover these areas where the supplied information permits:
- Research topic, background, and choice of study
- Problem statement and research gap
- Aim, objectives, and research questions
- Literature review and relevant theories
- Research design and methodology
- Study population, sampling, instruments, and data analysis,
  where applicable
- Findings and interpretation, if results are provided
- Conclusions and recommendations, if provided
- Limitations and the contribution of the research

Make the questions specific to the student's actual topic and content.
Avoid generic questions that could apply to any project.

B. ANSWER GUIDANCE

For each of the 10 questions:
- Explain the key points a strong answer should cover.
- Identify relevant sections of the student's own research.
- Suggest a clear structure for answering confidently.
- Include a brief sample answer only when the supplied information
  supports one.
- Tell the student which details they must supply from their actual
  project when the available information is insufficient.

C. TOPICS TO REVISE

List the most relevant topics the student should revise before the
defence. For each topic, explain:
- What they need to understand
- Why it matters to their project
- Which chapter or section to review

Prioritize essential project knowledge and methodology over general
presentation advice.

IMPORTANT RULES:
- Never invent findings, sample sizes, statistics, procedures,
  references, or conclusions.
- Do not write answers that encourage the student to claim work
  they did not perform.
- If a research section is missing, do not pretend it was assessed.
- Distinguish details drawn from the supplied project from general
  academic guidance.
- Use clear, practical language appropriate for Nigerian ND, HND,
  university, and college of education students.
- Encourage the student to answer in their own words and verify
  their answers against their actual project.
NEXT STEP
Recommend one practical action the student should take next.
`;

    return this.generateAiResponse(prompt);
  }

async generateProblemStatement(input: {
  topic: string;
  problemStatement?: string;
  objectives?: string;
}): Promise<string> {
  if (!input.topic?.trim()) {
    throw new BadRequestException(
      'Please provide your research topic.',
    );
  }

  const prompt = `
You are an academic research writing assistant for Nigerian ND, HND,
university, and college of education students.

Help the student develop a draft problem statement and research objectives.

RESEARCH TOPIC:
${input.topic}

EXISTING PROBLEM STATEMENT:
${input.problemStatement?.trim() || 'Not provided'}

EXISTING OBJECTIVES:
${input.objectives?.trim() || 'Not provided'}

Instructions:
1. Write a clear, formal problem statement explaining the background
   of the problem, the specific gap or challenge, and why the study
   is necessary.
2. Do not invent statistics, citations, research findings, or facts.
3. Clearly distinguish general context from facts the student must
   verify using credible sources.
4. Provide one general objective.
5. Provide 3 to 4 specific, measurable objectives beginning with
   suitable action verbs such as design, develop, implement, or evaluate.
6. Keep the content relevant to the exact research topic.
7. Use clear academic English suitable for a student project.
8. Present these headings:
   PROPOSED PROBLEM STATEMENT
   GENERAL OBJECTIVE
   SPECIFIC OBJECTIVES
   POINTS THE STUDENT MUST VERIFY
9. Explain that the student should adapt the draft to their actual
   project and supervisor's requirements.

Generate the draft now.
`;

  return this.generateAiResponse(prompt);
}

  private async generateAiResponse(prompt: string): Promise<string> {
    try {
      if (!this.gemini) {
        throw new ServiceUnavailableException(
          'Gemini is not configured.',
        );
      }

      let answer: string | undefined;

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const response = await this.gemini.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
          });

          answer = response.text;
          break;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);

          const isTemporaryError =
            errorMessage.includes('503') ||
            errorMessage.includes('UNAVAILABLE') ||
            errorMessage.includes('high demand') ||
            errorMessage.includes('429') ||
            errorMessage.includes('RESOURCE_EXHAUSTED');

          if (!isTemporaryError || attempt === 3) {
            throw error;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, attempt * 2000),
          );
        }
      }

      if (!answer?.trim()) {
        throw new ServiceUnavailableException(
          'The AI returned an empty response. Please try again.',
        );
      }

      return answer;
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      console.error(
        'ProjectMate Gemini request failed:',
        error instanceof Error ? error.message : 'Unknown error',
      );

      throw new ServiceUnavailableException(
        'The AI assistant could not respond. Gemini may be temporarily unavailable, or your API access or usage limit may need checking.',
      );
    }
  }
}
