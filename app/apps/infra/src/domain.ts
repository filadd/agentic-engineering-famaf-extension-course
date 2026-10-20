import * as Alchemy from "alchemy";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

export const zoneName = "asermax.com";

export const kurasuDomain = Effect.all({
  name: Config.String("KURASU_DOMAIN").pipe(Config.withDefault("kurasu.asermax.com")),
  deployed: Effect.map(Alchemy.ALCHEMY_DEV, (dev) => !dev),
});
