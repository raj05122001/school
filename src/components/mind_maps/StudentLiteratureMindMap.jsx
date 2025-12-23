"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Paper, TextField, MenuItem } from "@mui/material";
import { getLiteratureMindMap } from "@/api/apiHelper";

/* ---------------- tiny utils ---------------- */
const uid = () => crypto?.randomUUID?.() || String(Math.random());

/* ---------------- UI helpers ---------------- */
function depthColors(depth) {
  if (depth === 0) return { bg: "#6D5EF6", fg: "#fff", border: "#6D5EF6" };
  if (depth === 1) return { bg: "#E9EEFF", fg: "#111827", border: "#B8C6FF" };
  if (depth === 2) return { bg: "#E7FAF3", fg: "#0F172A", border: "#9AE6C7" };
  return { bg: "#F8FAFC", fg: "#111827", border: "rgba(0,0,0,0.10)" };
}

function ChipButton({ label, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        px: 1.4,
        py: 0.7,
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 900,
        border: `1px solid ${active ? "#6366F1" : "rgba(0,0,0,0.12)"}`,
        bgcolor: active ? "rgba(99,102,241,0.12)" : "#fff",
        color: active ? "#4F46E5" : "#374151",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label?.replace("_"," ")?.toUpperCase()}
    </Box>
  );
}

function IconBtn({ label, onClick, title, disabled }) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      title={title || label}
      sx={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        px: 1.2,
        py: 0.7,
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.12)",
        bgcolor: "#fff",
        fontWeight: 900,
        userSelect: "none",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 42,
      }}
    >
      {label}
    </Box>
  );
}

function PrimaryBtn({ label, onClick, disabled }) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: "#4F46E5",
        color: "#fff",
        fontWeight: 900,
        fontSize: 13,
        userSelect: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 6px 18px rgba(79,70,229,0.18)",
      }}
    >
      {label}
    </Box>
  );
}

