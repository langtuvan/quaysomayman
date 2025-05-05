import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
// guard pipe
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ObjectIdPipe } from 'src/pipe/object-id.pipe';
import { CurrentUser } from 'src/auth/current-user.decorator';
// service, model, dto
import {
  FortuneModel,
  PersonModel,
  PrizeType,
  WinnerModel,
} from './fortune.model';
import { FortuneService } from './fortune.service';
import {
  FortuneDto,
  RandomInput,
  SpinWheelInput,
  UpdateFortuneDto,
  WinnerInput,
} from './dto/fortune.dto';
import _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceModel } from 'src/type/ConfigService';

// others ref

@Resolver(() => FortuneModel)
export class FortuneResolver {
  constructor(
    private fortuneService: FortuneService,
    private readonly configService: ConfigService<ConfigServiceModel>,
  ) {}

  MAX_FORTUNE = this.configService.get('CONFIG').PLAN.MAX_FORTUNE;

  // list fortune by user
  @Query((returns) => [FortuneModel])
  @UseGuards(JwtAuthGuard)
  async wheelFortunes(@CurrentUser() author) {
    return this.fortuneService.find(author._id.toString(), 'wheel');
  }

  @Query((returns) => [FortuneModel])
  @UseGuards(JwtAuthGuard)
  async randomFortunes(@CurrentUser() author) {
    return this.fortuneService.find(author._id.toString(), 'random');
  }

