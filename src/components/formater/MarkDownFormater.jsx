"use client";

import React, { useMemo } from "react";
import { Box } from "@mui/material";
import MathJax from "react-mathjax2";

/* -------------------- basic decoders -------------------- */
function decodeBasicEntities(s) {
  if (!s) return "";
  s = s.replace(/&amp;(lt|gt|amp|quot|#39);/gi, "&$1;");
  return s
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/gi, "&");
}
function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function _injectClass(tagName, html, classToAdd) {
  const re = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  return html.replace(re, (_m, attrsRaw) => {
    let attrs = attrsRaw || "";
    if (/class="/i.test(attrs)) {
      attrs = attrs.replace(
        /class="([^"]*)"/i,
        (_m2, v) => `class="${v} ${classToAdd}"`
      );
    } else {
      attrs = `${attrs} class="${classToAdd}"`;
    }
    return `<${tagName}${attrs}>`;
  });
}

/* literal escape decoder (keep it conservative) */
function softDecodeEscapes(s) {
  if (!s) return "";
  s = String(s);
  s = s.replace(/\\+r\\+n/gi, "\n");
  s = s.replace(/\\+r/gi, "\n");
  s = s.replace(/\\+n/gi, "\n");
  s = s.replace(/\\+t/gi, "    ");
  s = s.replace(/\\"/g, '"').replace(/\\'/g, "'");
  return s;
}