function Badge({ children }) {
  return (
    <Box
      sx={{
        px: 1.1,
        py: 0.35,
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 900,
        bgcolor: "rgba(99,102,241,0.10)",
        color: "#4F46E5",
        border: "1px solid rgba(99,102,241,0.25)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
}

/* ---------------- Loading UI ---------------- */
function SkeletonLine({ w = "100%", h = 12, r = 8 }) {
  return (
    <Box
      sx={{
        width: w,
        height: h,
        borderRadius: r,
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.11) 45%, rgba(0,0,0,0.06) 90%)",
        backgroundSize: "220% 100%",
        animation: "mm_shimmer 1.2s ease-in-out infinite",
      }}
    />
  );
}

function LoadingState({ isFullscreen }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)",
        bgcolor: "rgba(255,255,255,0.92)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: isFullscreen ? "100vh" : "calc(100vh - 220px)",
        minHeight: 620,
        mb: 3,
        "@keyframes mm_shimmer": {
          "0%": { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "-120% 0" },
        },
        "@keyframes mm_spin": {
          to: { transform: "rotate(360deg)" },
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.4,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ minWidth: 220 }}>
          <SkeletonLine w={150} h={16} r={6} />
          <Box sx={{ mt: 0.7 }}>
            <SkeletonLine w={260} h={12} r={6} />
          </Box>
        </Box>

        <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
          <SkeletonLine w={300} h={40} r={12} />
          <SkeletonLine w={120} h={40} r={12} />
        </Box>
      </Box>

      <Box sx={{ flex: "1 1 auto", position: "relative", bgcolor: "#fff" }}>
        <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <Box
            sx={{
              px: 2.2,
              py: 1.3,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "2px solid rgba(99,102,241,0.25)",
                borderTopColor: "rgba(99,102,241,1)",
                animation: "mm_spin 0.85s linear infinite",
              }}
            />
            <Box sx={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>
              Loading mind map…
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

/* ---------------------- Build tree (Literature API) ---------------------- */
function toNodeFromLiterature(title, value, depth = 0) {
  const node = { id: uid(), title: String(title), depth, examples: [], children: [] };

  if (!value || typeof value !== "object") return node;

  const ex = Array.isArray(value?.Examples) ? value.Examples : [];
  node.examples = ex.map((x) => String(x));

  const subs = value?.Subtopics && typeof value.Subtopics === "object" ? value.Subtopics : {};
  node.children = Object.entries(subs).map(([k, v]) => toNodeFromLiterature(k, v, depth + 1));

  return node;
}

function buildLiteratureTree(mindMapObj, rootTitle = "Mind Map") {
  const root = { id: uid(), title: rootTitle, depth: 0, examples: [], children: [] };
  const entries = Object.entries(mindMapObj || {});
  root.children = entries.map(([k, v]) => toNodeFromLiterature(k, v, 1));
  return root;
}

function computeLayout(root, opts) {
  const { nodeW = 240, nodeH = 54, gapX = 180, gapY = 10, pad = 24 } = opts || {};

  const leaves = [];
  function collectLeaves(n) {
    if (!n.children || n.children.length === 0) return leaves.push(n);
    n.children.forEach(collectLeaves);
  }
  collectLeaves(root);

  leaves.forEach((leaf, i) => (leaf.__y = i * (nodeH + gapY)));

  function setInternalY(n) {
    if (!n.children || n.children.length === 0) return n.__y;
    const ys = n.children.map(setInternalY);
    n.__y = ys.reduce((a, b) => a + b, 0) / ys.length;
    return n.__y;
  }
  setInternalY(root);

  const nodes = [];
  const edges = [];
  let maxDepth = 0;

  function walk(n, depth, parent) {
    maxDepth = Math.max(maxDepth, depth);
    const x = depth * (nodeW + gapX);
    const y = n.__y;

    nodes.push({ ...n, depth, x: x + pad, y: y + pad, w: nodeW, h: nodeH });

    if (parent) edges.push({ from: parent.id, to: n.id });
    (n.children || []).forEach((c) => walk(c, depth + 1, n));
  }
  walk(root, 0, null);

  const maxY = Math.max(0, (leaves.length - 1) * (nodeH + gapY));
  const width = (maxDepth + 1) * (nodeW + gapX) + pad * 2 - gapX;
  const height = maxY + nodeH + pad * 2;

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  return { nodes, edges, nodeById, width, height };
}

function normalizeLiteratureApi(res) {
  const payload = res?.data || res;
  const mm = payload?.data?.mind_map || payload?.mind_map || null;
  if (!mm || typeof mm !== "object") return null;

  const categories = Object.entries(mm).reduce((acc, [k, v]) => {
    acc[k] = v?.mind_map || {};
    return acc;
  }, {});
  return { categories };
}

/* ---------------------- Component ---------------------- */
export default function StudentLiteratureMindMap({ lectureId }) {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("fictional_story"); // ✅ NEW
  const [data, setData] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fitRef = useRef(null);
  const [fitSize, setFitSize] = useState({ w: 0, h: 0 });

  const [userScale, setUserScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, panX: 0, panY: 0 });

  /* Fullscreen */
  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  /* Measure canvas size */
  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) setFitSize({ w: r.width, h: r.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const t = setTimeout(measure, 150);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  const categoryKeys = useMemo(() => Object.keys(data?.categories || {}), [data]);

  const fetchLiteratureMindMap = async () => {
    if (!lectureId) return;
    if (!topic.trim()) {
      setErr("Please enter a topic first.");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const formData = {
        lecture_id: lectureId,
        topics: topic.trim(),
        content_type: contentType, // ✅ dropdown value
      };

      const res = await getLiteratureMindMap(formData);

      const norm = normalizeLiteratureApi(res);
      if (!norm) throw new Error("Mind map not found in API response.");

      setData(norm);

      const cats = Object.keys(norm.categories || {});
      setSelectedCat(cats?.[0] || null);

      setUserScale(1);
    } catch (e) {
      setErr(e?.message || "Failed to fetch mind map");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") fetchLiteratureMindMap();
  };

  const view = useMemo(() => {
    if (!data || !selectedCat) return null;
    const mindMapObj = data.categories?.[selectedCat] || {};
    const tree = buildLiteratureTree(mindMapObj, `Literature • ${selectedCat}`);
    return computeLayout(tree, { nodeW: 250, nodeH: 58, gapX: 190, gapY: 10, pad: 24 });
  }, [data, selectedCat]);

  const fitScale = useMemo(() => {
    if (!view || !fitSize.w || !fitSize.h) return 1;
    const SAFE = 44;
    const availW = Math.max(0, fitSize.w - SAFE);
    const availH = Math.max(0, fitSize.h - SAFE);
    const sx = availW / view.width;
    const sy = availH / view.height;
    return Math.max(0.18, Math.min(sx, sy, 1));
  }, [view, fitSize]);

  const finalScale = useMemo(() => Math.max(0.18, Math.min(3, fitScale * userScale)), [fitScale, userScale]);

  useEffect(() => {
    if (!view || !fitSize.w || !fitSize.h) return;
    const scaledW = view.width * finalScale;
    const scaledH = view.height * finalScale;
    setPan({ x: (fitSize.w - scaledW) / 2, y: (fitSize.h - scaledH) / 2 });
  }, [view?.width, view?.height, fitSize.w, fitSize.h, finalScale]);

  const onDown = (clientX, clientY) => {
    dragRef.current.dragging = true;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.panX = pan.x;
    dragRef.current.panY = pan.y;
  };

  const onMove = (clientX, clientY) => {
    if (!dragRef.current.dragging) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;
    setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy });
  };

  const onUp = () => {
    dragRef.current.dragging = false;
  };

  useEffect(() => {
    const up = () => onUp();
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    window.addEventListener("touchcancel", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
  }, []);

  if (err) {
    return (
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, border: "1px solid #fee2e2", bgcolor: "#fff1f2" }}>
          <b>Error:</b> {err}
        </Paper>
      </Box>
    );
  }

  if (loading) return <LoadingState isFullscreen={isFullscreen} />;

  return (
    <Paper
      ref={containerRef}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)",
        bgcolor: "rgba(255,255,255,0.92)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 620,
        mb: 3,
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          px: 2,
          py: 1.4,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Box sx={{ fontSize: 16, fontWeight: 900, color: "#111827", lineHeight: 1.1 }}>
            Literature Mind Map
          </Box>
          <Box sx={{ fontSize: 12.5, color: "#6b7280" }}>
        Select topic and content type • Click fetch • Drag to pan • Use zoom controls
        </Box>
        </Box>

        <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <IconBtn label="−" title="Zoom out" disabled={!view} onClick={() => setUserScale((s) => Math.max(0.6, +(s / 1.15).toFixed(4)))} />
          <IconBtn label="100%" title="Reset zoom" disabled={!view} onClick={() => setUserScale(1)} />
          <IconBtn label="+" title="Zoom in" disabled={!view} onClick={() => setUserScale((s) => Math.min(2.5, +(s * 1.15).toFixed(4)))} />
          <Box
            onClick={toggleFullscreen}
            sx={{
              cursor: "pointer",
              px: 2,
              py: 0.85,
              borderRadius: 2,
              border: "1px solid #6366F1",
              bgcolor: isFullscreen ? "#6366F1" : "#fff",
              color: isFullscreen ? "#fff" : "#4F46E5",
              fontWeight: 900,
              fontSize: 13,
              userSelect: "none",
            }}
          >
            {isFullscreen ? "Exit Full Screen" : "Full Screen"}
          </Box>
        </Box>
      </Box>

      {/* Topic input row + dropdown */}
      <Box
        sx={{
          px: 2,
          py: 1.2,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          gap: 1.2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter topic… e.g., Climate Change, A Brave Soldier"
          size="small"
          sx={{
            minWidth: 260,
            flex: "1 1 280px",
            "& .MuiOutlinedInput-root": { borderRadius: 2.2, bgcolor: "#fff" },
          }}
        />

        {/* ✅ NEW: content_type dropdown */}
        <TextField
          select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          size="small"
          sx={{
            minWidth: 210,
            "& .MuiOutlinedInput-root": { borderRadius: 2.2, bgcolor: "#fff" },
          }}
        >
          <MenuItem value="essay">Essay</MenuItem>
          <MenuItem value="fictional_character">Fictional Character</MenuItem>
          <MenuItem value="fictional_story">Fictional Story</MenuItem>
        </TextField>

        <PrimaryBtn label="Fetch Mind Map" onClick={fetchLiteratureMindMap} disabled={!topic.trim() || !lectureId} />

        <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <Badge>Lecture: {lectureId || "—"}</Badge>
          <Badge>Type: {contentType}</Badge>
          <Badge>Topic: {topic?.trim() ? topic.trim() : "—"}</Badge>
        </Box>
      </Box>

      {/* Category tabs */}
      {categoryKeys.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1.1,
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {categoryKeys.map((c) => (
            <ChipButton key={c} label={c} active={c === selectedCat} onClick={() => setSelectedCat(c)} />
          ))}
        </Box>
      )}

      {/* Canvas */}
      <Box
        ref={fitRef}
        sx={{
          flex: "1 1 auto",
          minHeight: 420,
          position: "relative",
          bgcolor: "#fff",
          overflow: "hidden",
          cursor: dragRef.current.dragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
        onMouseDown={(e) => onDown(e.clientX, e.clientY)}
        onMouseMove={(e) => onMove(e.clientX, e.clientY)}
        onMouseUp={onUp}
        onTouchStart={(e) => {
          const t = e.touches?.[0];
          if (!t) return;
          onDown(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          const t = e.touches?.[0];
          if (!t) return;
          onMove(t.clientX, t.clientY);
        }}
      >
        {!view ? (
          <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#6b7280" }}>
            Type a topic, select content type & click “Fetch Mind Map”
          </Box>
        ) : (
          <MindMapCanvas view={view} pan={pan} finalScale={finalScale} />
        )}
      </Box>
    </Paper>
  );
}

/* ---------------------- Canvas renderer ---------------------- */
function MindMapCanvas({ view, pan, finalScale }) {
  const { nodes, edges, nodeById, width, height } = view;

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${finalScale})`,
        transformOrigin: "0 0",
        width,
        height,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {edges.map((e) => {
          const a = nodeById.get(e.from);
          const b = nodeById.get(e.to);
          if (!a || !b) return null;

          const x1 = a.x + a.w;
          const y1 = a.y + a.h / 2;
          const x2 = b.x;
          const y2 = b.y + b.h / 2;

          const mx = (x1 + x2) / 2;
          const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;

          return <path key={`${e.from}-${e.to}`} d={d} fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="2" />;
        })}
      </svg>

      {nodes.map((n) => {
        const c = depthColors(n.depth);
        const ex = Array.isArray(n.examples) ? n.examples : [];
        const showEx = ex.filter(Boolean).slice(0, 4);

        return (
          <Box key={n.id} sx={{ position: "absolute", left: n.x, top: n.y, width: n.w, height: n.h }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 2,
                border: `1px solid ${c.border}`,
                bgcolor: c.bg,
                color: c.fg,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: 1.3,
                py: 0.8,
                gap: 0.5,
              }}
            >
              <Box
                title={n.title}
                sx={{
                  fontWeight: 950,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {n.title}
              </Box>

              {showEx.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mt: 0.25 }}>
                  {showEx.map((t, idx) => (
                    <Box
                      key={idx}
                      title={t}
                      sx={{
                        px: 0.8,
                        py: 0.22,
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 800,
                        bgcolor: n.depth === 0 ? "rgba(255,255,255,0.22)" : "rgba(17,24,39,0.06)",
                        border: "1px solid rgba(0,0,0,0.10)",
                        color: c.fg,
                        maxWidth: 210,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t}
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
}
