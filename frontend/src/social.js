

export async function fetchSocialPosts() {
  try {
    const res = await fetch("http://localhost:4000/api/social");
    if (!res.ok) {
      throw new Error("Failed to fetch social posts");
    }
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching social posts:", err);
    return { posts: [] };
  }
}
