import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useState } from 'react';
const BarChart = ({barData}) => { 
    const [barValues,setBarValues] = useState([])
    const transformArray = () => {
        // Поточний масив з даними

  
  // Всі можливі умови
  const allConditions = [
    '00-06am', '06-10am', '10-14pm', '14-18pm', '18-12pm'
    // додайте інші можливі умови
  ];
  
  // Створюємо новий масив
  const newData = allConditions.reduce((acc, condition) => {
    // Перевіряємо, чи є поточна умова в існуючому масиві
    const existingCondition = barData.find(data => data._id === condition);
  
    // Якщо поточна умова відсутня, додаємо новий об'єкт із count: 0
    if (!existingCondition) {
      acc.push({ _id: condition, count: 0 });
    } else {
      // Якщо поточна умова вже є в масиві, додаємо її без змін
      acc.push(existingCondition);
    }
  
    return acc;
  }, []);
  
  // Потрібно відсортувати новий масив в заданому порядку
  const sortOrder = ['00-06am', '06-10am', '10-14pm', '14-18pm', '18-12pm'];
  const sortedData = newData.sort((a, b) => sortOrder.indexOf(a._id) - sortOrder.indexOf(b._id));
  const getCount = sortedData.map(e=>{
    return e.count
  })
  return getCount
  console.log(sortedData); // Оновлений масив із недостаючими умовами та значеннями count
  
    }
    useEffect(()=>{
        if(barData){
            setBarValues(transformArray())
        }
    },[barData])
  const data = {
    labels: ['00-6', '6-10', '10-14', '14-18','18-00' ],
    datasets: [
      {
        label: 'Total transaction',
        data: barValues,
        backgroundColor: [
          'rgba(255, 255, 255, 0.708)',
      
        ],
        barThickness: 8,
        borderRadius: 10 
},
    ],
  };

  const options = {
    
    scales: {
      x: {
        grid: {
          display: false, // Приховати сітку на осі X
        },
      },
      y: {
        grid: {
          display: false, // Приховати сітку на осі Y
        },
        ticks: {
            font: { weight: 'normal', size: 14 }, // Налаштування шрифту для значень
            color: 'white', // Колір для значень
          },
      },
    },
    plugins: {
        legend: {
          display: false, // Приховати легенду
        },
      },
   
  };

  return (
    <div  >
      
      <Bar style={{background:'#4fa4fb',borderRadius:20,padding:8,height:200}}data={data} options={options} />
    </div>
  );
};

export default BarChart;
