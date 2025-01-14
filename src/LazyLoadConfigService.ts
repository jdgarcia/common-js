import type { LazyLoadOptions } from "./ConfigCatClientOptions";
import type { LoggerWrapper } from "./ConfigCatLogger";
import type { IConfigFetcher } from "./ConfigFetcher";
import type { IConfigService, RefreshResult } from "./ConfigServiceBase";
import { ConfigServiceBase } from "./ConfigServiceBase";
import { ProjectConfig } from "./ProjectConfig";

export class LazyLoadConfigService extends ConfigServiceBase<LazyLoadOptions> implements IConfigService {

  private readonly cacheTimeToLiveSeconds: number;

  constructor(configFetcher: IConfigFetcher, options: LazyLoadOptions) {

    super(configFetcher, options);

    this.cacheTimeToLiveSeconds = options.cacheTimeToLiveSeconds;

    options.hooks.emit("clientReady");
  }

  async getConfig(): Promise<ProjectConfig | null> {
    this.options.logger.debug("LazyLoadConfigService.getConfig() called.");

    function logExpired(logger: LoggerWrapper, appendix = "") {
      logger.debug(`LazyLoadConfigService.getConfig(): cache is empty or expired${appendix}.`);
    }

    let config = await this.options.cache.get(this.options.getCacheKey());

    if (ProjectConfig.isExpired(config, this.cacheTimeToLiveSeconds * 1000)) {
      if (!this.isOffline) {
        logExpired(this.options.logger, ", calling refreshConfigCoreAsync()");
        [, config] = await this.refreshConfigCoreAsync(config);
      }
      else {
        logExpired(this.options.logger);
      }
      return config;
    }

    this.options.logger.debug("LazyLoadConfigService.getConfig(): cache is valid, returning from cache.");
    return config;
  }

  refreshConfigAsync(): Promise<[RefreshResult, ProjectConfig | null]> {
    this.options.logger.debug("LazyLoadConfigService.refreshConfigAsync() called.");
    return super.refreshConfigAsync();
  }
}
