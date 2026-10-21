
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service.js';
import type {
  CitationCheckInput,
  ResearchConsistencyInput,
  ProjectCoachInput,
} from './ai.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-problem-statement')
  async generateProblemStatement(
    @Body()
    body: {
      topic: string;
      problemStatement?: string;
      objectives?: string;
    },
  ) {
    if (!body?.topic?.trim()) {
      throw new BadRequestException(
        'Please provide your research topic.',
      );
    }

    const result =
      await this.aiService.generateProblemStatement({
        topic: body.topic,
        problemStatement: body.problemStatement,
        objectives: body.objectives,
      });

    return {
      success: true,
      result,
    };
  }

  @Post('research-assistant')
  async askResearchAssistant(
    @Body()
    body: {
      question?: string;
      projectContext?: string;
    },
  ) {
    if (
      typeof body?.question !== 'string' ||
      !body.question.trim()
    ) {
      throw new BadRequestException(
        'Please provide a research question.',
      );
    }

    if (
      body.projectContext !== undefined &&
      typeof body.projectContext !== 'string'
    ) {
      throw new BadRequestException(
        'Project context must be text.',
      );
    }

    const answer = await this.aiService.askResearchAssistant(
      body.question,
      body.projectContext,
    );

    return {
      success: true,
      answer,
    };
  }

  @Post('research-consistency')
  async checkResearchConsistency(
    @Body()
    body: Partial<ResearchConsistencyInput>,
  ) {
    const requiredFields = [
      'topic',
      'objectives',
      'researchQuestions',
      'methodology',
    ] as const;

    for (const field of requiredFields) {
      if (
        typeof body?.[field] !== 'string' ||
        !body[field].trim()
      ) {
        throw new BadRequestException(
          `${field} is required and must contain text.`,
        );
      }
    }

    for (const field of ['results', 'conclusions'] as const) {
      if (
        body[field] !== undefined &&
        typeof body[field] !== 'string'
      ) {
        throw new BadRequestException(
          `${field} must be text when provided.`,
        );
      }
    }

    const report =
      await this.aiService.checkResearchConsistency({
        topic: body.topic!,
        objectives: body.objectives!,
        researchQuestions: body.researchQuestions!,
        methodology: body.methodology!,
        results: body.results,
        conclusions: body.conclusions,
      });

    return {
      success: true,
      report,
    };
  }

  @Post('citation-checker')
  async checkCitations(
    @Body()
    body: Partial<CitationCheckInput>,
  ) {
    if (
      typeof body?.researchText !== 'string' ||
      !body.researchText.trim()
    ) {
      throw new BadRequestException(
        'Research text is required and must contain text.',
      );
    }

    if (
      typeof body?.references !== 'string' ||
      !body.references.trim()
    ) {
      throw new BadRequestException(
        'Your reference list is required and must contain text.',
      );
    }

    if (
      body.citationStyle !== undefined &&
      typeof body.citationStyle !== 'string'
    ) {
      throw new BadRequestException(
        'Citation style must be text.',
      );
    }

    const report = await this.aiService.checkCitations({
      researchText: body.researchText,
      references: body.references,
      citationStyle: body.citationStyle,
    });

    return {
      success: true,
      report,
    };
  }

  @Post('project-coach')
  async generateProjectCoach(
    @Body() body: Partial<ProjectCoachInput>,
  ) {
    if (
      typeof body?.topic !== 'string' ||
      !body.topic.trim()
    ) {
      throw new BadRequestException(
        'Please provide your research topic.',
      );
    }

    const report = await this.aiService.generateProjectCoach({
      topic: body.topic,
      problemStatement: body.problemStatement,
      objectives: body.objectives,
      researchQuestions: body.researchQuestions,
      methodology: body.methodology,
      literatureReview: body.literatureReview,
      results: body.results,
      conclusion: body.conclusion,
      references: body.references,
    });

    return {
      success: true,
      report,
    };
  }
}
