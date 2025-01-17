import type { IConfigCatClient, IConfigCatKernel } from "./ConfigCatClient";
import { ConfigCatClient } from "./ConfigCatClient";
import type { IAutoPollOptions, ILazyLoadingOptions, IManualPollOptions, OptionsForPollingMode } from "./ConfigCatClientOptions";
import { AutoPollOptions, LazyLoadOptions, ManualPollOptions, PollingMode } from "./ConfigCatClientOptions";
import type { IConfigCatLogger } from "./ConfigCatLogger";
import { ConfigCatConsoleLogger, LogLevel } from "./ConfigCatLogger";
import { setupPolyfills } from "./Polyfills";

setupPolyfills();

/**
 * Returns an instance of ConfigCatClient for the specified SDK Key.
 * @remarks This method returns a single, shared instance per each distinct SDK Key.
 * That is, a new client object is created only when there is none available for the specified SDK Key.
 * Otherwise, the already created instance is returned (in which case the 'pollingMode', 'options' and 'configCatKernel' arguments are ignored).
 * So, please keep in mind that when you make multiple calls to this method using the same SDK Key, you may end up with multiple references to the same client object.
 * @param sdkKey SDK Key (a.k.a ApiKey) to access configuration
 * @param pollingMode The polling mode to use
 * @param options Options for the specified polling mode
 */
export function getClient<TMode extends PollingMode>(sdkKey: string, pollingMode: TMode, options: OptionsForPollingMode<TMode> | undefined | null, configCatKernel: IConfigCatKernel): IConfigCatClient {
  return ConfigCatClient.get(sdkKey, pollingMode, options, configCatKernel);
}

/**
 * Disposes all existing ConfigCatClient instances.
 */
export function disposeAllClients(): void {
  ConfigCatClient.disposeAll();
}

/**
 * Create an instance of ConfigCatClient and setup AutoPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for autoPoll mode
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with auto polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.AutoPoll, options, ...)' format.
 */
export function createClientWithAutoPoll(apiKey: string, configCatKernel: IConfigCatKernel, options?: IAutoPollOptions): IConfigCatClient {
  return new ConfigCatClient(new AutoPollOptions(apiKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.cache, configCatKernel.eventEmitterFactory), configCatKernel);
}

/**
 * Create an instance of ConfigCatClient and setup ManualPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for manualPoll mode
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with manual polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.ManualPoll, options, ...)' format.
 */
export function createClientWithManualPoll(apiKey: string, configCatKernel: IConfigCatKernel, options?: IManualPollOptions): IConfigCatClient {
  return new ConfigCatClient(new ManualPollOptions(apiKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.cache, configCatKernel.eventEmitterFactory), configCatKernel);
}

/**
 * Create an instance of ConfigCatClient and setup LazyLoad mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for lazyLoad mode
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with lazy loading for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.LazyLoad, options, ...)' format.
 */
export function createClientWithLazyLoad(apiKey: string, configCatKernel: IConfigCatKernel, options?: ILazyLoadingOptions): IConfigCatClient {
  return new ConfigCatClient(new LazyLoadOptions(apiKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.cache, configCatKernel.eventEmitterFactory), configCatKernel);
}

/**
 * Create an instance of ConfigCatConsoleLogger
 * @param {LogLevel} logLevel - Specifies message's filtering to output for the ConfigCatConsoleLogger.
 */
export function createConsoleLogger(logLevel: LogLevel): IConfigCatLogger {
  return new ConfigCatConsoleLogger(logLevel);
}

/* Public types for platform-specific SDKs */

// List types here which are required to implement the platform-specific SDKs but shouldn't be exposed to end users.

export type { IConfigCatKernel };

export type { IConfigFetcher, IFetchResponse, FetchErrorCauses } from "./ConfigFetcher";

export { FetchStatus, FetchResult, FetchError } from "./ConfigFetcher";

export { OptionsBase } from "./ConfigCatClientOptions";

export { InMemoryCache } from "./Cache";

export type { IEventProvider, IEventEmitter } from "./EventEmitter";

/* Public types for end users */

// List types here which are part of the public API of platform-specific SDKs, thus, should be exposed to end users.
// These exports should be re-exported in the entry module of each platform-specific SDK!

export { PollingMode };

export type { IOptions } from "./ConfigCatClientOptions";

export type { IAutoPollOptions, IManualPollOptions, ILazyLoadingOptions };

export { DataGovernance } from "./ConfigCatClientOptions";

export type { IConfigCatLogger };

export { LogLevel };

export type { ICache } from "./Cache";

export { ProjectConfig, RolloutRule, RolloutPercentageItem, Setting } from "./ProjectConfig";

export type { IConfigCatClient };

export { SettingKeyValue } from "./ConfigCatClient";

export type { IEvaluationDetails, SettingTypeOf, SettingValue, VariationIdTypeOf, VariationIdValue } from "./RolloutEvaluator";

export { User } from "./RolloutEvaluator";

export type { IOverrideDataSource } from "./FlagOverrides";

export { FlagOverrides, MapOverrideDataSource, OverrideBehaviour } from "./FlagOverrides";

export { RefreshResult } from "./ConfigServiceBase";

export type { IProvidesHooks, HookEvents } from "./Hooks";
