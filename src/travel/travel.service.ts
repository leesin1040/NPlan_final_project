import { Travel } from 'src/travel/entities/travel.entity';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from 'src/member/entities/member.entity';
import { Day } from 'src/day/entities/day.entity';

@Injectable()
export class TravelService {
  constructor(
    @InjectRepository(Travel)
    private readonly travelRepository: Repository<Travel>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>,
  ) {}
  /**여행 생성 */
  async create(userId: number, createTravelDto: CreateTravelDto) {
    const { title, color, region, theme, start_date, end_date } = createTravelDto;
    const newTravel = await this.travelRepository.save({
      title,
      color,
      region,
      theme,
      start_date,
      end_date,
      userId,
    });
    /** 기본 맴버 자신 추가 */
    await this.memberRepository.save({
      travelId: newTravel.id,
      userId,
    });
    return { newTravel };
  }

  /**여행 복제 */
  copy() {
    //트레블, 데이, 스케쥴값을 travel_id로 조회해서 다 가져온 다음
    //데이터를 복제해서 새로 save 한다.
  }

  // --
  /** 여행 목록(자신의 보드만 조회) */
  async findAll(userId: number) {
    /**내가 만든 여행목록 */
    const myTravels = await this.travelRepository.find({
      where: {
        userId: userId,
      },
      relations: ['member'],
      select: ['id', 'title', 'color', 'region', 'theme', 'member', 'start_date', 'end_date'],
    });
    // 내가 만든 여행목록 정렬
    myTravels.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    /**초대된 여행 목록 - 수락/거절 컬럼을 넣을 것인가? */
    const invitedTravelsRaw = await this.memberRepository.find({
      where: {
        userId: userId,
      },
      relations: ['travel', 'travel.member'],
    });
    /**초대된 여행 목록을 map으로 원하는 정보만 전달, filter로 내가 만든 목록과 중복시 제외 */
    const invitedTravels = invitedTravelsRaw
      .filter((item) => item.travel !== null) // null이 아닌 travel만 처리
      .map((item) => {
        return {
          id: item.travel.id,
          title: item.travel.title,
          color: item.travel.color,
          region: item.travel.region,
          theme: item.travel.theme,
          members: item.travel.member,
          start_date: item.travel.start_date,
          end_date: item.travel.end_date,
        };
      })
      .filter((invitedTravel) => !myTravels.some((myTravel) => myTravel.id === invitedTravel.id));
    // 초대받은 여행 목록 정렬
    invitedTravels.sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    );

    return { myTravels, invitedTravels };
  }
  // --
  /**여행 상세 조회 */
  async findOneTravel(id: number, userId: number) {
    const oneTravel = await this.travelRepository.findOne({ where: { id } });
    if (!oneTravel) {
      throw new NotFoundException('존재하지 않는 여행보드 입니다.');
    }
    await this.checkTravelMember(id, userId);

    return { oneTravel };
  }

  // --
  /**여행 수정 */
  async update(id: number, userId: number, updateTravelDto: UpdateTravelDto) {
    await this.findOneTravel(id, userId);
    const updateTravel = this.travelRepository.update({ id }, updateTravelDto);
    return { travel: updateTravel };
  }
  // --
  /**여행 삭제(소프트삭제) */
  async remove(id: number, userId: number) {
    const findThisTravel = await this.findOneTravel(id, userId);
    /**보드 작성자만 삭제 권한 */
    if (findThisTravel.oneTravel.userId !== userId) {
      throw new UnauthorizedException('작성자만 여행보드를 삭제할 수 있습니다.');
    }
    await this.travelRepository.softDelete({ id });
    return { message: '여행 보드가 삭제되었습니다.' };
  }

  // ~~
  /**보드 맴버 확인 */
  async checkTravelMember(id: number, userId: number): Promise<Travel | any> {
    const isTravelMember = await this.memberRepository.findOne({
      where: { travelId: id, userId: userId },
    });
    if (!isTravelMember) {
      throw new UnauthorizedException('접근 권한이 없습니다.');
    }
  }
}
