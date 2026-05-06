import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface Props { data: { timestamp: number; resonance: number }[]; }

const ResonanceGraph: React.FC<Props> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current || data.length === 0) return;
        const svg = d3.select(svgRef.current);
        const [w, h] = [400, 150];
        const margin = { top: 20, right: 10, bottom: 20, left: 30 };
        
        svg.selectAll('*').remove();

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.timestamp) as [number, number])
            .range([margin.left, w - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, 2.5])
            .range([h - margin.bottom, margin.top]);

        const line = d3.line<{ timestamp: number; resonance: number }>()
            .x(d => x(d.timestamp))
            .y(d => y(d.resonance))
            .curve(d3.curveCardinal.tension(0.5));

        const isDissonant = data[0]?.resonance > 1.2;

        // The Baseline (◦A)
        svg.append('line')
            .attr('x1', margin.left)
            .attr('x2', w - margin.right)
            .attr('y1', y(1.0))
            .attr('y2', y(1.0))
            .attr('stroke', '#164e63')
            .attr('stroke-dasharray', '2,2');

        // The Pulse Path
        const path = svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', isDissonant ? '#ff0055' : '#00FFFF')
            .attr('stroke-width', isDissonant ? 4 : 2)
            .attr('style', isDissonant ? 'filter: drop-shadow(0 0 8px #ff0055)' : 'filter: drop-shadow(0 0 3px #00FFFF)')
            .attr('d', line);

        // The "Squeeze" Animation
        if (isDissonant) {
            path.transition()
                .duration(200)
                .attr('stroke-width', 8)
                .transition()
                .duration(800)
                .ease(d3.easeElasticOut)
                .attr('stroke-width', 2)
                .attr('stroke', '#00FFFF')
                .attr('style', 'filter: drop-shadow(0 0 3px #00FFFF)');
        }
    }, [data]);

    return (
        <div className="relative border border-cyan-900 bg-black/60 p-2 overflow-hidden">
            <svg ref={svgRef} width="100%" height="150" viewBox="0 0 400 150" className="transition-all duration-500" />
            <div className="absolute top-2 right-2 text-[10px] uppercase tracking-widest text-cyan-800">
                Resonance: {data[0]?.resonance.toFixed(2) || "0.00"}
            </div>
        </div>
    );
};
export default ResonanceGraph;
