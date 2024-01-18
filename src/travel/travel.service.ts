import { Travel } from 'src/travel/entities/travel.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from 'src/member/entities/member.entity';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    @InjectRepository(Travel)
    private readonly memberRepository: Repository<Member>,
  ) {}
  /**여행 생성 */
  async create(user_id: number, createTravelDto: CreateTravelDto) {
    const { title, color, region, theme, start_date, end_date } = createTravelDto;
    const newTravel = await this.travelRepository.save({
      title,
      color,
      region,
      theme,
      start_date,
      end_date,
      user_id,
    });
    /** 기본 맴버 자신 추가 */
    await this.memberRepository.save({
      travel_id: newTravel.id,
      user_id,
    });
    return newTravel;
  }
  // --
  /** 여행 목록(자신의 보드만 조회) */
  async findAll(user_id: number) {
    /**내가 만든 여행목록 */
    const myTravels = await this.travelRepository.find({
      where: {
        user_id: user_id,
      },
      select: ['id', 'title', 'color', 'region', 'theme'],
    });
    /**초대된 여행 목록 - 수락/거절 컬럼을 넣을 것인가? */
    const invitedTravels = await this.memberRepository.find({
      where: {
        user_id: user_id,
      },
      relations: ['travel'],
    });
    return { myTravels, invitedTravels };
  }
  // --
  /**여행 상세 조회 */
  async findOneTravel(id: number, user_id: number) {
    const oneTravel = await this.travelRepository.findOne({ where: { id } });
    await this.checkTravelMember(id, user_id);
    return { oneTravel };
  }

  // --
  /**여행 수정 */
  async update(id: number, user_id: number, updateTravelDto: UpdateTravelDto) {
    await this.findOneTravel(id, user_id);
    const updateTravel = this.travelRepository.update({ id }, updateTravelDto);
    return { travel: updateTravel };
  }
  // --
  /**여행 삭제(소프트삭제) */
  async remove(id: number, user_id: number) {
    const findThisTravel = await this.findOneTravel(id, user_id);
    /**보드 작성자만 삭제 권한 */
    if (findThisTravel.oneTravel.user_id !== user_id) {
      throw new UnauthorizedException('작성자만 여행보드를 삭제할 수 있습니다.');
    }
    await this.travelRepository.softDelete({ id });
    return { message: '여행 보드가 삭제되었습니다.' };
  }

  // ~~
  /**보드 맴버 확인 */
  async checkTravelMember(id: number, user_id: number): Promise<Travel | any> {
    const isTravelMember = await this.memberRepository.findOne({
      where: { travel_id: id, user_id },
    });
    if (!isTravelMember) {
      throw new UnauthorizedException('접근 권한이 없습니다.');
    }
  }
}
