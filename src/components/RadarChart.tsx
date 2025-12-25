import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface RadarChartProps {
    ratings: {
        lyrics: number;
        beat: number;
        flow: number;
        style: number;
        videoclip: number;
    };
    isMini?: boolean;
}

export function RadarChart({ ratings, isMini = false }: RadarChartProps) {
    // We have 5 metrics. To make it a "Hexagon", we can add an "Overall" average as the 6th point.
    const average = Object.values(ratings).reduce((a, b) => a + b, 0) / 5;

    const data = {
        labels: ['Lyrics', 'Beat', 'Flow', 'Style', 'Video', 'Overall'],
        datasets: [
            {
                label: 'Singer Stats',
                data: [
                    ratings.lyrics,
                    ratings.beat,
                    ratings.flow,
                    ratings.style,
                    ratings.videoclip,
                    average,
                ],
                backgroundColor: 'rgba(34, 211, 238, 0.2)', // cyan-400 with opacity
                borderColor: 'rgba(34, 211, 238, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(168, 85, 247, 1)', // purple-500
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(168, 85, 247, 1)',
            },
        ],
    };

    const options = {
        scales: {
            r: {
                min: 0,
                max: 5,
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                pointLabels: {
                    display: !isMini,
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: isMini ? 8 : 12,
                        weight: 'bold' as const,
                    },
                },
                ticks: {
                    display: false,
                    stepSize: 1,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: !isMini,
                callbacks: {
                    label: (context: any) => `Rating: ${context.raw.toFixed(1)}`,
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className={`w-full h-full flex items-center justify-center ${!isMini ? 'p-4 bg-gray-900/40 rounded-3xl border border-gray-700/50 backdrop-blur-md' : ''}`}>
            <Radar data={data} options={options} />
        </div>
    );
}
