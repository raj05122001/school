"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Tooltip,
  IconButton,
  Chip,
  Fade,
  Zoom,
  Alert,
  Snackbar,
  LinearProgress,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { getLiteratureMindMap } from "@/api/apiHelper";

/* ---------------- React Icons (NO @mui/icons-material) ---------------- */
import {
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
  FiMinimize,
  FiSearch,
} from "react-icons/fi";
import { MdCenterFocusStrong } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import { FaBrain, FaUser, FaBookOpen, FaPenNib } from "react-icons/fa";

/* ---------------- Utility ---------------- */
const uid = () => crypto?.randomUUID?.() || String(Math.random());

/* ---------------- MindMap Colors ---------------- */
function depthColors(depth) {
  // keep your screenshot-like node colors
  if (depth === 0) return { bg: "#6D5EF6", fg: "#fff", border: "#6D5EF6" };
  if (depth === 1) return { bg: "#E9EEFF", fg: "#111827", border: "#B8C6FF" };
  if (depth === 2) return { bg: "#E7FAF3", fg: "#0F172A", border: "#9AE6C7" };
  return { bg: "#F8FAFC", fg: "#111827", border: "rgba(0,0,0,0.10)" };
}

/* ---------------- UI Components ---------------- */
function AnimatedChip({ label, active, onClick, icon }) {
  return (
    <Zoom in={true}>
      <Chip
        icon={icon}
        label={label?.replaceAll("_", " ")?.toUpperCase()}
        onClick={onClick}
        variant={active ? "filled" : "outlined"}
        sx={{
          fontWeight: 800,
          transition: "all 0.25s ease",
          transform: active ? "scale(1.05)" : "scale(1)",
          bgcolor: active ? "success.main" : "transparent",
          color: active ? "#fff" : "text.primary",
          borderColor: active ? "success.main" : "rgba(15,23,42,0.18)",
          boxShadow: active ? "0 6px 18px rgba(0,0,0,0.10)" : "none",
          "&:hover": {
            transform: "scale(1.07)",
            boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
          },
        }}
      />
    </Zoom>
  );
}

