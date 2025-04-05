import { FileParameter } from "@dangl/avacloud-client-node";

export async function getOAuth2AccessToken(
  clientId: string,
  clientSecret: string,
  identityTokenUrl: string,
): Promise<string> {
  try {
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

    const jsonResponse = await tokenResponseRaw.json();
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
  const gaebFileBuffer = Deno.readFileSync(gaebInputFile);
  const fileParam: FileParameter = {
    data: new Blob([gaebFileBuffer]),
    fileName: "GAEBXML_EN.X86",
  };

  return fileParam;
}

