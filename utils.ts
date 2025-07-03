import { FileParameter } from "@dangl/avacloud-client-node";
import * as fs from "node:fs";

export async function getOAuth2AccessToken(
  clientId: string | undefined,
  clientSecret: string | undefined,
  identityTokenUrl: string | undefined,
): Promise<string | null> {
  try {
    if (
      clientId == undefined ||
      clientSecret == undefined ||
      identityTokenUrl == undefined
    )
      return null;

    const tokenResponseRaw = await fetch(identityTokenUrl, {
      method: "POST",
      body: "grant_type=client_credentials&scope=avacloud",
      headers: {
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (tokenResponseRaw.status !== 200) {
      throw new Error(
        "Failed to obtain an access token, status code: " +
          tokenResponseRaw.status,
      );
    }

    const jsonResponse = await tokenResponseRaw.json() as { access_token: string };
    const accessToken = jsonResponse["access_token"];
    if (!accessToken) {
      throw new Error("Failed to obtain an access token");
    }

    return accessToken;
  } catch {
    throw new Error("Failed to obtain an access token");
  }
}

export function getGaebFile(gaebInputFile: string): FileParameter {
  const gaebFileBuffer = fs.readFileSync(gaebInputFile);
  const fileParam: FileParameter = {
    data: new Blob([gaebFileBuffer]),
    fileName: "GAEBXML_EN.X86",
  };

  return fileParam;
}
