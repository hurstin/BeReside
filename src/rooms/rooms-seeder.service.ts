import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(RoomsSeederService.name);

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Starting Room database seeding process...');

    const roomsToSeed = [
      { roomNumber: '101', type: 'double', basePricePerNight: 350.00, status: 'available' },
      { roomNumber: '102', type: 'double', basePricePerNight: 350.00, status: 'available' },
      { roomNumber: '201', type: 'queen', basePricePerNight: 320.00, status: 'available' },
      { roomNumber: '202', type: 'queen', basePricePerNight: 320.00, status: 'maintenance' },
      { roomNumber: '301', type: 'family', basePricePerNight: 450.00, status: 'available' },
      { roomNumber: '302', type: 'family', basePricePerNight: 450.00, status: 'available' },
      { roomNumber: '401', type: 'apartment', basePricePerNight: 500.00, status: 'available' },
    ];

    for (const roomData of roomsToSeed) {
      const existingRoom = await this.roomRepository.findOneBy({ roomNumber: roomData.roomNumber });
      
      if (!existingRoom) {
        const newRoom = this.roomRepository.create(roomData);
        await this.roomRepository.save(newRoom);
        this.logger.log(`Created Room ${roomData.roomNumber}`);
      } else {
        this.logger.log(`Room ${roomData.roomNumber} already exists, skipping...`);
      }
    }

    this.logger.log('Room database seeding process completed successfully.');
  }
}