/* -------------------- Markdown → HTML -------------------- */
export function markdownToHtml(src) {
  if (!src) return "";
  let s = softDecodeEscapes(String(src));
  s = decodeBasicEntities(s);

  // 🔹 convert HTML <br> tags to real newlines so markdown/headings work
  s = s.replace(/<br\s*\/?>/gi, "\n");

  // 🔹 SPECIAL: lines like "####Alloted Marks: 4 / 5" → single paragraph
  //   and "####Student Answer: ..." / "####Feedback: ..." etc.
  s = s.replace(
    /^####\s*([^:\n]+):(.*)$/gm,
    (_m, label, rest) =>
      `<p><strong>${label.trim()}:</strong>${rest}</p>`
  );

  // protect fenced code blocks
  const codeBlocks = [];
  s = s.replace(/```([\w-]+)?\n([\s\S]*?)```/g, (_, lang = "", code) => {
    const i = codeBlocks.push({ lang, code }) - 1;
    return `\uE000CODEBLOCK${i}\uE000`;
  });

  // normalize EOL
  s = s.replace(/\r\n?/g, "\n");

  // protect safe HTML tags
  const ALLOWED_TAG =
    /<(\/?(?:div|span|p|h[1-6]|table|thead|tbody|tr|th|td|img|a|em|strong|blockquote|ul|ol|li|hr|br|section))(\s[^>]*)?>/gi;
  const tagTokens = [];
  s = s.replace(ALLOWED_TAG, (_m, name, attrs = "") => {
    const original = `<${name}${attrs || ""}>`;
    const i = tagTokens.push(original) - 1;
    return `\uE000TAG${i}\uE000`;
  });

  // escape everything else
  s = _escapeHtml(s);

  // hr
  s = s.replace(
    /^(?:[ \t]*)([-*_])\1\1(?:\1+)?[ \t]*$/gm,
    "<hr>"
  );

  // headings (allow `##Q1` as well as `## Q1`)
  s = s.replace(
    /^[ \t]{0,3}(#{1,6})[ \t]*(.+?)\s*#*\s*$/gm,
    (_, H, t) => `<h${H.length}>${t}</h${H.length}>\n`
  );
  s = s.replace(
    /(^|\n)([^\n]+)\n[ \t]*(=+|-+)[ \t]*\n/g,
    (_m, lead, title, bar) =>
      `${lead}<h${
        bar.trim().startsWith("=") ? 1 : 2
      }>${title.trim()}</h${bar.trim().startsWith("=") ? 1 : 2}>\n`
  );

  // blockquotes
  s = s.replace(/^[ \t]*&gt;[ \t]?(.*)$/gm, "<blockquote>$1</blockquote>");

  // images / links / inline code
  s = s.replace(
    /!\[([^\]]*)\]\(([^)\s]+)\)/g,
    '<img alt="$1" src="$2" />'
  );
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 🔹 MATH ko touch nahi kar rahe: `$...$`, `$$...$$`, `\(...\)`, `\[...\]`
  // MathJax unhe khud parse karega.

  // ordered lists
  s = s.replace(
    /(^\s*\d+\.\s+.*(?:\n\s*\d+\.\s+.*)*)/gm,
    (block) => {
      const lines = block
        .split("\n")
        .filter((l) => /^\s*\d+\.\s+/.test(l));
      if (!lines.length) return block;
      const start = parseInt(
        (lines[0].match(/^\s*(\d+)\./) || [])[1] || "1",
        10
      );
      const items = lines
        .map((l) => l.replace(/^\s*\d+\.\s+/, "").trim())
        .filter(Boolean);
      return `<ol start="${start}">${items
        .map((i) => `<li>${i}</li>`)
        .join("")}</ol>`;
    }
  );

  // unordered lists
  s = s.replace(
    /(^\s*[-*+]\s+.*(?:\n\s*[-*+]\s+.*)*)/gm,
    (block) => {
      const items = block
        .split("\n")
        .filter((l) => /^\s*[-*+]\s+/.test(l))
        .map((l) => l.replace(/^\s*[-*+]\s+/, "").trim())
        .filter(Boolean);
      return `<ul>${items
        .map((i) => `<li>${i}</li>`)
        .join("")}</ul>`;
    }
  );

  // pipe tables
  s = s.replace(
    /(^\|.+\|\s*\n\|(?:[-: ]+\|)+\s*\n(?:\|.*\|\s*\n?)+)/gm,
    (tbl) => {
      const lines = tbl.trim().split("\n");
      const header = lines[0]
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      const rows = lines.slice(2).map((ln) =>
        ln
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim())
      );
      const thead = `<thead><tr>${header
        .map((h) => `<th>${h}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map(
          (r) =>
            `<tr>${r
              .map((c) => `<td>${c}</td>`)
              .join("")}</tr>`
        )
        .join("")}</tbody>`;
      return `<table>${thead}${tbody}</table>`;
    }
  );

  // paragraph wrapping
  s = s
    .split(/\n{2,}/)
    .map((block) => {
      const t = block.trim();
      if (
        /^(<h\d|<ul>|<ol\b|<table|<thead|<tbody|<tr|<th\b|<td\b|<blockquote>|<hr>|<div\b|<span\b|<pre>|<img|<p>|<code>|\uE000TAG\d+\uE000)/.test(
          t
        )
      )
        return block;
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  // restore HTML tags
  s = s.replace(
    /\uE000TAG(\d+)\uE000/g,
    (_m, i) => tagTokens[Number(i)] ?? ""
  );

  // absolute + size images
  const BASE_IMG = "https://tbm-plus.s3.amazonaws.com/";
  s = s.replace(
    /<img\s+([^>]*?)>/gi,
    (_m, attrs) => {
      let a = (attrs || "").trim();
      a = a.replace(/src="([^"]*)"/i, (_m2, src) => {
        if (/^(https?:\/\/|data:)/i.test(src))
          return `src="${src}"`;
        return `src="${BASE_IMG}${src.replace(/^\/+/, "")}"`;
      });
      const styleAdd =
        "max-width:100%;height:auto;max-height:420px;object-fit:contain;display:block;margin:16px auto";
      if (/style="/i.test(a)) {
        a = a.replace(
          /style="([^"]*)"/i,
          (_m3, v) => `style="${v};${styleAdd}"`
        );
      } else {
        a += ` style="${styleAdd}"`;
      }
      if (/class="/i.test(a)) {
        a = a.replace(
          /class="([^"]*)"/i,
          (_m4, v) => `class="${v} max-w-full h-auto rounded"`
        );
      } else {
        a += ` class="max-w-full h-auto rounded"`;
      }
      if (!/onerror="/i.test(a))
        a += ` onerror="this.style.display='none'"`;
      return `<img ${a}>`;
    }
  );

  // add utility classes
  s = _injectClass(
    "table",
    s,
    "w-full border-collapse my-4 text-sm"
  );
  s = _injectClass(
    "th",
    s,
    "border border-slate-200 p-2 bg-slate-50 text-left font-semibold"
  );
  s = _injectClass(
    "td",
    s,
    "border border-slate-200 p-2 align-top"
  );
  s = _injectClass(
    "ol",
    s,
    "my-3 list-decimal ps-6"
  );
  s = _injectClass(
    "ul",
    s,
    "my-3 list-disc ps-6"
  );

  return s;
}

/* -------------------- MathJax-based Component -------------------- */
export default function MarkDownFormater({ data }) {
  const html = useMemo(() => markdownToHtml(data), [data]);

  return (
    <MathJax.Context input="tex">
      <Box component="main" className="math-scope">
        <style>{`
          .math-scope img{ border-radius:.5rem; max-width:100%; height:auto; }

          .math-scope ol li, .math-scope ul li { margin-bottom: .5em; }
          .math-scope ol, .math-scope ul { margin: .75em 0 .75em 1.25em; }
          .math-scope li { line-height: 1.7; }

          .math-scope table { border-collapse: collapse; width: 100%; font-size: 1em; }
          .math-scope th, .math-scope td { border: 1px solid #e5e7eb; padding: .5em; }
          .math-scope th { background: #f1f5f9; text-align: left; font-weight: 600; }

          .math-scope h1 { font-size: 1.8em; line-height: 1.2;  margin: .9em 0 .5em; font-weight: 800; }
          .math-scope h2 { font-size: 1.6em; line-height: 1.25; margin: .85em 0 .5em; font-weight: 800; }
          .math-scope h3 { font-size: 1.4em; line-height: 1.3;  margin: .8em 0 .5em; font-weight: 700; }
          .math-scope h4 { font-size: 1.25em;line-height: 1.35; margin: .75em 0 .5em; font-weight: 700; }
          .math-scope h5 { font-size: 1.125em;line-height: 1.4;  margin: .7em 0 .4em;  font-weight: 600; }
          .math-scope h6 { font-size: 1.0em;  line-height: 1.4;  margin: .65em 0 .4em; font-weight: 600; letter-spacing: .02em; }

          .math-scope p { margin: .75em 0; line-height: 1.7; font-weight: 400; }

          .math-scope code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: .9em; background: rgba(0,0,0,.05); color: #334155;
            padding: .1em .3em; border-radius: .25em; word-break: break-word;
          }
          .math-scope pre {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: .9em; background: #0f172a; color: #e5e7eb;
            padding: .75em 1em; border-radius: .5em; overflow: auto; margin: 1em 0;
          }
          .math-scope pre code { background: transparent; color: inherit; padding: 0; }

          .math-scope blockquote {
            border-left: 4px solid #e2e8f0; padding: .5em 1em; margin: 1em 0;
            color: #334155; background: #f8fafc; border-radius: .25em;
          }
          .math-scope hr { margin: 1.25em 0; border: 0; border-top: 1px solid #e2e8f0; }
          .math-scope a { color: #2563eb; text-decoration: underline; }
          .math-scope a:hover { text-decoration: none; }
        `}</style>

        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Box>
    </MathJax.Context>
  );
}
