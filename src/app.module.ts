import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// AuthModule 및 UserModule은 나중에 생성 후 추가합니다.
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 환경 변수를 전역으로 사용
      envFilePath: '.env', // .env 파일 사용 명시
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule을 사용하여 ConfigService 주입
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        // 추가적인 Mongoose 연결 옵션들 (필요시)
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
      inject: [ConfigService], // ConfigService 주입
    }),
    UsersModule,
    AuthModule,
    // UsersModule, // 주석 처리됨
    // AuthModule, // 나중에 주석 해제
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
