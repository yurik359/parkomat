import { Pie,Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { getListItems,getPaymentsSystems } from "../../services/requests";
import { useEffect,useState } from 'react';
import { useTranslation } from '../../services/translations';

const PieChart = ({pieData,parkomatItemsList}) => {
  const [labelsData,setLabelsData] = useState(null)
  const [valuesData,setValuesData] = useState(null)
  const { language  } = useSelector(
    (state) => state.slotsSlice
  );
  const {t}= useTranslation(language)
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
    
    sortedArray = pieDataWithName.sort((a, b) => b.count - a.count)
    if (sortedArray.length>10) {
        sortedArray = sortedArray.slice(0, 10);
    }
   console.log(sortedArray)
    
} 
return sortedArray
}
  useEffect(()=>{
    
   const arrayForStatistic = getArrayForStatistic()
   
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
                'rgba(255, 106, 46, 0.6)',
                'rgba(46, 169, 255, 0.6)',
                'rgba(255, 46, 190, 0.6)',
                'rgba(46, 255, 104, 0.6)',
                'rgba(204, 46, 255, 0.6)',
                'rgba(255, 218, 46, 0.6)',
                'rgba(46, 255, 218, 0.6)',
                'rgba(147, 46, 255, 0.6)',
                'rgba(46, 255, 71, 0.6)',
                'rgba(255, 46, 79, 0.6)'
            ], 
          },
        ],
      };
   
    return (
<>
    {pieData?.length!==0?<div>
        <h2 style={{textAlign:'center'}}>{t('top')} {labelsData.length} {t('parking')}</h2>
        <Doughnut data={data}  /></div>
       :<div style={{height:200,display:'flex',alignItems:'center'}}><span>{t('noData')}</span></div>}
      </>
   )
};

export default PieChart;
