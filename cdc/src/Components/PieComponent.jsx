import React from 'react';
import { Pie } from 'react-chartjs-2';
 // eslint-disable-next-line
import Chart from 'chart.js/auto';

function PieComponent() {
  const defaultLabel = ['placed', 'unplaced', 'higherStudies'];
  const defaultData = [20, 5, 7];

  const chartData = {
    labels: defaultLabel,
    datasets: [
      {
        label: 'Placement Report',
        data: defaultData,
        backgroundColor: [
          '#088d7f',
          '#d636a4',
          '#dbc434',
        ],
        borderColor: '#f6e9fa',
        borderWidth: .5,
      },
    ],
  };

  return (
    <Pie data={chartData} />
  );
}

export default PieComponent;