function FloatingActionButton({ icon, onClick, title, disabled, active }) {
  return (
    <Tooltip title={title} arrow placement="top">
      <span>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          sx={{
            bgcolor: "#D7FCE0",
            color: "#0F172A",
            border: `1px solid ${alpha("#174321", 0.18)}`,
            boxShadow: active
              ? "0 8px 20px rgba(0,0,0,0.18)"
              : "0 6px 16px rgba(0,0,0,0.12)",
            transition: "all 0.25s ease",
            "&:hover": {
              bgcolor: alpha("#D7FCE0", 0.95),
              transform: "translateY(-2px)",
              boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
            },
            "&.Mui-disabled": { bgcolor: "#D7FCE0", opacity: 0.6 },
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

/* ---------------- Build Tree (for your API shape) ----------------
API:
data.mind_map.category_X.mind_map = { topic: "...", nodes: { ... } }
each node: { Subtopics: {...}, Examples: [...] }
-------------------------------------------------------------------------- */
function toNodeFromLiterature(title, value, depth = 0) {
  const node = {
    id: uid(),
    title: String(title),
    depth,
    examples: [],
    children: [],
  };
  if (!value || typeof value !== "object") return node;

  const ex = Array.isArray(value?.Examples) ? value.Examples : [];
  node.examples = ex.map((x) => String(x));

  const subs =
    value?.Subtopics && typeof value.Subtopics === "object"
      ? value.Subtopics
      : {};
  node.children = Object.entries(subs).map(([k, v]) =>
    toNodeFromLiterature(k, v, depth + 1)
  );
  return node;
}

function buildLiteratureTree(nodesObj, rootTitle = "Mind Map") {
  const root = {
    id: uid(),
    title: rootTitle,
    depth: 0,
    examples: [],
    children: [],
  };
  const entries = Object.entries(nodesObj || {});
  root.children = entries.map(([k, v]) => toNodeFromLiterature(k, v, 1));
  return root;
}

/* ---------------- Layout ---------------- */
function computeLayout(root, opts) {
  const {
    nodeW = 280,
    nodeH = 70,
    gapX = 200,
    gapY = 20,
    pad = 40,
  } = opts || {};
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

/* ---------------- Normalize (UPDATED for your API response) ----------------
Returns:
{
  categories: {
    category_A: { topic: "...", nodes: {...} },
    ...
  }
}
-------------------------------------------------------------------------- */
function normalizeLiteratureApi(res) {
  const payload = res?.data || res;
  const mindMap = payload?.data?.mind_map || payload?.mind_map || null;
  if (!mindMap || typeof mindMap !== "object") return null;

  const categories = Object.entries(mindMap).reduce((acc, [catKey, catVal]) => {
    const mm = catVal?.mind_map || {};
    acc[catKey] = {
      topic: String(mm?.topic || ""),
      nodes: mm?.nodes && typeof mm.nodes === "object" ? mm.nodes : {},
    };
    return acc;
  }, {});

  return { categories };
}

/* ---------------- Main Component ---------------- */
export default function StudentLiteratureMindMap({ lectureId }) {
  const theme = useTheme();

  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("fictional_story");

  const [data, setData] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const getContentIcon = () => {
    const style = { fontSize: 16, marginRight: 6, display: "inline-flex" };
    switch (contentType) {
      case "essay":
        return <FaPenNib style={style} />;
      case "fictional_character":
        return <FaUser style={style} />;
      case "fictional_story":
      default:
        return <FaBookOpen style={style} />;
    }
  };

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

  const categoryKeys = useMemo(
    () => Object.keys(data?.categories || {}),
    [data]
  );

  const fetchLiteratureMindMap = async () => {
    if (!lectureId) return;
    if (!topic.trim()) {
      setErr("Please enter a topic to generate mind map");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const formData = {
        lecture_id: lectureId,
        topics: topic.trim(),
        content_type: contentType,
      };

      const res = await getLiteratureMindMap(formData);
      const norm = normalizeLiteratureApi(res);
      if (!norm) throw new Error("Mind map not found in API response.");

      setData(norm);

      const cats = Object.keys(norm.categories || {});
      setSelectedCat(cats?.[0] || null);

      setUserScale(1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
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
    const cat = data.categories?.[selectedCat] || {};
    const rootTitle = cat?.topic ? String(cat.topic) : selectedCat;
    const nodesObj = cat?.nodes || {};
    const tree = buildLiteratureTree(nodesObj, rootTitle);
    return computeLayout(tree, {
      nodeW: 250,
      nodeH: 58,
      gapX: 190,
      gapY: 10,
      pad: 24,
    });
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

  const finalScale = useMemo(
    () => Math.max(0.18, Math.min(3, fitScale * userScale)),
    [fitScale, userScale]
  );

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

  const resetView = () => {
    setUserScale(1);
    if (!view || !fitSize.w || !fitSize.h) return;
    const scaledW = view.width * fitScale;
    const scaledH = view.height * fitScale;
    setPan({ x: (fitSize.w - scaledW) / 2, y: (fitSize.h - scaledH) / 2 });
  };

  return (
    <>
      <Snackbar
        open={showSuccess}
        autoHideDuration={2500}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ boxShadow: 3 }}>
          Mind map generated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!err}
        autoHideDuration={5000}
        onClose={() => setErr("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setErr("")}
          sx={{ boxShadow: 3 }}
        >
          {err}
        </Alert>
      </Snackbar>

      <Paper
        ref={containerRef}
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 680,
          mb: 3,
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "#fff",
            borderBottom: `1px solid ${alpha("#0f172a", 0.06)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha("#D7FCE0", 0.65),
                display: "grid",
                placeItems: "center",
                border: `1px solid ${alpha("#174321", 0.22)}`,
              }}
            >
              <FaBrain size={28} color="#174321" />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, color: "#0F172A", lineHeight: 1 }}
              >
                Literature Mind Map
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: alpha("#0F172A", 0.68) }}
              >
                Visualize your literary concepts interactively
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <FloatingActionButton
              icon={<FiZoomOut size={18} />}
              title="Zoom Out"
              disabled={!view}
              onClick={() =>
                setUserScale((s) => Math.max(0.5, +(s / 1.2).toFixed(4)))
              }
            />
            <FloatingActionButton
              icon={<MdCenterFocusStrong size={18} />}
              title="Reset View"
              disabled={!view}
              onClick={resetView}
            />
            <FloatingActionButton
              icon={<FiZoomIn size={18} />}
              title="Zoom In"
              disabled={!view}
              onClick={() =>
                setUserScale((s) => Math.min(3, +(s * 1.2).toFixed(4)))
              }
            />
            <Box
              sx={{
                width: 1,
                height: 32,
                bgcolor: alpha("#0f172a", 0.1),
                mx: 1,
              }}
            />
            <FloatingActionButton
              icon={
                isFullscreen ? (
                  <FiMinimize size={18} />
                ) : (
                  <FiMaximize size={18} />
                )
              }
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              onClick={toggleFullscreen}
              active={isFullscreen}
            />
          </Box>
        </Box>

        {/* Input Section */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <TextField
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter your topic (e.g., Climate Change, Shakespeare's Works)"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch size={18} color="rgba(0,0,0,0.6)" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
              sx={{
                flex: "1 1 300px",
                minWidth: 280,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                  "&.Mui-focused": {
                    boxShadow: `0 8px 20px ${alpha("#16AA54", 0.18)}`,
                  },
                },
              }}
            />

            <TextField
              select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: getContentIcon(),
                sx: { borderRadius: 2 },
              }}
              sx={{
                minWidth: 240,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "& .MuiSelect-icon": { color: "#16AA54" },
                },
              }}
            >
              <MenuItem value="essay">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaPenNib size={14} /> Essay
                </Box>
              </MenuItem>
              <MenuItem value="fictional_character">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaUser size={14} /> Fictional Character
                </Box>
              </MenuItem>
              <MenuItem value="fictional_story">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FaBookOpen size={14} /> Fictional Story
                </Box>
              </MenuItem>
            </TextField>

            <Tooltip
              title={!lectureId ? "Lecture ID required" : "Generate mind map"}
            >
              <span>
                <IconButton
                  onClick={fetchLiteratureMindMap}
                  disabled={!topic.trim() || !lectureId || loading}
                  sx={{
                    background:
                      "linear-gradient(238deg, #16AA54 -15.62%, #094422 82.04%)",
                    color: "#fff",
                    px: 3,
                    py: 0.9,
                    borderRadius: 2,
                    boxShadow: `0 10px 22px ${alpha("#094422", 0.25)}`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 14px 28px ${alpha("#094422", 0.3)}`,
                    },
                    "&.Mui-disabled": {
                      background: alpha("#0f172a", 0.22),
                      color: "#fff",
                    },
                  }}
                >
                  <span style={{ marginRight: 8, display: "inline-flex" }}>
                    <HiSparkles size={18} />
                  </span>
                  <Typography variant="button" fontWeight={800}>
                    {loading ? "Generating..." : "Generate"}
                  </Typography>
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        {/* Category Tabs */}
        {categoryKeys.length > 0 && (
          <Box
            sx={{
              px: 3,
              py: 1,
              bgcolor: "grey.50",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={800}
                color="text.secondary"
              >
                Categories:
              </Typography>
              {(categoryKeys ? [...categoryKeys].reverse() : []).map((c) => (
                <AnimatedChip
                  key={c}
                  label={c}
                  active={c === selectedCat}
                  onClick={() => setSelectedCat(c)}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Canvas (✅ loader overlay inside canvas — header/filters stay visible) */}
        <Box
          ref={fitRef}
          sx={{
            flex: "1 1 auto",
            minHeight: 480,
            position: "relative",
            background: `radial-gradient(circle at 50% 50%, ${alpha(
              "#16AA54",
              0.06
            )} 0%, #EEF1F6 100%)`,
            overflow: "hidden",
            cursor: dragRef.current.dragging
              ? "grabbing"
              : view
              ? "grab"
              : "default",
            touchAction: "none",
          }}
          onMouseDown={(e) => view && onDown(e.clientX, e.clientY)}
          onMouseMove={(e) => onMove(e.clientX, e.clientY)}
          onMouseUp={onUp}
          onTouchStart={(e) => {
            const t = e.touches?.[0];
            if (!t || !view) return;
            onDown(t.clientX, t.clientY);
          }}
          onTouchMove={(e) => {
            const t = e.touches?.[0];
            if (!t) return;
            onMove(t.clientX, t.clientY);
          }}
        >
          {!view ? (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Fade in={true}>
                <Box sx={{ textAlign: "center", maxWidth: 420, px: 3 }}>
                  <Box
                    sx={{
                      mb: 2,
                      color: "text.disabled",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <FaBrain size={64} />
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="text.secondary"
                    fontWeight={800}
                  >
                    Ready to Explore Literature
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter a topic, select content type, and click
                    &quot;Generate&quot; to create your interactive mind map
                  </Typography>
                </Box>
              </Fade>
            </Box>
          ) : (
            <MindMapCanvas view={view} pan={pan} finalScale={finalScale} />
          )}

          {/* ✅ Premium Loader Overlay */}
          <Fade in={loading} unmountOnExit>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                display: "grid",
                placeItems: "center",
                background: alpha("#ffffff", 0.72),
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  px: 3,
                  py: 2.5,
                  borderRadius: 3,
                  minWidth: { xs: "86%", sm: 420 },
                  maxWidth: 520,
                  border: `1px solid ${alpha("#16AA54", 0.22)}`,
                  boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
                  background: `linear-gradient(180deg, ${alpha(
                    "#16AA54",
                    0.08
                  )} 0%, #ffffff 70%)`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(238deg, #16AA54 -15.62%, #094422 82.04%)",
                      display: "grid",
                      placeItems: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: -10,
                        borderRadius: "50%",
                        border: `2px solid ${alpha("#fff", 0.35)}`,
                        animation: "mmPulse 1.4s ease-in-out infinite",
                        "@keyframes mmPulse": {
                          "0%": { transform: "scale(0.7)", opacity: 0.0 },
                          "25%": { opacity: 0.6 },
                          "100%": { transform: "scale(1.25)", opacity: 0.0 },
                        },
                      }}
                    />
                    <FaBrain size={20} color="#fff" />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{ fontWeight: 900, fontSize: 16, color: "#0F172A" }}
                    >
                      Generating Mind Map
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: alpha("#0F172A", 0.68),
                        mt: 0.25,
                      }}
                    >
                      Analyzing literature and building connections...
                    </Typography>
                  </Box>
                </Box>

                <LinearProgress
                  sx={{
                    mt: 2,
                    height: 8,
                    borderRadius: 999,
                    bgcolor: alpha("#16AA54", 0.1),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background:
                        "linear-gradient(238deg, #16AA54 -15.62%, #094422 82.04%)",
                    },
                  }}
                />

                <Typography
                  sx={{ mt: 1.2, fontSize: 12, color: alpha("#0F172A", 0.55) }}
                >
                  Tip: You can keep browsing categories after it loads.
                </Typography>
              </Paper>
            </Box>
          </Fade>
        </Box>
      </Paper>
    </>
  );
}

/* ---------------------- Canvas renderer ---------------------- */
function MindMapCanvas({ view, pan, finalScale }) {
  const { nodes, edges, nodeById, width, height } = view;

  // green theme edge
  const EDGE = alpha("#16AA54", 0.28);

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
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
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

          return (
            <path
              key={`${e.from}-${e.to}`}
              d={d}
              fill="none"
              stroke={EDGE}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {nodes.map((n) => {
        const c = depthColors(n.depth);
        const ex = Array.isArray(n.examples) ? n.examples : [];
        const showEx = ex.filter(Boolean).slice(0, 4);

        return (
          <Box
            key={n.id}
            sx={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: n.w,
              height: n.h,
            }}
          >
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
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mt: 0.25 }}
                >
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
                        bgcolor:
                          n.depth === 0
                            ? "rgba(255,255,255,0.22)"
                            : "rgba(17,24,39,0.06)",
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
