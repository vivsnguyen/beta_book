(function () {
  "use strict";

  var h = React.createElement;
  var BOULDER_GRADES = [
    "VB",
    "V0",
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V11",
    "V12",
    "V13",
    "V14",
    "V15",
    "V16",
    "V17",
  ];
  var ROUTE_GRADES = ["5.6", "5.7", "5.8", "5.9"].concat(
    [].concat.apply(
      [],
      Array.from({ length: 6 }, function (_, n) {
        return ["a", "b", "c", "d"].map(function (suffix) {
          return "5." + (n + 10) + suffix;
        });
      }),
    ),
  );
  var STYLES = ["Boulder", "Sport", "Trad", "Top Rope"];
  var SENDS = ["Flash", "Onsight", "Redpoint", "Attempt"];
  var ANGLES = ["Slab", "Vertical", "Overhang", "Roof"];
  var LS_KEY = "beta-book-climbs-v1";
  var SAMPLE_CLIMBS = [
    [
      "2026-05-03",
      "Boulder",
      "V2",
      "Flash",
      1,
      4,
      "Vertical World",
      "Vertical",
      "",
    ],
    [
      "2026-05-10",
      "Boulder",
      "V3",
      "Redpoint",
      5,
      7,
      "Vertical World",
      "Overhang",
      "",
    ],
    [
      "2026-05-17",
      "Sport",
      "5.9",
      "Onsight",
      1,
      5,
      "Index Town Wall",
      "Vertical",
      "",
    ],
    [
      "2026-05-24",
      "Boulder",
      "V3",
      "Flash",
      1,
      5,
      "Vertical World",
      "Slab",
      "",
    ],
    [
      "2026-06-02",
      "Sport",
      "5.10a",
      "Redpoint",
      3,
      7,
      "Index Town Wall",
      "Overhang",
      "",
    ],
    [
      "2026-06-14",
      "Boulder",
      "V4",
      "Redpoint",
      8,
      8,
      "Stone Gardens",
      "Overhang",
      "",
    ],
    [
      "2026-06-14",
      "Boulder",
      "V4",
      "Attempt",
      6,
      9,
      "Stone Gardens",
      "Roof",
      "Current project",
    ],
    [
      "2026-07-01",
      "Sport",
      "5.10b",
      "Redpoint",
      4,
      7,
      "Vantage",
      "Vertical",
      "",
    ],
    [
      "2026-07-19",
      "Boulder",
      "V5",
      "Redpoint",
      10,
      9,
      "Stone Gardens",
      "Overhang",
      "",
    ],
    [
      "2026-08-02",
      "Sport",
      "5.10c",
      "Onsight",
      1,
      6,
      "Index Town Wall",
      "Slab",
      "",
    ],
    [
      "2026-08-20",
      "Boulder",
      "V5",
      "Flash",
      1,
      6,
      "Stone Gardens",
      "Vertical",
      "",
    ],
    [
      "2026-09-05",
      "Sport",
      "5.10d",
      "Redpoint",
      6,
      8,
      "Vantage",
      "Overhang",
      "",
    ],
  ].map(function (row, index) {
    return {
      id: "s" + (index + 1),
      date: row[0],
      style: row[1],
      grade: row[2],
      send: row[3],
      attempts: row[4],
      effort: row[5],
      location: row[6],
      angle: row[7],
      notes: row[8],
      sample: true,
    };
  });

  function disciplineOf(style) {
    return style === "Boulder" ? "boulder" : "route";
  }
  function scaleFor(style) {
    return disciplineOf(style) === "boulder" ? BOULDER_GRADES : ROUTE_GRADES;
  }
  function fmtDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  function monthKey(date) {
    return date.slice(0, 7);
  }
  function monthLabel(month) {
    return new Date(month + "-01T00:00:00").toLocaleDateString(undefined, {
      month: "short",
    });
  }
  function loadClimbs() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }
  function saveClimbs(climbs) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(climbs));
    } catch (_) {}
  }

  var SEND_TYPE_HELP = [
    ["Flash", "Sent first try, after watching someone else or getting beta."],
    ["Onsight", "Sent first try, with zero beta or prior knowledge."],
    ["Redpoint", "Sent after one or more earlier attempts."],
    ["Attempt", "Didn't send - still working the moves or the project."],
  ];

  function optionElements(values) {
    return values.map(function (value) {
      return h("option", { key: value }, value);
    });
  }

  function FormField({ label, name, children, className }) {
    return h(
      "div",
      { className: "field" + (className ? " " + className : "") },
      h("label", { htmlFor: "f-" + name }, label),
      children,
    );
  }

  function SelectField({ label, name, value, options, onChange, help }) {
    return h(
      "div",
      { className: "field" },
      h("label", { htmlFor: "f-" + name }, label, help),
      h(
        "select",
        { id: "f-" + name, value: value, onChange: onChange },
        optionElements(options),
      ),
    );
  }
  function sendHelp() {
    return h(
      "span",
      { className: "info-wrap" },
      h(
        "button",
        {
          type: "button",
          className: "info-btn",
          "aria-label": "What do send types mean?",
        },
        "i",
      ),
      h(
        "span",
        { className: "info-pop", role: "tooltip" },
        h(
          "dl",
          { style: { margin: 0 } },
          SEND_TYPE_HELP.map(function (item) {
            return h(
              React.Fragment,
              { key: item[0] },
              h("dt", null, item[0]),
              h("dd", null, item[1]),
            );
          }),
        ),
      ),
    );
  }

  function Stats({ climbs }) {
    var sent = climbs.filter(function (c) {
      return c.send !== "Attempt";
    });
    var sessions = new Set(
      climbs.map(function (c) {
        return c.date;
      }),
    ).size;
    function hardest(kind) {
      var grades = kind === "boulder" ? BOULDER_GRADES : ROUTE_GRADES;
      var values = sent
        .filter(function (c) {
          return disciplineOf(c.style) === kind;
        })
        .map(function (c) {
          return grades.indexOf(c.grade);
        });
      var best = Math.max.apply(null, values.length ? values : [-1]);
      return best >= 0 ? grades[best] : "-";
    }
    var month = new Date().toISOString().slice(0, 7);
    var tiles = [
      ["Total climbs", climbs.length, ""],
      ["Sessions logged", sessions, ""],
      ["Hardest boulder", hardest("boulder"), "boulder"],
      ["Hardest route", hardest("route"), "route"],
      [
        "Send rate",
        (climbs.length ? Math.round((sent.length / climbs.length) * 100) : 0) +
          "%",
        "",
      ],
      [
        "This month",
        climbs.filter(function (c) {
          return monthKey(c.date) === month;
        }).length,
        "",
      ],
    ];
    return h(
      "section",
      { className: "stats", "aria-label": "Summary stats" },
      tiles.map(function (tile) {
        return h(
          "div",
          { className: "stat", key: tile[0] },
          h("span", { className: "label" }, tile[0]),
          h("span", { className: "value " + tile[2] }, tile[1]),
          tile[0] === "This month" &&
            h("span", { className: "sub" }, "climbs logged"),
        );
      }),
    );
  }

  function ProgressChart({ climbs, kind, title, subtitle }) {
    var scale = kind === "boulder" ? BOULDER_GRADES : ROUTE_GRADES;
    var items = climbs
      .filter(function (c) {
        return disciplineOf(c.style) === kind;
      })
      .sort(function (a, b) {
        return a.date.localeCompare(b.date);
      });
    if (!items.length)
      return h(
        "div",
        { className: "chart-card" },
        h("h3", null, title),
        h("p", { className: "chart-sub" }, subtitle),
        h(
          "svg",
          { viewBox: "0 0 460 220" },
          h(
            "text",
            { className: "empty-chart", x: 230, y: 110, textAnchor: "middle" },
            "Log a " + kind + " to see progress",
          ),
        ),
      );
    var sent = items.filter(function (c) {
      return c.send !== "Attempt";
    });
    var best = sent.reduce(function (max, c) {
      return Math.max(max, scale.indexOf(c.grade));
    }, -1);
    var points = sent.reduce(function (result, c) {
      var rank = scale.indexOf(c.grade);
      if (
        rank >= 0 &&
        (!result.length || rank > result[result.length - 1].rank)
      )
        result.push({ rank: rank, index: items.indexOf(c) });
      return result;
    }, []);
    var min = Math.max(
      0,
      Math.min.apply(
        null,
        items.map(function (c) {
          return scale.indexOf(c.grade);
        }),
      ) - 1,
    );
    var max = Math.min(scale.length - 1, Math.max(best, min + 1) + 1);
    var x = function (i) {
      return 46 + (i / Math.max(1, items.length - 1)) * 360;
    };
    var y = function (rank) {
      return 180 - ((rank - min) / Math.max(1, max - min)) * 150;
    };
    var ticks = [min, best, max].filter(function (v, i, a) {
      return v >= 0 && a.indexOf(v) === i;
    });
    var children = ticks.map(function (rank) {
      return h(
        React.Fragment,
        { key: rank },
        h("line", {
          className: "grid-line",
          x1: 46,
          x2: 406,
          y1: y(rank),
          y2: y(rank),
        }),
        h(
          "text",
          {
            className: "axis-label",
            x: 40,
            y: y(rank),
            textAnchor: "end",
            dominantBaseline: "middle",
          },
          scale[rank],
        ),
      );
    });
    if (points.length)
      children.push(
        h("path", {
          className: "pr-line " + kind,
          d:
            points
              .map(function (point, i) {
                return (i ? "L " : "M ") + x(point.index) + " " + y(point.rank);
              })
              .join(" ") +
            " L 406 " +
            y(points[points.length - 1].rank),
        }),
      );
    children.push(
      items.map(function (c, i) {
        var rank = scale.indexOf(c.grade);
        return rank < 0
          ? null
          : h("circle", {
              key: c.id,
              className: kind,
              cx: x(i),
              cy: y(rank),
              r: 5,
              fill: c.send === "Attempt" ? "var(--surface)" : "currentColor",
              stroke: "currentColor",
              strokeWidth: 2,
            });
      }),
    );
    if (best >= 0)
      children.push(
        h(
          "text",
          {
            className: "end-label " + kind,
            x: 414,
            y: y(best),
            dominantBaseline: "middle",
          },
          scale[best],
        ),
      );
    children.push(
      h(
        "text",
        { className: "axis-label", x: 46, y: 214 },
        fmtDate(items[0].date),
      ),
      h(
        "text",
        { className: "axis-label", x: 406, y: 214, textAnchor: "end" },
        fmtDate(items[items.length - 1].date),
      ),
    );
    return h(
      "div",
      { className: "chart-card" },
      h("h3", null, title),
      h("p", { className: "chart-sub" }, subtitle),
      h(
        "svg",
        {
          viewBox: "0 0 460 220",
          role: "img",
          style: { color: "var(--" + kind + ")" },
        },
        children,
      ),
    );
  }

  function VolumeChart({ climbs }) {
    var months = Array.from(
      new Set(
        climbs.map(function (c) {
          return monthKey(c.date);
        }),
      ),
    )
      .sort()
      .slice(-6);
    if (!months.length)
      return h(
        "svg",
        { viewBox: "0 0 460 220", role: "img" },
        h(
          "text",
          { className: "empty-chart", x: 230, y: 110, textAnchor: "middle" },
          "Log a climb to see monthly volume",
        ),
      );
    var counts = months.map(function (month) {
      return {
        month: month,
        boulder: climbs.filter(function (c) {
          return (
            monthKey(c.date) === month && disciplineOf(c.style) === "boulder"
          );
        }).length,
        route: climbs.filter(function (c) {
          return (
            monthKey(c.date) === month && disciplineOf(c.style) === "route"
          );
        }).length,
      };
    });
    var max = Math.max.apply(
      null,
      counts
        .map(function (c) {
          return Math.max(c.boulder, c.route);
        })
        .concat([2]),
    );
    return h(
      "svg",
      { viewBox: "0 0 460 220", role: "img" },
      counts.map(function (c, i) {
        var center = 50 + i * (360 / counts.length) + 180 / counts.length;
        return h(
          React.Fragment,
          { key: c.month },
          ["boulder", "route"].map(function (kind, offset) {
            var value = c[kind];
            return value
              ? h("rect", {
                  key: kind,
                  className: "bar-" + kind,
                  x: center - 18 + offset * 22,
                  y: 180 - (value / max) * 145,
                  width: 18,
                  height: (value / max) * 145,
                  rx: 4,
                  fill: "var(--" + kind + ")",
                })
              : null;
          }),
          h(
            "text",
            {
              className: "axis-label",
              x: center,
              y: 210,
              textAnchor: "middle",
            },
            monthLabel(c.month),
          ),
        );
      }),
    );
  }

  function Form({ onSave, onCancel }) {
    var [form, setForm] = React.useState({
      date: new Date().toISOString().slice(0, 10),
      style: "Boulder",
      grade: BOULDER_GRADES[0],
      send: "Flash",
      angle: "Slab",
      attempts: 1,
      effort: 5,
      location: "",
      notes: "",
    });
    function update(name, value) {
      setForm(function (current) {
        var next = Object.assign({}, current, { [name]: value });
        if (name === "style") next.grade = scaleFor(value)[0];
        return next;
      });
    }
    function submit(event) {
      event.preventDefault();
      if (!form.date || !form.location.trim()) return;
      onSave(
        Object.assign({}, form, {
          attempts: Math.max(1, Number(form.attempts) || 1),
          effort: Number(form.effort),
          location: form.location.trim(),
          notes: form.notes.trim(),
        }),
      );
    }
    var field = function (label, name, control) {
      return h(
        "div",
        { className: "field" },
        h("label", { htmlFor: "f-" + name }, label),
        control,
      );
    };
    return h(
      "section",
      { className: "panel" },
      h("h2", null, "Log a climb"),
      h(
        "form",
        { className: "log-form", onSubmit: submit },
        field(
          "Date",
          "date",
          h("input", {
            id: "f-date",
            type: "date",
            required: true,
            value: form.date,
            onChange: function (e) {
              update("date", e.target.value);
            },
          }),
        ),
        field(
          "Style",
          "style",
          h(
            "select",
            {
              id: "f-style",
              value: form.style,
              onChange: function (e) {
                update("style", e.target.value);
              },
            },
            STYLES.map(function (value) {
              return h("option", { key: value }, value);
            }),
          ),
        ),
        field(
          "Grade",
          "grade",
          h(
            "select",
            {
              id: "f-grade",
              value: form.grade,
              onChange: function (e) {
                update("grade", e.target.value);
              },
            },
            scaleFor(form.style).map(function (value) {
              return h("option", { key: value }, value);
            }),
          ),
        ),
        h(
          "div",
          { className: "field" },
          h("label", { htmlFor: "f-send" }, "Send type", sendHelp()),
          h(
            "select",
            {
              id: "f-send",
              value: form.send,
              onChange: function (e) {
                update("send", e.target.value);
              },
            },
            SENDS.map(function (value) {
              return h("option", { key: value }, value);
            }),
          ),
        ),
        field(
          "Wall angle",
          "angle",
          h(
            "select",
            {
              id: "f-angle",
              value: form.angle,
              onChange: function (e) {
                update("angle", e.target.value);
              },
            },
            ANGLES.map(function (value) {
              return h("option", { key: value }, value);
            }),
          ),
        ),
        field(
          "Attempts",
          "attempts",
          h("input", {
            id: "f-attempts",
            type: "number",
            min: 1,
            value: form.attempts,
            onChange: function (e) {
              update("attempts", e.target.value);
            },
          }),
        ),
        h(
          "div",
          { className: "field span-2" },
          h("label", { htmlFor: "f-effort" }, "Effort (RPE)"),
          h(
            "div",
            { className: "effort-row" },
            h("input", {
              id: "f-effort",
              type: "range",
              min: 1,
              max: 10,
              value: form.effort,
              onChange: function (e) {
                update("effort", e.target.value);
              },
            }),
            h("output", { htmlFor: "f-effort" }, form.effort + " / 10"),
          ),
        ),
        h(
          "div",
          { className: "field span-2" },
          h("label", { htmlFor: "f-location" }, "Location"),
          h("input", {
            id: "f-location",
            required: true,
            placeholder: "e.g. Stone Gardens",
            value: form.location,
            onChange: function (e) {
              update("location", e.target.value);
            },
          }),
        ),
        h(
          "div",
          { className: "field span-4" },
          h("label", { htmlFor: "f-notes" }, "Notes (optional)"),
          h("textarea", {
            id: "f-notes",
            placeholder: "Beta, crux, how it felt...",
            value: form.notes,
            onChange: function (e) {
              update("notes", e.target.value);
            },
          }),
        ),
        h(
          "div",
          { className: "form-actions" },
          h(
            "button",
            { type: "button", className: "ghost", onClick: onCancel },
            "Cancel",
          ),
          h("button", { type: "submit", className: "primary" }, "Save climb"),
        ),
      ),
    );
  }

  function App() {
    var [realClimbs, setRealClimbs] = React.useState(loadClimbs);
    var [showForm, setShowForm] = React.useState(false);
    var [filter, setFilter] = React.useState("All");
    var climbs = realClimbs.length ? realClimbs : SAMPLE_CLIMBS;
    function addClimb(data) {
      var next = realClimbs.concat([
        Object.assign({ id: "c" + Date.now(), createdAt: Date.now() }, data),
      ]);
      setRealClimbs(next);
      saveClimbs(next);
      setShowForm(false);
    }
    function removeClimb(id) {
      var next = realClimbs.filter(function (c) {
        return c.id !== id;
      });
      setRealClimbs(next);
      saveClimbs(next);
    }
    var filtered = climbs
      .filter(function (c) {
        return filter === "All" || c.style === filter;
      })
      .slice()
      .sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
    return h(
      "div",
      { className: "wrap" },
      h(
        "header",
        { className: "top" },
        h(
          "div",
          null,
          h("p", { className: "brand-eyebrow" }, "Climbing Log"),
          h("h1", null, "Beta ", h("span", null, "Book")),
          h(
            "p",
            { className: "tagline" },
            "Every send, every project, every wall angle - tracked from first V0 to your current project.",
          ),
        ),
        h(
          "button",
          {
            className: "primary",
            type: "button",
            onClick: function () {
              setShowForm(!showForm);
            },
          },
          showForm ? "Close form" : "+ Log a climb",
        ),
      ),
      realClimbs.length === 0 &&
        h(
          "div",
          { className: "banner" },
          h(
            "span",
            null,
            h("span", { className: "dot" }, "●"),
            " Showing ",
            h("strong", null, "example climbs"),
            " so you can see how this works.",
          ),
          h(
            "span",
            null,
            "Log your first real send below and this data disappears.",
          ),
        ),
      h(Stats, { climbs: climbs }),
      showForm &&
        h(Form, {
          onSave: addClimb,
          onCancel: function () {
            setShowForm(false);
          },
        }),
      h(
        "section",
        { className: "charts-row" },
        h(ProgressChart, {
          climbs: climbs,
          kind: "boulder",
          title: "Boulder progression",
          subtitle: "Highest grade sent over time",
        }),
        h(ProgressChart, {
          climbs: climbs,
          kind: "route",
          title: "Route progression",
          subtitle: "Sport & trad, highest grade sent",
        }),
        h(
          "div",
          {
            className: "chart-card",
            style: { gridColumn: "1/-1", overflowX: "auto" },
          },
          h("h3", null, "Monthly volume"),
          h(
            "p",
            { className: "chart-sub" },
            "Climbs logged per month, by discipline",
          ),
          h(VolumeChart, { climbs: climbs }),
          h(
            "div",
            { className: "legend" },
            h(
              "span",
              { className: "legend-item" },
              h("span", { className: "swatch boulder" }),
              "Boulder",
            ),
            h(
              "span",
              { className: "legend-item" },
              h("span", { className: "swatch route" }),
              "Route",
            ),
          ),
        ),
      ),
      h(
        "section",
        { className: "panel", style: { padding: "20px 0 0" } },
        h(
          "div",
          { className: "log-head", style: { padding: "0 22px 14px" } },
          h("h2", { style: { margin: 0 } }, "Climb log"),
          h(
            "div",
            { className: "chips" },
            ["All"].concat(STYLES).map(function (style) {
              return h(
                "button",
                {
                  key: style,
                  type: "button",
                  className: "chip",
                  "aria-pressed": filter === style,
                  onClick: function () {
                    setFilter(style);
                  },
                },
                style,
              );
            }),
          ),
        ),
        h(
          "div",
          { className: "log-list" },
          h(
            "div",
            { className: "log-row head-row" },
            h("span", null, "Date"),
            h("span", null, "Grade"),
            h("span", null, "Style / send ", sendHelp()),
            h("span", null, "Attempts"),
            h("span", null, "Effort"),
            h("span", null, "Location"),
            h("span", null),
          ),
          filtered.length
            ? filtered.map(function (c) {
                var kind = disciplineOf(c.style);
                var sent = c.send !== "Attempt";
                return h(
                  "div",
                  { className: "log-row", key: c.id },
                  h(
                    "span",
                    { className: "cell-date" },
                    fmtDate(c.date),
                    c.sample &&
                      h("span", { className: "sample-tag" }, "example"),
                  ),
                  h(
                    "span",
                    { className: "grade-badge" },
                    h("span", { className: "dot " + kind }),
                    c.grade,
                  ),
                  h(
                    "span",
                    { className: "cell-style" },
                    c.style,
                    h("br"),
                    h(
                      "span",
                      { className: "send-tag" + (sent ? " sent" : "") },
                      h("span", { className: "ring" }),
                      c.send,
                    ),
                  ),
                  h("span", null, (c.attempts || 1) + "x"),
                  h(
                    "span",
                    { className: "cell-effort" },
                    (c.effort || 0) + "/10",
                    h(
                      "span",
                      { className: "meter" },
                      h("span", {
                        style: { width: (c.effort || 0) * 10 + "%" },
                      }),
                    ),
                  ),
                  h(
                    "span",
                    { className: "cell-where" },
                    c.location,
                    h("br"),
                    h("span", { className: "angle" }, c.angle),
                  ),
                  h(
                    "span",
                    null,
                    !c.sample &&
                      h(
                        "button",
                        {
                          type: "button",
                          className: "row-del",
                          title: "Delete",
                          onClick: function () {
                            removeClimb(c.id);
                          },
                        },
                        "x",
                      ),
                  ),
                );
              })
            : h(
                "div",
                { className: "empty-log" },
                "No climbs match this filter yet.",
              ),
        ),
      ),
      h(
        "footer",
        { className: "note" },
        "Saved locally in this browser - clearing site data will erase your log.",
      ),
    );
  }

  ReactDOM.createRoot(document.getElementById("react-root")).render(h(App));
})();
