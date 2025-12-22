"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Box, Paper } from "@mui/material";
import { getMindMap } from "@/api/apiHelper";

/* ---------------------- helpers: build tree ---------------------- */
function toNode(title, obj) {
  return {
    id: crypto?.randomUUID?.() || String(Math.random()),
    title,
    percentage: typeof obj?.percentage === "number" ? obj.percentage : null,
    children: Object.entries(obj?.subtopics || {}).map(([k, v]) => toNode(k, v)),
  };
}

function buildTree(mind_map_obj) {
  const roots = Object.entries(mind_map_obj || {}).map(([k, v]) => toNode(k, v));
  if (roots.length === 1) return roots[0];
  return { id: "root", title: "Mind Map", percentage: null, children: roots };
}

/* ---------------------- helpers: layout ---------------------- */
function computeLayout(root, opts) {
  const { nodeW = 200, nodeH = 42, gapX = 160, gapY = 8, pad = 24 } = opts || {};

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

  const maxY = (leaves.length - 1) * (nodeH + gapY);
  const width = (maxDepth + 1) * (nodeW + gapX) + pad * 2 - gapX;
  const height = maxY + nodeH + pad * 2;

  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  return { nodes, edges, nodeById, width, height };
}

/* ---------------------- UI helpers ---------------------- */
function depthColors(depth) {
  if (depth === 0) return { bg: "#6D5EF6", fg: "#fff", border: "#6D5EF6" };
  if (depth === 1) return { bg: "#E9EEFF", fg: "#111827", border: "#B8C6FF" };
  return { bg: "#E7FAF3", fg: "#0F172A", border: "#9AE6C7" };
}

function ChipButton({ label, active, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        px: 1.35,
        py: 0.6,
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
      {label}
    </Box>
  );
}

