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

export type FormEntry =
  | { readonly key: string; readonly value: string }
  | { readonly key: string; readonly file: UploadFile };

// Posts a multipart form to the material upload with its entries in the given
// order, so a test can send the fields after the file.
export const uploadEntries = (url: string, cookie: string, entries: ReadonlyArray<FormEntry>) =>
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const data = new FormData();

    for (const entry of entries) {
      if ("file" in entry) {
        data.append(
          entry.key,
          new Blob([entry.file.bytes], { type: entry.file.type }),
          entry.file.name,
        );
      } else {
        data.append(entry.key, entry.value);
      }
    }

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

// Uploads a material as the web does: a multipart form with the fields first
// and the file last.
export const upload = (url: string, cookie: string, form: UploadForm) =>
  uploadEntries(url, cookie, [
    { key: "sessionId", value: form.sessionId },
    { key: "name", value: form.name },
    { key: "isSlides", value: String(form.isSlides) },
    { key: "file", file: form.file },
  ]);

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
