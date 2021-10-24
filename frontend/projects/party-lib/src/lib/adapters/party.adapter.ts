import { Config, EnvironmentService, LoggerService } from 'utils-lib';

export class PartyAdapter {

  protected config: Config;

  constructor(protected environmentService: EnvironmentService,
              protected logger: LoggerService) {

    this.config = this.environmentService.getConfig();

  }

  protected getUrlPrefix(): string {

    return this.config.serverScheme + '://' + this.config.serverHost + ':' + this.config.partyServicePort + '/';

  }

}
