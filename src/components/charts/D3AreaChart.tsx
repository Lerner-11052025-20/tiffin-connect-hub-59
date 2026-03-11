import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { format } from "date-fns";

interface DataPoint {
  date: string;
  amount: number;
}

interface D3AreaChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showGradient?: boolean;
}

const D3AreaChart: React.FC<D3AreaChartProps> = ({ 
  data, 
  color = "#0ea5e9", 
  height = 300,
  showGradient = true 
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

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const h = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parseDate = d3.timeParse("%d %b");
    const formattedData = data.map(d => ({
      ...d,
      dateObj: parseDate(d.date) || new Date()
    })).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    // Scales
    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.dateObj) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.amount) as number * 1.1])
      .range([h, 0]);

    // Grid lines
    const yGrid = d3.axisLeft(y)
      .tickSize(-width)
      .tickFormat(() => "")
      .ticks(5);

    g.append("g")
      .attr("class", "grid")
      .call(yGrid)
      .selectAll("line")
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-dasharray", "3,3");

    g.select(".domain").remove();

    // Gradient
    const gradientId = `area-gradient-${Math.random().toString(36).substr(2, 9)}`;
    if (showGradient) {
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0.4);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color)
        .attr("stop-opacity", 0);
    }

    // Area generator
    const area = d3.area<any>()
      .x(d => x(d.dateObj))
      .y0(h)
      .y1(d => y(d.amount))
      .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3.line<any>()
      .x(d => x(d.dateObj))
      .y(d => y(d.amount))
      .curve(d3.curveMonotoneX);

    // Append area
    g.append("path")
      .datum(formattedData)
      .attr("fill", showGradient ? `url(#${gradientId})` : "none")
      .attr("d", area)
      .attr("opacity", 1);

    // Append line
    g.append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .attr("d", line);

    // Axes
    const xAxis = d3.axisBottom(x)
      .ticks(6)
      .tickFormat(d => d3.timeFormat("%d %b")(d as Date));

    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `₹${d}`);

    g.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(xAxis)
      .attr("color", "rgba(255, 255, 255, 0.3)")
      .selectAll("text")
      .attr("font-size", "9px")
      .attr("font-weight", "bold");

    g.append("g")
      .call(yAxis)
      .attr("color", "rgba(255, 255, 255, 0.3)")
      .selectAll("text")
      .attr("font-size", "9px")
      .attr("font-weight", "bold");

    g.selectAll(".domain").remove();
    g.selectAll(".tick line").remove();

    // Tooltip behavior
    const focus = g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
      .attr("r", 5)
      .attr("fill", color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

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

    const bisectDate = d3.bisector((d: any) => d.dateObj).left;

    svg.on("mousemove", (event) => {
      const [mx, my] = d3.pointer(event);
      const x0 = x.invert(mx - margin.left);
      const i = bisectDate(formattedData, x0, 1);
      const d0 = formattedData[i - 1];
      const d1 = formattedData[i];
      if (!d1) return;
      const d = (x0.getTime() - d0.dateObj.getTime() > d1.dateObj.getTime() - x0.getTime()) ? d1 : d0;

      focus.attr("transform", `translate(${x(d.dateObj)},${y(d.amount)})`);
      focus.style("display", null);

      tooltip
        .style("visibility", "visible")
        .style("left", (mx + 10) + "px")
        .style("top", (my - 40) + "px")
        .html(`<div class="uppercase text-[9px] opacity-60 mb-1">${d.date}</div><div>₹${d.amount.toLocaleString()}</div>`);
    });

    svg.on("mouseleave", () => {
      focus.style("display", "none");
      tooltip.style("visibility", "hidden");
    });

  }, [data, dimensions, color, showGradient]);

  return (
    <div ref={containerRef} className="w-full relative" style={{ height }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} style={{ overflow: "visible" }} />
    </div>
  );
};

export default D3AreaChart;
