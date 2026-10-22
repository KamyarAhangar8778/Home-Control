import { debugLog } from "@/lib/debug";

export async function fetchArchivePlaylist() {
  try {
    const response = await fetch(
      "https://archive.org/advancedsearch.php?q=subject:(traditional+OR+historical)+AND+subject:(instrumental)+AND+mediatype:(audio)&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=30&output=json",
    );
    if (!response.ok) {
      throw new Error(`Archive playlist request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const docs = data.response?.docs;
    if (Array.isArray(docs) && docs.length > 0) return docs;

    debugLog.warn("AudioPlaylist", "Archive API returned an empty playlist.");
  } catch (error) {
    debugLog.error("AudioPlaylist", "Could not fetch Archive playlist.", error);
  }
  return [];
}

export async function fetchTrackUrl(identifier: string): Promise<string | null> {
  try {
    const response = await fetch(`https://archive.org/metadata/${encodeURIComponent(identifier)}`);
    if (!response.ok) {
      throw new Error(`Track metadata request failed: ${response.status} ${response.statusText}`);
    }

    const metadata = await response.json();
    const files = Array.isArray(metadata.files) ? metadata.files : [];
    const mp3File = files.find(
      (file: { format?: string; name?: string }) =>
        file.name &&
        (file.format === "128Kbps MP3" || file.format === "VBR MP3" || file.name.toLowerCase().endsWith(".mp3")),
    );

    if (!mp3File?.name) {
      debugLog.warn("AudioPlaylist", "No MP3 file found for online track.", { identifier });
      return null;
    }

    return `https://archive.org/download/${encodeURIComponent(identifier)}/${mp3File.name
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
  } catch (error) {
    debugLog.error("AudioPlaylist", "Could not resolve online track URL.", { identifier, error });
    return null;
  }
}
