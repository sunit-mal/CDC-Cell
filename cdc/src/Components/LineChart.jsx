import React from 'react';
import { Line } from 'react-chartjs-2';
// eslint-disable-next-line
import Chart from 'chart.js/auto';

function LineChart() {
    const defaultLabel = [2018, 2019, 2020, 2021, 2022, 2023];
    const PlacedData = [30, 35, 45, 48, 50, 60];
    const UnplacedData = [10, 25, 15, 10, 15, 5]; // Data for the new line

    const chartData = {
        labels: defaultLabel,
        datasets: [
            {
                label: 'Placement Report',
                data: PlacedData,
                backgroundColor: [
                    '#7308ff',
                ],
                borderColor: '#7308ff',
                borderWidth: 2,
            },
            {
                label: 'Unplaced Report',
                data: UnplacedData,
                backgroundColor: [
                    'red',
                ],
                borderColor: 'red',
                borderWidth: 2,
            },
        ],
    };

    return (
        <Line data={chartData}/>
    );
}


export default LineChart