import { Module, OnModuleDestroy } from "@nestjs/common";
import { AgendaController } from "./agenda.controller";
import { AgendaService } from "./agenda.service";

@Module({
  providers: [AgendaService],
  controllers: [AgendaController],
})
export class AgendaModule implements OnModuleDestroy {
  constructor(private readonly agendaService: AgendaService) {}

  async onModuleDestroy() {
    await this.agendaService.stop();
  }
}
