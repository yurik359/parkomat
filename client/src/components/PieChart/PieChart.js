import { Pie,Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { getListItems,getPaymentsSystems } from "../../services/requests";
import { useEffect,useState } from 'react';


const PieChart = ({pieData,parkomatItemsList}) => {
  const [labelsData,setLabelsData] = useState(null)
  const [valuesData,setValuesData] = useState(null)
  
  useEffect(()=>{console.log(pieData)},[pieData])
   const getArrayForStatistic = ()=>{
    let sortedArray
if (pieData&&parkomatItemsList) {
    parkomatItemsList.map(e=>{
        
    })
    let pieDataWithName=[]
    for (let el = 0; el < parkomatItemsList.length; el++) {
        for(let i = 0; i < pieData.length; i++) {
            if(parkomatItemsList[el]._id ===pieData[i]._id){
                pieDataWithName.push({_id:pieData[i]._id,count:pieData[i].count,name:parkomatItemsList[el].nameOfslot})
            }
        }
       
    }
    const parkomatWithZeroTransaction = parkomatItemsList.filter(item1 => !pieData.find(item2 => item2._id === item1._id)).map(e=>{
        return {_id:e._id,count:0,name:e.nameOfslot}
    })
   const  allParkomatTransaction = [...pieDataWithName,...parkomatWithZeroTransaction]
   
    sortedArray = allParkomatTransaction.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

} 
return sortedArray
}
  useEffect(()=>{
   const arrayForStatistic = getArrayForStatistic();
   if(arrayForStatistic) {
   setLabelsData(arrayForStatistic.map(e=>{
    return e.name
})) 
    setValuesData(arrayForStatistic.map(e=>{
        return e.count
    }))
   }
  

  },[pieData])
   
    const data = {
        labels: labelsData,
        datasets: [
          {
            label: 'Total transaction',
            data:  valuesData, // Значення для кожної категорії
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(255, 106, 46, 0.6)',
            ], // Кольори для кожної категорії
            // borderColor: [
            //   'rgba(255, 99, 132, 1)',
            //   'rgba(54, 162, 235, 1)',
            //   'rgba(255, 206, 86, 1)',
            //   'rgba(255, 206, 86, 1)',
            // ], // Обводка кольорів
            // borderWidth: 1,
          },
        ],
      };
    //   const options = {
    //     plugins: {
    //       datalabels: {
    //         color: '#fff', // Колір тексту міток
    //         formatter: (value, context) => {
    //           return value; // Значення, яке ви бажаєте відображати на графіку
    //         },
    //       },
    //     },
    //   };

    return (
<>
    {pieData?.length!==0?<div>
        <h2>Кругова діаграма</h2>
        <Doughnut data={data}  /></div>
       :<div style={{height:200,display:'flex',alignItems:'center'}}><span>немає данних за цей період</span></div>}
      </>
   )
};

export default PieChart;
