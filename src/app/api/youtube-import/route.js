import { NextResponse } from "next/server";

// Lists public videos from a YouTube channel (or playlist) for the admin
// "Import from YouTube" page. Uses YouTube Data API v3 with YOUTUBE_API_KEY,
// which stays on the server.

const YT_API = "https://www.googleapis.com/youtube/v3";
// Each request scans this many playlist pages (x50 uploads); the admin page
// keeps calling with nextPageToken until the date range is covered.
const PAGES_PER_CALL = 6;

export const maxDuration = 60;
const TIME_ZONE = "Asia/Kolkata";

const ytFetch = async (endpoint, params, key) => {
  const url = new URL(`${YT_API}/${endpoint}`);
  Object.entries({ ...params, key }).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `YouTube API error (${res.status})`);
  }
  return data;
};

// "2024-03-05T10:20:00Z" -> "2024-03-05" in Indian time
const toLocalDate = (iso) =>
  new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

// ISO 8601 duration "PT1H2M3S" -> seconds
const parseDuration = (iso = "") => {
  const m = iso.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  const [, d = 0, h = 0, min = 0, s = 0] = m.map((x) => Number(x) || 0);
  return d * 86400 + h * 3600 + min * 60 + s;
};

// seconds -> "1:02:03" / "12:34"
const formatDuration = (total) => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

const bestThumbnail = (thumbs = {}, videoId) =>
  thumbs.maxres?.url ||
  thumbs.standard?.url ||
  thumbs.high?.url ||
  thumbs.medium?.url ||
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

// Work out what the admin pasted: playlist, channel id, @handle or custom URL
const resolveUploadsPlaylist = async (input, key) => {
  const value = input.trim();

  const playlist = value.match(/[?&]list=([\w-]+)/);
  if (playlist) return { playlistId: playlist[1], title: null };

  let channelParams = null;
  const channelId = value.match(/(UC[\w-]{22})/);
  const handle = value.match(/@([\w.-]+)/);

  if (channelId) channelParams = { id: channelId[1] };
  else if (handle) channelParams = { forHandle: `@${handle[1]}` };
  else if (/^[\w.-]+$/.test(value)) channelParams = { forHandle: `@${value}` };
  else {
    const user = value.match(/youtube\.com\/(?:user|c)\/([\w.-]+)/);
    if (user) channelParams = { forUsername: user[1] };
  }

  if (!channelParams) {
    throw new Error("Could not understand this link. Paste a channel URL, @handle or playlist URL.");
  }

  const data = await ytFetch("channels", { part: "contentDetails,snippet", ...channelParams }, key);
  const channel = data.items?.[0];
  if (!channel) throw new Error("Channel not found on YouTube.");

  return {
    playlistId: channel.contentDetails.relatedPlaylists.uploads,
    title: channel.snippet?.title || null,
  };
};

// YouTube Shorts: /shorts/<id> answers 200 for a Short and redirects otherwise
const isShortVideo = async (videoId, seconds) => {
  if (seconds > 180) return false;
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: "HEAD",
      redirect: "manual",
      cache: "no-store",
    });
    return res.status === 200;
  } catch {
    return seconds <= 60;
  }
};

const mapLimit = async (items, limit, fn) => {
  const results = new Array(items.length);
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
};

export async function POST(request) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { success: false, error: "YOUTUBE_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  // Basic gate: only signed-in admins (session cookie) can use this
  if (!request.cookies.get("gpn_admin_session")?.value) {
    return NextResponse.json({ success: false, error: "Not authorised." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { from, to, since, pageToken: startToken = "", playlistId: knownPlaylist } = body;
    // Auto-sync sends no link: use the channel configured on the server
    const source = body.source || process.env.YOUTUBE_CHANNEL_ID;
    if (!source && !knownPlaylist) {
      return NextResponse.json({ success: false, error: "Channel or playlist link is required." }, { status: 400 });
    }

    let playlistId = knownPlaylist;
    let channelTitle = null;
    if (!playlistId) {
      ({ playlistId, title: channelTitle } = await resolveUploadsPlaylist(source, key));
    }

    // 1. Walk a slice of the uploads playlist (newest first), keep ids in the date range
    const candidates = [];
    let pageToken = startToken;
    let scanned = 0;
    let done = false;
    for (let page = 0; page < PAGES_PER_CALL; page++) {
      const data = await ytFetch(
        "playlistItems",
        { part: "contentDetails", playlistId, maxResults: 50, ...(pageToken && { pageToken }) },
        key
      );

      let allOlderThanFrom = (data.items?.length || 0) > 0;
      let allOlderThanSince = Boolean(since) && (data.items?.length || 0) > 0;
      for (const item of data.items || []) {
        scanned++;
        const publishedAt = item.contentDetails?.videoPublishedAt;
        if (!publishedAt) continue; // private / deleted
        const date = toLocalDate(publishedAt);
        if (since && publishedAt > since) allOlderThanSince = false;
        if (since && publishedAt <= since) continue; // exact cut-off used by auto-sync
        if (!from || date >= from) allOlderThanFrom = false;
        if ((from && date < from) || (to && date > to)) continue;
        candidates.push(item.contentDetails.videoId);
      }

      pageToken = data.nextPageToken || "";
      if (!pageToken || (from && allOlderThanFrom) || allOlderThanSince) {
        done = true;
        break;
      }
    }

    // 2. Full details, 50 ids per request (in parallel)
    const detailGroups = [];
    for (let i = 0; i < candidates.length; i += 50) detailGroups.push(candidates.slice(i, i + 50));
    const detailPages = await Promise.all(
      detailGroups.map((ids) =>
        ytFetch("videos", { part: "snippet,contentDetails,status", id: ids.join(","), maxResults: 50 }, key)
      )
    );
    const details = detailPages.flatMap((d) => d.items || []);

    const usable = details.filter(
      (v) =>
        v.status?.privacyStatus === "public" &&
        !["live", "upcoming"].includes(v.snippet?.liveBroadcastContent)
    );

    // 3. Shape for the admin preview (Shorts detection in parallel)
    const videos = await mapLimit(usable, 16, async (v) => {
      const seconds = parseDuration(v.contentDetails?.duration);
      const short = await isShortVideo(v.id, seconds);
      return {
        videoId: v.id,
        youtubeUrl: short ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`,
        title: v.snippet?.title || "",
        description: v.snippet?.description || "",
        tags: (v.snippet?.tags || []).slice(0, 15),
        thumbnail: bestThumbnail(v.snippet?.thumbnails, v.id),
        duration: seconds ? formatDuration(seconds) : "",
        seconds,
        publishedAt: v.snippet?.publishedAt,
        publishDate: toLocalDate(v.snippet?.publishedAt),
        videoType: short ? "short" : "standard",
      };
    });

    videos.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

    return NextResponse.json({
      success: true,
      channelTitle,
      playlistId,
      videos,
      scanned,
      nextPageToken: done ? null : pageToken,
      done,
    });
  } catch (error) {
    console.error("YouTube import error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
