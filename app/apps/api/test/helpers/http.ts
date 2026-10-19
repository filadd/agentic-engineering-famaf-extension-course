import * as Effect from "effect/Effect";
import * as HttpClient from "effect/http/HttpClient";
import * as HttpClientRequest from "effect/http/HttpClientRequest";

export interface ApiResponse {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: unknown;
}

export interface RequestOptions {
  readonly body?: object;
  readonly cookie?: string;
}

// A request to the local API with an optional JSON body and session cookie.
// The body is parsed as JSON when there is one.
export const request = (
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  options: RequestOptions = {},
) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;

    let outgoing = HttpClientRequest.make(method)(`${url}${path}`);

    if (options.body != null) {
      outgoing = HttpClientRequest.bodyJsonUnsafe(outgoing, options.body);
    }

    if (options.cookie != null) {
      outgoing = HttpClientRequest.setHeader(outgoing, "cookie", options.cookie);
    }

    const response = yield* client.execute(outgoing);
    const text = yield* response.text;

    return {
      status: response.status,
      headers: response.headers,
      body: text === "" ? null : JSON.parse(text),
    } satisfies ApiResponse;
  });
