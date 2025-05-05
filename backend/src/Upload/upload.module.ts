import { Module } from '@nestjs/common';


// import { CaslModule } from 'src/Casl/casl.module';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [],
  controllers: [UploadController],
  providers: [ UploadService],
})
export class UploadModule {}
