import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AgendaModule } from "./agenda/agenda.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AgendaModule],
})
export class AppModule {}
