export async function fetchArchivePlaylist() {
  try {
    const res = await fetch('https://archive.org/advancedsearch.php?q=subject:(traditional+OR+historical)+AND+subject:(instrumental)+AND+mediatype:(audio)&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=30&output=json');
    if (res.ok) {
      const data = await res.json();
      if (data.response?.docs?.length > 0) {
        return data.response.docs;
      }
    }
  } catch(err) {
    console.error("Audio API error:", err);
  }
  return [];
}

export async function fetchTrackUrl(identifier: string): Promise<string | null> {
  try {
    const metaRes = await fetch(`https://archive.org/metadata/${identifier}`);
    const metaData = await metaRes.json();
    const mp3File = metaData.files?.find((f: any) => f.format === "128Kbps MP3" || f.format === "VBR MP3" || f.name.endsWith(".mp3"));
    if (mp3File) {
      return `https://archive.org/download/${identifier}/${mp3File.name}`;
    }
  } catch(err) {
    // ignore
  }
  return null;
}
