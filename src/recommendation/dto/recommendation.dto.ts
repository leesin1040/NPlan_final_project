import { IsString } from 'class-validator';

export class CreateRecommendationDto {
  @IsString()
  region: string;
}