  @Query((returns) => FortuneModel)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ObjectIdPipe)
  async fortune(@Args('id') id: string, @CurrentUser() author) {
    const fortune = await this.fortuneService.findById(id);

    if (!fortune) {
      throw new NotFoundException('Không tìm thấy chương trình');
    }
    if (fortune.createdBy.id !== author._id.toString()) {
      throw new ForbiddenException('Bạn không có quyền truy cập');
    }
    return fortune;
  }

  //anonymous fortune
  @Query((returns) => FortuneModel)
  @UsePipes(ObjectIdPipe)
  async guestFortune(@Args('id') id: string) {
    const fortune = await this.fortuneService.findById(id);
    if (!fortune) {
      throw new NotFoundException('Không tìm thấy chương trình');
    }
    return fortune;
  }

  // spin wheel
  @Mutation((returns) => WinnerModel)
  async winner(
    @Args('id', ObjectIdPipe) id: string,
    @Args('input') input: SpinWheelInput,
  ) {
    const { player } = input;

    // find fortune
    const fortune = await this.fortuneService.findById(id);
    if (!fortune) {
      throw new NotFoundException('Không tim thấy vòng quay');
    }

    // here we can check if prize is out of stock
    const hasPrize = fortune.prizes.some((prize) => prize.qty > 0);
    if (!hasPrize) {
      throw new NotFoundException('Giải thưởng đã hết');
    }

    // here we can check if player has already won
    const hasWon = fortune.winners.some((winner) => winner.manv === player);
    if (hasWon) {
      throw new NotFoundException('Người chơi đã trúng thưởng');
    }

    // here we can check if player is in the list of persons
    const hasPlayer = fortune.persons.some((person) => person.manv === player);
    if (!hasPlayer) {
      throw new NotFoundException('Mã quay không tồn tại');
    }

    // Create array of available prizes based on quantity
    const availablePrizes: PrizeType[] = fortune.prizes.flatMap((prize) =>
      prize.qty > 0 ? Array(prize.qty).fill(prize) : [],
    );

    // Select random prize from available ones
    const randomPrizeIndex = Math.floor(Math.random() * availablePrizes.length);

    const selectedPrize = availablePrizes[randomPrizeIndex];

    const findPerson = fortune.persons.find((person) => person.manv === player);

    const findPrize: any = fortune.prizes.find(
      (prize: any) => prize.id === selectedPrize.id && prize.qty > 0,
    );

    const winner = {
      manv: findPerson.manv,
      name: findPerson.name,
      prizeId: findPrize.id,
      prize: findPrize.name,
      key: findPrize.key,
    };

    // Remove winner from persons array using pull operator
    const updateFortune = await this.fortuneService.findByIdAndUpdate(
      id,
      {
        $pull: { persons: { manv: player } },
        $push: { winners: winner },
        $set: {
          'prizes.$[prize].qty': findPrize.qty - 1,
        },
      },
      {
        arrayFilters: [{ 'prize._id': winner.prizeId }],
        new: true,
      },
    );

    // get the updated winner
    const updatedWinner = updateFortune.winners.find(
      (winner: any) => winner.manv === player,
    );

    return updatedWinner;
  }

  // spin wheel
  @Mutation((returns) => WinnerModel)
  async randomWinner(
    @Args('id', ObjectIdPipe) id: string,
    @Args('input') input: RandomInput,
  ) {
    const { prizeId } = input;
    // find fortune
    const fortune = await this.fortuneService.findById(id);


    if (!fortune) {
      throw new BadRequestException('Không tim thấy Chương trình');
    }


    if (fortune.persons.length === 0) {
      throw new BadRequestException('Không có người chơi nào trong danh sách');
    }


    // here we can check if prize is out of stock
    const hasPrize = fortune.prizes.some((prize) => prize.qty > 0);
    if (!hasPrize) {
      throw new BadRequestException('Giải thưởng đã hết');
    }

  
    // here we can check if prize is in the list of prizes
    const findPrize: any = fortune.prizes.find(
      (prize: any) => prize._id.toString() === prizeId,
    );

    if (!findPrize) {
      throw new BadRequestException('Giải thưởng không tồn tại');
    }



    // available persons
    const availablePersons = fortune.persons;
    // Select random person from available one
    const randomPrizeIndex = Math.floor(
      Math.random() * availablePersons.length,
    );
    const selectedPerson = availablePersons[randomPrizeIndex];

    // set winner
    const winner = {
      manv: selectedPerson.manv,
      name: selectedPerson.name,
      prizeId: findPrize.id,
      key: findPrize.key,
      prize: findPrize.name,
    };


    // Remove winner from persons array using pull operator
    const updateFortune = await this.fortuneService.findByIdAndUpdate(
      id,
      {
        $pull: { persons: { manv: selectedPerson.manv } },
        $push: { winners: winner },
        $set: {
          'prizes.$[prize].qty': findPrize.qty - 1,
        },
      },
      {
        arrayFilters: [{ 'prize._id': winner.prizeId }],
        new: true,
      },
    );



    // get the updated winner
    const updatedWinner = updateFortune.winners.find(
      (winner: any) => winner.manv === selectedPerson.manv,
    );

    return updatedWinner;
  }

  // Mutation
  @Mutation((returns) => FortuneModel)
  @UseGuards(JwtAuthGuard)
  async createFortune(@Args('input') input: FortuneDto, @CurrentUser() author) {
    const { type } = input;
    const fortunes = await this.fortuneService.find(
      author._id.toString(),
      type,
    );
    if (fortunes.length >= this.MAX_FORTUNE) {
      throw new BadRequestException(
        `Bạn đã tạo đủ ${this.MAX_FORTUNE} chương trình cho phép! Vui lòng nâng cấp tài khoản để tạo thêm!`,
      );
    }
    return this.fortuneService.create(input, author._id.toString());
  }

  @Mutation((returns) => FortuneModel)
  @UseGuards(JwtAuthGuard)
  async updateFortune(
    @Args('id', ObjectIdPipe) id: string,
    @Args('input') input: UpdateFortuneDto,
    @CurrentUser() author,
  ) {
    const fortune = await this.fortuneService.findById(id);
    if (!fortune) {
      throw new NotFoundException('Không tìm thấy chương trình');
    }

    if (fortune.createdBy.id !== author._id.toString()) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sữa');
    }

    const inDb = {
      persons: fortune.persons.map(({ _id, manv, name }: any) => ({
        manv,
        name,
        id: _id.toString(),
      })),
      prizes: fortune.prizes.map(({ _id, key, name, qty }: any) => ({
        key,
        name,
        qty,
        id: _id.toString(),
      })),
    };

    const form = {
      //Update Prizes data
      updatePrizes: _.differenceWith(
        input.prizes
          ? input.prizes.filter((inputPrize) => inputPrize.id) || []
          : [], // input prizes data
        inDb.prizes, // prizes has in db
        _.isEqual, //
      ), // update prizes data
      //Push Prizes data
      pushPrizes: input.prizes
        ? input.prizes
            .filter((inputPrize) => !inputPrize.id)
            .map(({ key, name, qty }) => ({ key, name, qty })) || []
        : [],
      //Pull Prizes data
      pullPrizes:
        input?.prizes?.length > 0
          ? _.differenceBy(
              inDb.prizes, // prizes has in db
              input.prizes, // prizes has in input
              'id', //
            )
          : [],

      //Update Persons data
      pushPersons: input.persons
        ? input.persons
            .filter((inputPerson) => !inputPerson.id)
            .map(({ manv, name }) => ({ manv, name })) || []
        : [],

      pullPersons:
        input?.persons?.length > 0
          ? _.differenceBy(
              inDb.persons, // persons has in db
              input.persons, // persons has in input
              'id', //
            )
          : [],
    };

    // update prizes in db
    if (form.updatePrizes.length > 0) {
      form.updatePrizes.map(async (prize) => {
        await this.fortuneService.findByIdAndUpdate(
          id,
          {
            $set: {
              'prizes.$[prize].qty': prize.qty,
              'prizes.$[prize].name': prize.name,
              'prizes.$[prize].key': prize.key,
            },
          },
          {
            arrayFilters: [{ 'prize._id': prize.id }],
          },
        );
      });
    }

    // pull
    if (form.pullPersons.length > 0 || form.pullPrizes.length > 0) {
      let $pull: any = {};
      if (form.pullPersons.length > 0) {
        $pull.persons = {
          _id: { $in: form.pullPersons.map((person) => person.id) },
        };
      }
      if (form.pullPrizes.length > 0) {
        $pull.prizes = {
          _id: { $in: form.pullPrizes.map((prize) => prize.id) },
        };
      }
      await this.fortuneService.findByIdAndUpdate(id, {
        $pull,
      });
    }


    // Push
    if (form.pushPersons.length > 0 || form.pushPrizes.length > 0) {
      let $push: any = {};
      if (form.pushPersons.length > 0) {
        $push.persons = { $each: form.pushPersons };
      }
      if (form.pushPrizes.length > 0) {
        $push.prizes = { $each: form.pushPrizes };
      }
      await this.fortuneService.findByIdAndUpdate(id, {
        $push,
      });
    }

    // $set and return
    return this.fortuneService.findByIdAndUpdate(
      id,
      {
        $set: {
          title: input.title,
          description: input.description,
        },
      },
      {
        new: true,
      },
    );
  }

  @Mutation((returns) => FortuneModel)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ObjectIdPipe)
  async deleteFortune(@Args('id') id: string, @CurrentUser() author) {
    const fortune = await this.fortuneService.findById(id);
    if (!fortune) {
      throw new NotFoundException('Không tìm thấy chương trình');
    }
    if (fortune.createdBy.id !== author._id.toString()) {
      throw new ForbiddenException('Bạn không có quyền xóa chương trình');
    }
    return this.fortuneService.delete(id);
  }
}
