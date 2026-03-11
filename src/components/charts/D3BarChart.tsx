import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface DataPoint {
  date: string;
  amount: number;
}

interface D3BarChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  barColor?: string;
}

const D3BarChart: React.FC<D3BarChartProps> = ({ 
  data, 
  color = "#4facfe", 
  height = 300,
  barColor = "#4facfe"
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: height });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: height
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const h = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.amount) as number * 1.1])
      .range([h, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => "").ticks(5))
      .selectAll("line")
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-dasharray", "3,3");

    // Bars
    const bars = g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.date) || 0)
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.amount))
      .attr("height", d => h - y(d.amount))
      .attr("fill", barColor)
      .attr("rx", 6)
      .attr("ry", 6)
      .attr("opacity", 0.8);

    // Axes
    const xAxis = d3.axisBottom(x)
      .tickSize(0);

    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `₹${d}`);

    g.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(xAxis)
      .attr("color", "rgba(255, 255, 255, 0.3)")
      .attr("font-size", "9px")
      .attr("font-weight", "bold")
      .selectAll("text")
      .attr("dy", "1em");

    g.append("g")
      .call(yAxis)
      .attr("color", "rgba(255, 255, 255, 0.3)")
      .attr("font-size", "9px")
      .attr("font-weight", "bold");

    g.selectAll(".domain, .tick line").remove();

    // Tooltip behavior
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(10, 10, 15, 0.98)")
      .style("backdrop-filter", "blur(12px)")
      .style("border", "1px solid rgba(255, 255, 255, 0.1)")
      .style("border-radius", "12px")
      .style("padding", "8px 12px")
      .style("color", "#fff")
      .style("font-size", "11px")
      .style("font-weight", "800")
      .style("pointer-events", "none")
      .style("z-index", "100")
      .style("box-shadow", "0 10px 25px -5px rgba(0, 0, 0, 0.5)");

    bars.on("mouseover", (event, d) => {
      d3.select(event.currentTarget).attr("opacity", 1).attr("fill", "#fff");
      tooltip
        .style("visibility", "visible")
        .style("left", (event.pageX - containerRef.current!.getBoundingClientRect().left + 15) + "px")
        .style("top", (event.pageY - containerRef.current!.getBoundingClientRect().top - 40) + "px")
        .html(`<div class="uppercase text-[9px] opacity-60 mb-1">${d.date}</div><div>₹${d.amount.toLocaleString()}</div>`);
    });

    bars.on("mousemove", (event) => {
      tooltip
        .style("left", (event.pageX - containerRef.current!.getBoundingClientRect().left + 15) + "px")
        .style("top", (event.pageY - containerRef.current!.getBoundingClientRect().top - 40) + "px");
    });

    bars.on("mouseout", (event) => {
      d3.select(event.currentTarget).attr("opacity", 0.8).attr("fill", barColor);
      tooltip.style("visibility", "hidden");
    });

  }, [data, dimensions, barColor]);

  return (
    <div ref={containerRef} className="w-full relative" style={{ height }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ overflow: "visible" }} />
    </div>
  );
};

export default D3BarChart;
