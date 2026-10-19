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
// The body is parsed as JSON when there is one. A request that fails before
// any response is tried again: the API answers an oversized upload before
// reading all of it and closes that connection, which the client may still
// pick for its next request.
export const request = (
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  options: RequestOptions = {},
) =>
  Effect.gen(function* () {
    const client = (yield* HttpClient.HttpClient).pipe(
      HttpClient.retryTransient({ retryOn: "errors-only", times: 2 }),
    );

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

export interface UploadFile {
  readonly name: string;
  readonly type: string;
  readonly bytes: Uint8Array;
}

export interface UploadForm {
  readonly sessionId: string;
  readonly name: string;
  readonly isSlides: boolean;
  readonly file: UploadFile;
}

// Uploads a material as the web does: a multipart form with the fields first
// and the file last.
export const upload = (url: string, cookie: string, form: UploadForm) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const data = new FormData();

    data.append("sessionId", form.sessionId);
    data.append("name", form.name);
    data.append("isSlides", String(form.isSlides));
    data.append("file", new Blob([form.file.bytes], { type: form.file.type }), form.file.name);

    const outgoing = HttpClientRequest.post(`${url}/api/admin/materials`).pipe(
      HttpClientRequest.setHeader("cookie", cookie),
      HttpClientRequest.bodyFormData(data),
    );

    const response = yield* client.execute(outgoing);
    const text = yield* response.text;

    return {
      status: response.status,
      headers: response.headers,
      body: text === "" ? null : JSON.parse(text),
    } satisfies ApiResponse;
  });

export interface Download {
  readonly status: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly bytes: Uint8Array;
}

// Downloads the file of a material, keeping its bytes as they arrive.
export const download = (url: string, id: string, cookie: string) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;

    const response = yield* client.execute(
      HttpClientRequest.get(`${url}/api/materials/${id}/file`).pipe(
        HttpClientRequest.setHeader("cookie", cookie),
      ),
    );

    return {
      status: response.status,
      headers: response.headers,
      bytes: new Uint8Array(yield* response.arrayBuffer),
    } satisfies Download;
  });