function IconBtn({ label, onClick, title }) {
  return (
    <Box
      onClick={onClick}
      title={title || label}
      sx={{
        cursor: "pointer",
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

/* ---------------------- Loading UI (nice) ---------------------- */
/* ---------------------- Loading UI (nice) ---------------------- */
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

function SkeletonChip() {
  return (
    <Box
      sx={{
        width: 56,
        height: 30,
        borderRadius: 999,
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
        mb: 10,
        position: "relative",

        /* ✅ KEYFRAMES inside sx (NO style jsx) */
        "@keyframes mm_shimmer": {
          "0%": { backgroundPosition: "100% 0" },
          "100%": { backgroundPosition: "-120% 0" },
        },
        "@keyframes mm_spin": {
          to: { transform: "rotate(360deg)" },
        },
      }}
    >
      {/* Top bar skeleton */}
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
          <SkeletonLine w={120} h={16} r={6} />
          <Box sx={{ mt: 0.7 }}>
            <SkeletonLine w={220} h={12} r={6} />
          </Box>
        </Box>

        <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <SkeletonLine w={42} h={36} r={10} />
          <SkeletonLine w={64} h={36} r={10} />
          <SkeletonLine w={42} h={36} r={10} />
          <SkeletonLine w={110} h={36} r={10} />
        </Box>
      </Box>

      {/* Chips skeleton */}
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
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonChip key={i} />
        ))}
      </Box>

      {/* Canvas skeleton */}
      <Box
        sx={{
          flex: "1 1 auto",
          minHeight: 380,
          position: "relative",
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        {/* fake nodes */}
        <Box sx={{ position: "absolute", inset: 0, p: 2 }}>
          <Box sx={{ display: "flex", gap: 2, mt: 7, justifyContent: "center", flexWrap: "wrap" }}>
            <SkeletonLine w={220} h={48} r={12} />
            <SkeletonLine w={220} h={48} r={12} />
            <SkeletonLine w={220} h={48} r={12} />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 5, justifyContent: "center", flexWrap: "wrap" }}>
            <SkeletonLine w={220} h={48} r={12} />
            <SkeletonLine w={220} h={48} r={12} />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 5, justifyContent: "center", flexWrap: "wrap" }}>
            <SkeletonLine w={220} h={48} r={12} />
            <SkeletonLine w={220} h={48} r={12} />
            <SkeletonLine w={220} h={48} r={12} />
          </Box>
        </Box>

        {/* center loader */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
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


/* ---------------------- normalize API ---------------------- */
function normalizeMindMapApi(res) {
  const mm = res?.data?.mind_map || null;
  if (!mm) return null;

  const mind_maps = { ...(mm?.all_mind_maps || {}) };
  if (mm?.student_mind_map?.mind_map) {
    mind_maps["MY"] = { recommended: true, mind_map: mm.student_mind_map.mind_map };
  }

  return { student_category: mm?.student_category || null, mind_maps };
}

function pickMindMap(json, forcedCategory) {
  const cat = forcedCategory || json?.student_category;
  if (json?.mind_maps?.[cat]) return { category: cat, ...json.mind_maps[cat] };

  const entries = Object.entries(json?.mind_maps || {});
  return { category: entries[0]?.[0] || null, ...(entries[0]?.[1] || {}) };
}

/* ---------------------- Component ---------------------- */
export default function StudentMindMaps({ lectureId }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fitRef = useRef(null);
  const [fitSize, setFitSize] = useState({ w: 0, h: 0 });

  const [userScale, setUserScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
  });

  const [loading, setLoading] = useState(true);

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

  /* Load API */
  useEffect(() => {
    if (!lectureId) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await getMindMap(lectureId);
        const norm = normalizeMindMapApi(res);
        if (!norm) throw new Error("Mind map not found in API response.");

        if (!alive) return;

        setData(norm);
        const keys = Object.keys(norm?.mind_maps || {});
        setSelectedCategory(norm?.student_category || keys?.[0] || null);
        setUserScale(1);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load mind map");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [lectureId]);

  const categoryKeys = useMemo(() => Object.keys(data?.mind_maps || {}), [data]);

  const picked = useMemo(() => {
    if (!data || !selectedCategory) return null;
    return pickMindMap(data, selectedCategory);
  }, [data, selectedCategory]);

  useEffect(() => {
    if (!picked) return;
    setUserScale(1);
  }, [picked?.category]);

  const view = useMemo(() => {
    if (!picked) return null;
    const mm = picked.mind_map || {};
    const tree = buildTree(mm);
    return computeLayout(tree, { nodeW: 200, nodeH: 42, gapX: 160, gapY: 8, pad: 24 });
  }, [picked]);

  /* Auto-fit (shrink only) */
  const fitScale = useMemo(() => {
    if (!view || !fitSize.w || !fitSize.h) return 1;

    const SAFE = 40;
    const availW = Math.max(0, fitSize.w - SAFE);
    const availH = Math.max(0, fitSize.h - SAFE);

    const sx = availW / view.width;
    const sy = availH / view.height;

    return Math.max(0.18, Math.min(sx, sy, 1));
  }, [view, fitSize]);

  const finalScale = useMemo(() => {
    return Math.max(0.18, Math.min(3, fitScale * userScale));
  }, [fitScale, userScale]);

  /* Center */
  useEffect(() => {
    if (!view || !fitSize.w || !fitSize.h) return;

    const scaledW = view.width * finalScale;
    const scaledH = view.height * finalScale;

    setPan({
      x: (fitSize.w - scaledW) / 2,
      y: (fitSize.h - scaledH) / 2,
    });
  }, [view?.width, view?.height, fitSize.w, fitSize.h, finalScale]);

  /* Drag to pan */
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

  // ✅ Beautiful loading
  if (loading || !view) {
    return <LoadingState isFullscreen={isFullscreen} />;
  }

  const { nodes, edges, nodeById, width, height } = view;

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
        height: isFullscreen ? "100vh" : "calc(100vh - 220px)",
        minHeight: 620,
        mb: 10,
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
            Mind Map
          </Box>
          <Box sx={{ fontSize: 12.5, color: "#6b7280" }}>
            Drag to pan • Auto-fit (shrink) • Zoom controls
          </Box>
        </Box>

        <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <IconBtn label="−" title="Zoom out" onClick={() => setUserScale((s) => Math.max(0.6, +(s / 1.15).toFixed(4)))} />
          <IconBtn label="100%" title="Reset zoom" onClick={() => setUserScale(1)} />
          <IconBtn label="+" title="Zoom in" onClick={() => setUserScale((s) => Math.min(2.5, +(s * 1.15).toFixed(4)))} />

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

      {/* Filters */}
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
          <ChipButton key={c} label={c} active={c === selectedCategory} onClick={() => setSelectedCategory(c)} />
        ))}
      </Box>

      {/* Canvas */}
      <Box
        ref={fitRef}
        sx={{
          flex: "1 1 auto",
          minHeight: 380,
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
        {/* World */}
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
                    alignItems: "center",
                    px: 1.2,
                    gap: 1,
                  }}
                >
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    <Box
                      title={n.title}
                      sx={{
                        fontWeight: 900,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {n.title}
                    </Box>

                    {typeof n.percentage === "number" && (
                      <Box sx={{ fontSize: 11.5, opacity: 0.9 }}>
                        Progress: <b>{n.percentage.toFixed(2)}%</b>
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      bgcolor: n.depth === 0 ? "rgba(255,255,255,0.85)" : "rgba(99,102,241,0.45)",
                    }}
                  />
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
