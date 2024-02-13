import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './articlelike.controller';
import { LikeService } from './articlelike.service';

describe('LikeController', () => {
  let controller: LikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [LikeService],
    }).compile();

    controller = module.get<LikeController>(LikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
