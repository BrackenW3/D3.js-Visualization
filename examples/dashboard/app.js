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
        category: `Cat ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 20
    }));
};

const generateNetwork = (n) => {
    const nodes = Array.from({ length: n }, (_, i) => ({ id: `Node ${i}`, group: Math.floor(Math.random() * 4) }));
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
    if (width === 0 || height === 0) return;

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
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
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
    if (width === 0 || height === 0) return;

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
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
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
    if (width === 0 || height === 0) return;

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
    if (width === 0 || height === 0) return;

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
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .attr("color", themes[currentTheme].text);

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
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

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderAll);
    } else {
        renderAll();
    }

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
