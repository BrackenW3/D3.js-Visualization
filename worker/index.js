
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D3.js Professional Dashboard</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
:root {
    --bg-color: #f4f6f8;
    --text-color: #333;
    --card-bg: #fff;
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body.dark-mode {
    --bg-color: #1e1e2f;
    --text-color: #e0e0e0;
    --card-bg: #2b2b40;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    transition: background-color 0.3s, color 0.3s;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    padding: 20px;
}

.dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: var(--card-bg);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--shadow);
}

main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 20px;
}

.card {
    background: var(--card-bg);
    padding: 20px;
    border-radius: 8px;
    box-shadow: var(--shadow);
    min-height: 400px;
    position: relative;
}

h2 {
    margin-bottom: 15px;
    font-size: 1.2rem;
    font-weight: 500;
}

.chart-container {
    width: 100%;
    height: 350px;
}

.btn {
    padding: 10px 20px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.1s;
}

.btn:active {
    transform: scale(0.98);
}

.theme-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Switch Styles */
.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
}

input:checked + .slider {
    background-color: var(--primary-color);
}

input:checked + .slider:before {
    transform: translateX(26px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.tooltip {
    position: absolute;
    text-align: center;
    padding: 8px;
    font: 12px sans-serif;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 4px;
    pointer-events: none;
    transition: opacity 0.2s;
    z-index: 10;
}

@media (max-width: 768px) {
    main {
        grid-template-columns: 1fr;
    }
}
    </style>
</head>
<body>
    <div class="dashboard-container">
        <header>
            <h1>Analytics Dashboard</h1>
            <div class="controls">
                <button id="refresh-btn" class="btn">Refresh Data</button>
                <div class="theme-toggle">
                    <label class="switch">
                        <input type="checkbox" id="theme-switch">
                        <span class="slider round"></span>
                    </label>
                    <span>Dark Mode</span>
                </div>
            </div>
        </header>
        <main>
            <div class="grid-item card" id="chart-line">
                <h2>Revenue Trends</h2>
                <div class="chart-container"></div>
                <div class="tooltip" style="opacity:0;"></div>
            </div>
            <div class="grid-item card" id="chart-bar">
                <h2>User Acquisition</h2>
                <div class="chart-container"></div>
            </div>
            <div class="grid-item card" id="chart-force">
                <h2>Network Analysis</h2>
                <div class="chart-container"></div>
            </div>
            <div class="grid-item card" id="chart-scatter">
                <h2>Performance Metrics</h2>
                <div class="chart-container"></div>
            </div>
        </main>
    </div>
    <script>
// Data Generation
const generateTimeSeries = (n) => {
    const data = [];
    let value = 100;
    const now = new Date();
    for (let i = 0; i < n; i++) {
        const date = new Date(now.getTime() - (n - i) * 24 * 60 * 60 * 1000);
        value = Math.max(10, value + (Math.random() - 0.5) * 20);
        data.push({ date, value });
    }
    return data;
};

const generateCategories = (n) => {
    return Array.from({ length: n }, (_, i) => ({
        category: \`Cat \${i + 1}\`,
        value: Math.floor(Math.random() * 100) + 20
    }));
};

const generateNetwork = (n) => {
    const nodes = Array.from({ length: n }, (_, i) => ({ id: \`Node \${i}\`, group: Math.floor(Math.random() * 4) }));
    const links = [];
    for (let i = 0; i < n; i++) {
        const source = i;
        const target = Math.floor(Math.random() * n);
        if (source !== target) links.push({ source: nodes[source].id, target: nodes[target].id, value: Math.random() });
    }
    return { nodes, links };
};

const generateScatter = (n) => {
    return Array.from({ length: n }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        type: Math.floor(Math.random() * 3)
    }));
};

// Theme Colors
const themes = {
    light: {
        bg: "#fff",
        text: "#333",
        grid: "#e0e0e0",
        colors: ["#007bff", "#28a745", "#dc3545", "#ffc107"]
    },
    dark: {
        bg: "#2b2b40",
        text: "#e0e0e0",
        grid: "#444",
        colors: ["#4dabf7", "#69db7c", "#ff8787", "#ffd43b"]
    }
};

let currentTheme = "light";

// Charts
const renderLineChart = (containerId, data) => {
    const container = d3.select(containerId);
    container.html("");
    const { width, height } = container.node().getBoundingClientRect();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);

    const line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

    svg.append("g")
        .attr("transform", \`translate(0,\${height - margin.bottom})\`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .attr("transform", \`translate(\${margin.left},0)\`)
        .call(d3.axisLeft(y))
        .attr("color", themes[currentTheme].text)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - margin.right - margin.left)
            .attr("stroke-opacity", 0.1)
            .attr("stroke", themes[currentTheme].grid));

    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", themes[currentTheme].colors[0])
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    // Animation
    const totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .attr("stroke-dashoffset", 0);
};

const renderBarChart = (containerId, data) => {
    const container = d3.select(containerId);
    container.html("");
    const { width, height } = container.node().getBoundingClientRect();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", \`translate(0,\${height - margin.bottom})\`)
        .call(d3.axisBottom(x))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .attr("transform", \`translate(\${margin.left},0)\`)
        .call(d3.axisLeft(y))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
            .attr("x", d => x(d.category))
            .attr("y", y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", (d, i) => themes[currentTheme].colors[i % 4])
        .transition()
            .duration(1000)
            .delay((d, i) => i * 100)
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value));
};

const renderForceGraph = (containerId, data) => {
    const container = d3.select(containerId);
    container.html("");
    const { width, height } = container.node().getBoundingClientRect();

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke", themes[currentTheme].grid)
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", themes[currentTheme].bg)
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => themes[currentTheme].colors[d.group])
        .call(drag(simulation));

    node.append("title")
        .text(d => d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
};

const renderScatterPlot = (containerId, data) => {
    const container = d3.select(containerId);
    container.html("");
    const { width, height } = container.node().getBoundingClientRect();
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleLinear()
        .domain([0, 100])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", \`translate(0,\${height - margin.bottom})\`)
        .call(d3.axisBottom(x))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .attr("transform", \`translate(\${margin.left},0)\`)
        .call(d3.axisLeft(y))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.x))
        .attr("cy", d => y(d.y))
        .attr("r", 0)
        .attr("fill", d => themes[currentTheme].colors[d.type])
        .attr("opacity", 0.7)
        .transition()
        .duration(1000)
        .attr("r", d => d.size);
};

// Main App Logic
const init = () => {
    const lineData = generateTimeSeries(50);
    const barData = generateCategories(8);
    const forceData = generateNetwork(30);
    const scatterData = generateScatter(50);

    const renderAll = () => {
        renderLineChart("#chart-line .chart-container", lineData);
        renderBarChart("#chart-bar .chart-container", barData);
        renderForceGraph("#chart-force .chart-container", forceData);
        renderScatterPlot("#chart-scatter .chart-container", scatterData);
    };

    renderAll();

    // Performance optimization: Debounce resize events to prevent excessive re-renders
    let resizeTimeout;
    window.addEventListener("resize", () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderAll();
        }, 250);
    });

    document.getElementById("theme-switch").addEventListener("change", (e) => {
        document.body.classList.toggle("dark-mode");
        currentTheme = e.target.checked ? "dark" : "light";
        renderAll();
    });

    document.getElementById("refresh-btn").addEventListener("click", () => {
        // Regenerate data
        const newLineData = generateTimeSeries(50);
        const newBarData = generateCategories(8);
        const newForceData = generateNetwork(30);
        const newScatterData = generateScatter(50);

        renderLineChart("#chart-line .chart-container", newLineData);
        renderBarChart("#chart-bar .chart-container", newBarData);
        renderForceGraph("#chart-force .chart-container", newForceData);
        renderScatterPlot("#chart-scatter .chart-container", newScatterData);
    });
};

init();
    </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    // SECURITY: Added essential security headers to prevent clickjacking, XSS, and content sniffing.
    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Content-Security-Policy": "default-src 'self' 'unsafe-inline' https://d3js.org; script-src 'self' 'unsafe-inline' https://d3js.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
      },
    });
  },
};
